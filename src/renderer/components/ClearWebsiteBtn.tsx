import { Button } from '@arco-design/web-react';
import { IconDelete } from '@arco-design/web-react/icon';
import React from 'react';
import { useTreeStore } from '../store/tree';

export const ClearWebsiteBtn: React.FC = React.memo(() => {
  const { setSelectedNode } = useTreeStore();

  return (
    <Button
      long={true}
      title="Clear Website Cache"
      icon={<IconDelete />}
      onClick={() => {
        setSelectedNode(null);
        window.electron.ipcRenderer.sendMessage('clear-all-webview');
      }}
    />
  );
});
ClearWebsiteBtn.displayName = 'ClearWebsiteBtn';
