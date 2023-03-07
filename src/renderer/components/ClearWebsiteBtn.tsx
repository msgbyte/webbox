import { Button } from '@arco-design/web-react';
import React from 'react';
import { useTreeStore } from '../store/tree';

export const ClearWebsiteBtn: React.FC = React.memo(() => {
  const { setSelectedNode } = useTreeStore();

  return (
    <>
      <Button
        long={true}
        onClick={() => {
          setSelectedNode(null);
          window.electron.ipcRenderer.sendMessage('clear-all-webview');
        }}
      >
        Clear Website
      </Button>
    </>
  );
});
ClearWebsiteBtn.displayName = 'ClearWebsiteBtn';
