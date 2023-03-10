import { Menu, Tooltip, Tree, Trigger } from '@arco-design/web-react';
import { IconDown, IconPlus } from '@arco-design/web-react/icon';
import React from 'react';
import {
  generateDefaultNode,
  WebsiteTreeNode,
  useTreeStore,
} from '../store/tree';
import { AddWebsiteBtn } from './AddWebsiteBtn';
import styled from 'styled-components';
import { ClearWebsiteBtn } from './ClearWebsiteBtn';
import { stopPropagation } from '../utils/dom';

const StyledTree = styled(Tree)`
  margin-top: 0.5rem;

  .arco-tree-node-title:hover .arco-tree-node-drag-icon {
    opacity: 0;
  }

  .arco-tree-node-title {
    padding: 0;
    padding-right: 4px;

    & .arco-tree-node-title-text > div {
      padding: 5px 0 5px 4px;
    }
  }
` as unknown as typeof Tree;

const StyledMenu = styled(Menu)`
  box-shadow: 0 0 5px rgb(0, 0, 0, 0.25);

  .arco-menu-item {
    line-height: 32px;
  }
` as unknown as typeof Menu;

export const SideTree: React.FC = React.memo(() => {
  const {
    treeData,
    selectedNode,
    moveTreeNode,
    setSelectedNode,
    addTreeNodeChildren,
    deleteTreeNode,
  } = useTreeStore();

  return (
    <div>
      <AddWebsiteBtn />
      <ClearWebsiteBtn />

      <StyledTree
        draggable={true}
        blockNode={true}
        selectedKeys={selectedNode ? [selectedNode.key] : []}
        treeData={treeData}
        icons={{
          switcherIcon: <IconDown />,
        }}
        renderTitle={(props) => (
          <Trigger
            position="br"
            popupAlign={{
              right: [20, 20],
            }}
            popup={() => (
              <StyledMenu>
                <Menu.Item
                  key="del"
                  onClick={(e) => {
                    stopPropagation(e);
                    if (props.dataRef && props.dataRef.key) {
                      deleteTreeNode(props.dataRef.key);
                    }
                  }}
                >
                  Delete
                </Menu.Item>
              </StyledMenu>
            )}
            trigger={'contextMenu'}
          >
            <div>{props.title}</div>
          </Trigger>
        )}
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

                addTreeNodeChildren(node._key!, generateDefaultNode());
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
