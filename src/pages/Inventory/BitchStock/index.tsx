import React, { memo, useState } from 'react';
import { Button, Drawer, message, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

type ComProps = {
  callback: () => void;
};

const BitchStock: React.FC<ComProps> = (props) => {
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const uploadConfig: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <>
      <Button
        type='default'
        onClick={togglePanel}
      >
        bitch stock
      </Button>
      <Drawer
        title={`Bitch Stock`}
        width={640}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        destroyOnClose={true}
      >
        <div style={{ height: '180px' }}>
          <Dragger {...uploadConfig}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single excel file upload.
            </p>
          </Dragger>
        </div>
      </Drawer>
    </>
  );

};

export default memo(BitchStock);
