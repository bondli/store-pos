import React, { memo, useContext, useState, useEffect, useRef } from 'react';
import { SearchOutlined, EllipsisOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popover, Modal, Input, message } from 'antd';
import { HEADER_HEIGHT, SPLIT_LINE, DEFAULT_NOTE } from '@/common/constant';
import { userLog } from '@/common/electron';
import { DataContext } from '@/common/context';
import request from '@common/request';
import style from './index.module.less';

type HeaderProps = {
  onCreated: (t) => void;
}
const Header: React.FC<HeaderProps> = (props) => {
  const { onCreated } = props;
  const { currentNote, setCurrentNote, selectedTopic, getNoteList, setTopicList } = useContext(DataContext);

  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, msgContextHolder] = message.useMessage();
  const [showActionModal, setShowActionModal] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [tempNoteName, setTempNoteName] = useState('');
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const inputRef = useRef(null);
  const inputSearchRef = useRef(null);

  const [searchDone, setSearchDone] = useState(false);
  const [searchResultCount, setSearchResultCount] = useState(0);

  useEffect(() => {
    setSearchDone(false);
    setSearchKey('');
  }, [currentNote.id, selectedTopic?.id]);
  
  const createTopic = () => {
    request.post('/topic/add', {
      title: '这是一个新的代办事项',
      desc: '',
      noteId: currentNote.id,
    }).then((res) => {
      userLog('Logic Create Topic: ', res);
      onCreated(res);
    }).catch((err) => {
      userLog('Logic Create Topic Failed: ', currentNote);
      messageApi.open({
        type: 'error',
        content: `创建失败：${err.message}`,
      });
    });
  };

  // 新增一条笔记
  const handleNewTopic = () => {
    userLog('Click Create Topic at: ', currentNote);
    // 如果是虚拟的笔记本需要先选择实体笔记本
    if (currentNote.isVirtual) {
      messageApi.open({
        type: 'info',
        content: '请先在左侧选择一个笔记本',
      });
      return;
    }
    // 如果是实体的笔记本先创建一条记录，然后选择这个topic
    createTopic();
  };

  // 编辑笔记本
  const handleEdit = () => {
    userLog('Click Edit Notebook: ', currentNote);
    setShowActionModal(false);
    setShowEditPanel(true);
    setTempNoteName(currentNote.name);
    setTimeout(() => {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    }, 200);
  };

  const handleNoteNameChange = (e) => {
    setTempNoteName(e.target.value);
  };

  // 保存编辑信息
  const handleSaveEdit = () => {
    userLog('Submit Save Edit Notebook, new Notebook name: ', tempNoteName);
    if (!tempNoteName || !tempNoteName.length) {
      messageApi.open({
        type: 'error',
        content: '请输入笔记本名称',
      });
      return;
    }
    request
      .post(`/note/update?id=${currentNote?.id}`, {
        name: tempNoteName,
      }).then(() => {
        setTempNoteName('');
        setShowEditPanel(false);
        setCurrentNote({ ...currentNote, name: tempNoteName });
        getNoteList();
        messageApi.open({
          type: 'success',
          content: `修改成功`,
        });
      }).catch((err) => {
        userLog('Logic Save Edit Notebook failed: ', err);
        messageApi.open({
          type: 'error',
          content: `修改失败：${err.message}`,
        });
      });
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setShowEditPanel(false);
  };

  // 删除笔记本
  const handleDelete = () => {
    userLog('Click Delete Notebook: ', currentNote);
    setShowActionModal(false);
    modalApi.confirm({
      title: '确认删除吗？',
      content: '删除后将无法恢复，该笔记本下的代办事项全部清空',
      onOk() {
        // 删除
        request
        .get(`/note/delete?id=${currentNote?.id}`)
        .then(() => {
          userLog('Logic Delete Notebook: ', currentNote);
          // 删除后，切换到默认笔记本
          setCurrentNote(DEFAULT_NOTE);
          getNoteList();
          messageApi.open({
            type: 'success',
            content: '删除成功',
          });
        })
        .catch((err) => {
          userLog('Logic Delete Notebook failed: ', err);
          messageApi.open({
            type: 'error',
            content: `删除失败：${err.message}`,
          });
        });
      },
    });
  };

  const handleMenuOpenChange = (open: boolean) => {
    setShowActionModal(open);
  };

  // 操作笔记本菜单
  const actionMenu = () => {
    return (
      <div className={style.actionMenu}>
        <Button icon={<FormOutlined />} type="text" onClick={handleEdit}>编辑</Button>
        <Button icon={<DeleteOutlined />} type="text" onClick={handleDelete}>删除</Button>
      </div>
    );
  };

  // 搜索框输入
  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  // 执行搜索
  const goSearch = () => {
    userLog('Search Topic keyword: ', searchKey);
    request.post(`/topic/searchList?noteId=${currentNote.id}`, {
      searchKey,
    }).then((res: any) => {
      setTopicList(res.data);
      setSearchResultCount(res.count || 0);
      setSearchDone(true);
      setShowSearchPanel(false);
    }).catch((err) => {
      userLog('Logic Search Topic failed: ', err);
      setTopicList([]);
      messageApi.open({
        type: 'error',
        content: `搜索失败：${err.message}`,
      });
    });
  };

  // 打开搜索面板
  const handleShowSearch = () => {
    setSearchDone(false);
    setSearchKey('');
    setShowSearchPanel(true);
    setTimeout(() => {
      inputSearchRef?.current?.focus();
      inputSearchRef?.current?.select();
    }, 300);
  };

  // 关闭搜索面板
  const handleHideSearch = () => {
    setShowSearchPanel(false);
  };

  return (
    <div className={style.header} style={{ height: HEADER_HEIGHT, borderBottom: SPLIT_LINE}}>
      <div className={style.title}>
        <span className={style.titleText}>{currentNote.name}</span>
        {
          currentNote?.isVirtual ? (
            <div className={style.searchContainer}>
              <Button icon={<SearchOutlined />} type="text" onClick={handleShowSearch} style={{ outline: 0 }}></Button>
              {
                searchKey && searchDone ? (
                  <span className={style.searchResult}>搜索关键字 “{searchKey}” 结果共 {searchResultCount} 条</span>
                ) : null
              }
            </div>
          ) : (
            <Popover
              content={actionMenu}
              trigger="click"
              open={showActionModal}
              onOpenChange={handleMenuOpenChange}
              placement="bottom"
            >
              <Button icon={<EllipsisOutlined />} type="text"></Button>
            </Popover>
          )
        }
        <div>{modalContextHolder}</div>
        <div>{msgContextHolder}</div>
      </div>
      <div>
        <Button type="primary" size="small" onClick={handleNewTopic}>创建代办</Button>
      </div>
      <Modal
        title="修改笔记本"
        open={showEditPanel}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
      >
        <Input value={tempNoteName} onChange={handleNoteNameChange} maxLength={8} allowClear ref={inputRef} />
      </Modal>

      <Modal
        title="搜索代办"
        open={showSearchPanel}
        onOk={goSearch}
        onCancel={handleHideSearch}
      >
        <Input
          placeholder="请输入关键字"
          onChange={handleSearchChange}
          onPressEnter={goSearch}
          value={searchKey}
          ref={inputSearchRef}
        />
      </Modal>
    </div>
  );

};

export default memo(Header);
