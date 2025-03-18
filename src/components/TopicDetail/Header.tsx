import React, { memo, useContext, useState } from 'react';
import { CheckCircleOutlined, PlayCircleOutlined, ClockCircleOutlined, DeleteOutlined, UndoOutlined, MoreOutlined, DragOutlined, RiseOutlined } from '@ant-design/icons';
import { Button, Popover, Calendar, Modal, message, Select, Radio } from 'antd';
import dayjs from 'dayjs';
import { HEADER_HEIGHT, SPLIT_LINE } from '@/common/constant';
import { userLog } from '@/common/electron';
import { DataContext } from '@/common/context';
import request from '@common/request';
import style from './index.module.less';

type HeaderProps = {
  onUpdated: (topicId: number, opType?: string) => void;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { onUpdated } = props;
  const { noteList, selectedTopic } = useContext(DataContext);
  const [messageApi, msgContextHolder] = message.useMessage();

  const [showActionModal, setShowActionModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);

  const [showMovePanel, setShowMovePanel] = useState(false);
  const [moveToNoteId, setMoveToNoteId] = useState(0);

  const [showPriorityPanel, setShowPriorityPanel] = useState(false);
  const [newPriority, setNewPriority] = useState(0);

  const handleMenuOpenChange = (open: boolean) => {
    setShowActionModal(open);
  };

  const handleTimePickerOpenChange = (open: boolean) => {
    setShowTimePickerModal(open);
  };

  // 点击移动
  const handleMove = () => {
    userLog('Clcik Move Topic: ', selectedTopic.id);
    setShowActionModal(false);
    setShowMovePanel(true);
  };

  const handleCancelMove = () => {
    userLog('Clcik Cancel Move Topic: ', selectedTopic.id);
    setShowMovePanel(false);
  };

  // 暂选的笔记本ID
  const handleSelectedNoteId = (v) => {
    setMoveToNoteId(v);
  };

  // 保存移动
  const handleSaveMove = () => {
    userLog('Clcik Save Move Topic, new NoteBook id: ', moveToNoteId);
    if (!moveToNoteId) {
      messageApi.open({
        type: 'error',
        content: '请先选择目标笔记本',
      });
      return;
    }
    request.post(`/topic/move?id=${selectedTopic.id}&status=${selectedTopic.status}`, {
      oldNoteId: selectedTopic.noteId,
      newNoteId: moveToNoteId,
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已成功移动到目标笔记本',
      });
      setShowMovePanel(false);
      setMoveToNoteId(0);
      onUpdated(selectedTopic.id);
    }).catch((err) => {
      userLog('Logic Move Topic Error: ', err);
      messageApi.open({
        type: 'error',
        content: `移动代办失败：${err.message}`,
      });
    });
  };

  // 点击调整优先级
  const handlePriority = () => {
    userLog('Clcik Update Priority Topic: ', selectedTopic.id);
    setShowActionModal(false);
    setShowPriorityPanel(true);
  };

  const handleCancelPriority = () => {
    userLog('Clcik Cancel Update Priority Topic: ', selectedTopic.id);
    setShowPriorityPanel(false);
  };

  // 暂选的优先级
  const handleSelectedPriority = (e) => {
    setNewPriority(e.target.value);
  };

  // 保存优先级
  const handleSavePriority = () => {
    userLog('Logic Save Update Priority Topic, new Priority: ', newPriority);
    if (!newPriority) {
      messageApi.open({
        type: 'error',
        content: '请先选择优先级',
      });
      return;
    }
    request.post(`/topic/update?id=${selectedTopic.id}`, {
      priority: newPriority,
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已更新优先级',
      });
      setShowPriorityPanel(false);
      setNewPriority(0);
      onUpdated(selectedTopic.id, 'updatePriority');
    }).catch((err) => {
      userLog('Logic Update Priority Topic Error: ', err);
      messageApi.open({
        type: 'error',
        content: `更新代办优先级失败：${err.message}`,
      });
    });
  };

  // 更多操作菜单
  const actionMenu = () => {
    return (
      <div className={style.actionMenu}>
        <Button icon={<DragOutlined style={{ fontSize: '16px' }} />} type="text" onClick={handleMove}>移到其他笔记本</Button>
        <Button icon={<RiseOutlined style={{ fontSize: '16px' }} />} type="text" onClick={handlePriority}>调整代办优先级</Button>
      </div>
    );
  };

  // 更新截止时间
  const onDateChange = (v) => {
    userLog('Update Topic Dealine: ', v);
    setShowTimePickerModal(false);
    request.post(`/topic/update?id=${selectedTopic.id}`, {
      deadline: v,
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已设置截止时间',
      });
      onUpdated(selectedTopic.id, 'updateDeadline');
    }).catch((err) => {
      userLog('Logic Update Topic Dealine Error: ', err);
      messageApi.open({
        type: 'error',
        content: `设置截止时间失败：${err.message}`,
      });
    });
  };

  // 时间选择器
  const timePicker = () => {
    return (
      <div className={style.timePicker}>
        <Calendar
          fullscreen={false}
          disabledDate={(v) => {
            return v < dayjs().subtract(1, 'day');
          }}
          onChange={onDateChange}
        />
      </div>
    );
  };

  // 完成代办
  const updateToDone = () => {
    userLog('Click Todone Topic: ', selectedTopic.id);
    request.post(`/topic/update?id=${selectedTopic.id}&op=done`, {
      status: 'done',
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已完成',
      });
      onUpdated(selectedTopic.id);
    }).catch((err) => {
      userLog('Logic Todone Topic Error: ', err);
      messageApi.open({
        type: 'error',
        content: `完成代办失败：${err.message}`,
      });
    });
  };

  // 重做代办
  const updateFormDoneToUndo = () => {
    userLog('Click FromdoneToUndo Topic: ', selectedTopic.id);
    request.post(`/topic/update?id=${selectedTopic.id}&op=undo`, {
      status: 'undo',
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已开启重做',
      });
      onUpdated(selectedTopic.id);
    }).catch((err) => {
      userLog('Logic FromdoneToUndo Topic Error: ', err);
      messageApi.open({
        type: 'error',
        content: `重启代办失败：${err.message}`,
      });
    });
  };

  // 删除代办
  const updateToDeleted = () => {
    userLog('Click Delete Topic: ', selectedTopic.id);
    request.post(`/topic/update?id=${selectedTopic.id}&op=delete`, {
      status: 'deleted',
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已删除',
      });
      onUpdated(selectedTopic.id);
    }).catch((err) => {
      userLog('Logic Delete Topic Error: ', err);
      messageApi.open({
        type: 'error',
        content: `删除代办失败：${err.message}`,
      });
    });
  };

  // 从删除里面恢复
  const updateToUndo = () => {
    userLog('Click Restore Topic: ', selectedTopic.id);
    request.post(`/topic/update?id=${selectedTopic.id}&op=restore`, {
      status: 'undo',
    }).then(() => {
      messageApi.open({
        type: 'success',
        content: '该代办事项已恢复',
      });
      onUpdated(selectedTopic.id);
    }).catch((err) => {
      userLog('Logic Restore Topic Error: ', err);
      messageApi.open({
        type: 'error',
        content: `恢复代办失败：${err.message}`,
      });
    });
  };

  return (
    <div className={style.header} style={{ height: HEADER_HEIGHT, borderBottom: SPLIT_LINE}}>
      <div className={style.left}>
        {
          // 完成(重做)代办事项
          selectedTopic.status === 'undo' ? (
            <Button icon={<CheckCircleOutlined />} type="text" onClick={updateToDone}></Button>
          ) : (
            <Button icon={<PlayCircleOutlined />} type="text" onClick={updateFormDoneToUndo}></Button>
          )
        }
        {
          // 设置截止时间
          selectedTopic.status === 'undo' ? (
            <Popover
              content={timePicker}
              trigger="click"
              open={showTimePickerModal}
              onOpenChange={handleTimePickerOpenChange}
              placement="bottom"
            >
              <Button icon={<ClockCircleOutlined />} type="text"></Button>
            </Popover>
          ) : (
            <Button icon={<ClockCircleOutlined />} type="text" disabled></Button>
          )
        }
        {
          // 恢复
          selectedTopic.status === 'deleted' ? (
            <Button icon={<UndoOutlined />} type="text" onClick={updateToUndo}></Button>
          ) : null
        }
        {
          // 删除
          selectedTopic.status !== 'deleted' ? (
            <Button icon={<DeleteOutlined />} type="text" onClick={updateToDeleted}></Button>
          ) : null
        }
      </div>
      <div className={style.right}>
        <Popover
          content={actionMenu}
          trigger="click"
          open={showActionModal}
          onOpenChange={handleMenuOpenChange}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />} type="text"></Button>
        </Popover>
      </div>
      <Modal
        title="移动代办"
        open={showMovePanel}
        onOk={handleSaveMove}
        onCancel={handleCancelMove}
      >
        <div style={{ paddingTop: '16px' }}>
          <span>请选择目标笔记本：</span>
          <Select onChange={handleSelectedNoteId} style={{ width: 160 }}>
            {
              noteList.map((item) => {
                if (item.id !== selectedTopic.noteId) {
                  return (
                    <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                  );
                }
              })
            }
          </Select>
        </div>
      </Modal>
      <Modal
        title="更新代办优先级"
        open={showPriorityPanel}
        onOk={handleSavePriority}
        onCancel={handleCancelPriority}
      >
        <div style={{ paddingTop: '16px' }}>
          <span>请选择优先级：</span>
          <Radio.Group buttonStyle="solid" onChange={handleSelectedPriority}>
            <Radio.Button value="1">P1</Radio.Button>
            <Radio.Button value="2">P2</Radio.Button>
            <Radio.Button value="3">P3</Radio.Button>
            <Radio.Button value="4">P4</Radio.Button>
          </Radio.Group>
        </div>
      </Modal>
      <div>{msgContextHolder}</div>
    </div>
  );
};

export default memo(Header);