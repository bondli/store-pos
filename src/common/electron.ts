/**
 * Eletron.js
 * 封装了 web 与 electron 的通信
 */

const win: any = window;

const isInElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
const ipcRenderer = win.electron?.ipcRenderer || {};

export const setStore = (key, value) => {
  if (!isInElectron) {
    win.localStorage.setItem(key, value);
    return;
  }
  ipcRenderer.setStoreValue(key, value);
}

export const getStore = (key) => {
  if (!isInElectron) {
    return win.localStorage.getItem(key);
  }
  return ipcRenderer.getStoreValue(key);
}

export const deleteStore = (key) => {
  if (!isInElectron) {
    win.localStorage.removeItem(key);
    return;
  }
  ipcRenderer.deleteStore(key);
}

// // 保存登录的用户信息
// export const saveLoginData = (data) => {
//   _setStore('loginData', data);
// }

// // 获取用户的登录信息
// export const getLoginData = () => {
//   return _getStore('loginData');
// }

// // 删除登录的用户信息
// export const deleteLoginData = () => {
//   _deleteStore('loginData');
// }

// // 保存导购员列表
// export const saveSalerList = (data) => {
//   _setStore('salerList', data);
// }

// // 获取导购员列表
// export const getSalerList = () => {
//   return _getStore('salerList');
// }

// // 删除导购员列表
// export const deleteSalerList = () => {
//   _deleteStore('salerList');
// }

// 打日志
export const userLog = (msg: any, msgData?: any) => {
  msgData ? console.log(msg, msgData) : console.log(msg);
  
  let outMsg = typeof msg === 'string' ? msg : JSON.stringify(msg);
  if (msgData) {
    outMsg += ` ${typeof msgData === 'string' ? msgData : JSON.stringify(msgData)}`;
  }
  ipcRenderer.userLog(outMsg);
}

// 导出数据
export const exportData = () => {
  if (!isInElectron) {
    return;
  }
  ipcRenderer.exportData();
}

// 导入数据
export const importData = () => {
  if (!isInElectron) {
    return;
  }
  ipcRenderer.importData();
}

// 打印字符串
export const printStr = (html: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
            ul, ol, li {
              list-style: none;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

const ElectronBridge = {
  setStore,
  getStore,
  deleteStore,
  userLog,
  exportData,
  importData,
};

export default ElectronBridge;
