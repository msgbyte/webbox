import { Button } from '@arco-design/web-react';
import React from 'react';
import { generateDefaultNode, useTreeStore } from '../store/tree';

export const AddWebsiteBtn: React.FC = React.memo(() => {
  const { addTreeNode } = useTreeStore();

  return (
    <Button
      long={true}
      onClick={() => {
        addTreeNode(generateDefaultNode());
      }}
    >
      Add Website
    </Button>
  );
});
AddWebsiteBtn.displayName = 'AddWebsiteBtn';
