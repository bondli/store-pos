import * as fs from 'fs';
import * as path from 'path';
import { app, ipcMain, BrowserWindow, globalShortcut, dialog } from 'electron';
import { fork } from 'child_process';
import Store from 'electron-store';
import logger from 'electron-log';
import dayjs from 'dayjs';

// file position on macOS: ~/Library/Logs/{app name}/main.log
// file position on windows: C:\Users\Administrator\AppData\Roaming\store-pos\main.log
// db file position on macOs:  ~/Library/Application Support/store-pos/sqlite3/storepos-database.db
// db file position on windows: C:\Users\Administrator\AppData\Roaming\store-pos\sqlite3\storepos-database.db
logger.transports.file.fileName = 'main.log';
logger.transports.file.level = 'info';
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';

// 数据持久化
const store = new Store();

// 通过bridge的方式开放给渲染进程的功能
const initIpcRenderer = () => {
  ipcMain.on('setStore', (_, key, value) => {
    store.set(key, value);
  });

  ipcMain.on('getStore', (_, key) => {
    const value = store.get(key);
    _.returnValue = value || '';
  });

  ipcMain.on('deleteStore', (_, key) => {
    store.delete(key);
    _.returnValue = '';
  });

  // 打日志
  ipcMain.on('userLog', (_, message) => {
    logger.info(message);
  });

  // 导出数据库
  ipcMain.on('export-data', async (event) => {
    const fileToDownload = path.join(app.getPath('userData'), 'sqlite3', 'storepos-database.db');
    const defaultFileName = `storepos-database-${dayjs().format('YYYY-MM-DD')}.db`;

    try {
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: '保存数据库文件',
        defaultPath: defaultFileName,
        filters: [
          { name: 'Database Files', extensions: ['db'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (canceled || !filePath) {
        return;
      }

      // 从用户数据目录拷贝文件到用户选择的路径
      fs.copyFileSync(fileToDownload, filePath);
      logger.info(`database copied to: ${filePath}`);
      event.reply('export-data-reply', { success: true });
    } catch(err) {
      logger.error(err);
      event.reply('export-data-reply', { success: false, error: err.message });
    }
  });

  // 导入数据库
  ipcMain.on('import-data', async (event) => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: '选择要导入的数据库文件',
        filters: [
          { name: 'Database Files', extensions: ['db'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (canceled || !filePaths || filePaths.length === 0) {
        return;
      }

      const filePath = filePaths[0];
      const fileToUpload = path.join(app.getPath('userData'), 'sqlite3', 'storepos-database.db');

      // 从用户选择的文件拷贝到应用数据目录
      fs.copyFileSync(filePath, fileToUpload);
      logger.info(`database copied to application data directory: ${fileToUpload}`);
      event.reply('import-data-reply', { success: true });
    } catch(err) {
      logger.error(err);
      event.reply('import-data-reply', { success: false, error: err.message });
    }
  });
};

// 定义ipcRenderer监听事件
initIpcRenderer();

// 启动服务器
let serverStatus = '';
const startNodeServer = () => {
  logger.info('server will be start');
  const dbPath = path.join(app.getPath('userData'), 'sqlite3', 'storepos-database.db');
  logger.info('server db path: ', dbPath);
  const child = fork(path.join(__dirname, 'server', 'index'), [], {
    env: {
      ...process.env,
      DBPATH: dbPath,
    },
  });

  child.on('error', (err) => {
    logger.info('server error:', err);
  });

  child.on('message', (data) => {
    logger.info('server stdout: ' , data);
    serverStatus = 'success';
  });

  child.on('exit', (code, signal) => {
    logger.info('server exit code: ', code);
    logger.info('server exit signal: ', signal);
  });

  child.unref();
  //on parent process exit, terminate child process too.
  process.on('exit', () => {
    child.kill();
  });
};

startNodeServer();

let mainWindow: any = null;

const createWindow = () => {
  logger.info('main window will be create');
  mainWindow = new BrowserWindow({
    title: '旺店宝',
    center: true,
    autoHideMenuBar: true,
    resizable: true,
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 720,
    webPreferences: {
      webSecurity: false,
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // 禁用 nodeIntegration 以配合 contextIsolation
      contextIsolation: true, // 启用上下文隔离
    },
  });

  // 启用默认的右键菜单
  mainWindow.webContents.on('context-menu', (_, props) => {
    const { Menu } = require('electron');
    const menu = Menu.buildFromTemplate([
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { type: 'separator' },
      { label: '全选', role: 'selectAll' },
    ]);
    menu.popup();
  });

  const openWin = () => {
    if (!app.isPackaged) {
      mainWindow.loadURL('http://localhost:3000/');
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile('dist/index.html').catch(() => null);
      mainWindow.setMenuBarVisibility(false); // 设置菜单栏不可见
      mainWindow.menuBarVisible = false;
    }
    logger.info('main window has be showed');
  };

  // 服务起来之后再打开界面，否则出现加载不到数据，延迟100ms来检查
  if (serverStatus === 'success') {
    logger.info('server is startup before main window create');
    openWin();
  } else {
    let timer = 0;
    const t = setInterval(() => {
      timer ++;
      if (serverStatus === 'success' || timer >= 50) { // 服务起来了，或者超过5s还没有起来，就不管了，结束轮询
        openWin();
        timer = 0;
        clearInterval(t);
      }
    }, 100);
  }  

  // 关闭 window 时触发下列事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// 绑定 ready 方法，当 electron 应用创建成功时，创建一个窗口。
app.whenReady().then(() => {
  logger.info('app is ready');
  if (!app.isPackaged) {
    globalShortcut.register('CommandOrControl+Alt+D', () => {
      mainWindow.webContents.isDevToolsOpened()
        ? mainWindow.webContents.closeDevTools()
        : mainWindow.webContents.openDevTools();
    });
  }

  createWindow();

  if (!mainWindow.isFocused()) {
    mainWindow.focus();
  }

  // 绑定 activate 方法，当 electron 应用激活时，创建一个窗口。这是为了点击关闭按钮之后从 dock 栏打开。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
    // macOS 中点击 Dock 图标时没有已打开的其余应用窗口时，则通常在应用中重建一个窗口。
    if (mainWindow === null) {
      createWindow();
    }
  });
});

// 绑定关闭方法，当 electron 应用关闭时，退出 electron 。 macos 系统因为具有 dock 栏机制，可选择不退出。
app.on('window-all-closed', () => {
  // macOS 中除非用户按下 `Cmd + Q` 显式退出，否则应用与菜单栏始终处于活动状态。
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时，将会聚焦到 mainWindow 这个窗口。
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      mainWindow.show();
    }
  });
}
