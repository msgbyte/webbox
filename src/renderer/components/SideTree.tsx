import { Tree } from '@arco-design/web-react';
import { IconDown, IconPlus } from '@arco-design/web-react/icon';
import React from 'react';
import { generateFakeNode, WebsiteTreeNode, useTreeStore } from '../store/tree';
import { AddWebsiteBtn } from './AddWebsiteBtn';
import styled from 'styled-components';

const StyledTree = styled(Tree)`
  .arco-tree-node-title:hover .arco-tree-node-drag-icon {
    opacity: 0;
  }
` as unknown as typeof Tree;

export const SideTree: React.FC = React.memo(() => {
  const { treeData, moveTreeNode, setSelectedNode, addTreeNodeChildren } =
    useTreeStore();

  return (
    <div>
      <AddWebsiteBtn />

      <StyledTree
        draggable={true}
        blockNode={true}
        treeData={treeData}
        icons={{
          switcherIcon: <IconDown />,
        }}
        onSelect={(_, extra) => {
          const nodeData = extra.node.props.dataRef;
          if (nodeData) {
            setSelectedNode(nodeData as WebsiteTreeNode);
          }
        }}
        renderExtra={(node) => {
          return (
            <IconPlus
              style={{
                position: 'absolute',
                right: 8,
                fontSize: 12,
                top: 10,
                color: '#3370ff',
              }}
              onClick={() => {
                if (!node.dataRef) {
                  return;
                }

                addTreeNodeChildren(node._key!, generateFakeNode());
              }}
            />
          );
        }}
        onDrop={({ dragNode, dropNode, dropPosition }) => {
          moveTreeNode(dragNode, dropNode, dropPosition);
        }}
      />
    </div>
  );
});
SideTree.displayName = 'SideTree';
