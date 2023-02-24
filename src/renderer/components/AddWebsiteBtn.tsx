import { Button, Modal } from '@arco-design/web-react';
import React, { useState } from 'react';
import { generateFakeNode, useTreeStore } from '../store/tree';

export const AddWebsiteBtn: React.FC = React.memo(() => {
  const { addTreeNode } = useTreeStore();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        long={true}
        onClick={() => {
          // setVisible(true);
          addTreeNode(generateFakeNode());
        }}
      >
        Add Website
      </Button>

      <Modal visible={visible} onCancel={() => setVisible(false)}>
        <div>Fooo</div>
      </Modal>
    </>
  );
});
AddWebsiteBtn.displayName = 'AddWebsiteBtn';
