import { Button, Tree } from '@arco-design/web-react';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { IconDown, IconPlus } from '@arco-design/web-react/icon';
import React from 'react';
import { generateFakeNode, useTreeStore } from '../store/tree';

export const SideTree: React.FC = React.memo(() => {
  const { treeData, setTreeData, addTreeNode, addTreeNodeChildren } =
    useTreeStore();

  return (
    <div>
      <Button
        long={true}
        onClick={() => {
          addTreeNode(generateFakeNode());
        }}
      >
        添加页面
      </Button>

      <Tree
        draggable={true}
        blockNode={true}
        treeData={treeData}
        icons={{
          switcherIcon: <IconDown />,
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
          if (!dragNode) {
            return;
          }

          if (!dropNode) {
            return;
          }

          const loop = (
            data: TreeDataType[],
            key: string,
            callback: (
              item: TreeDataType,
              index: number,
              arr: TreeDataType[]
            ) => void
          ) => {
            data.some((item, index, arr) => {
              if (item.key === key) {
                callback(item, index, arr);
                return true;
              }

              if (item.children) {
                return loop(item.children, key, callback);
              }
            });
          };

          const data = [...treeData];
          let dragItem: TreeDataType;
          loop(data, dragNode.props._key ?? '', (item, index, arr) => {
            arr.splice(index, 1);
            dragItem = item;
          });

          if (dropPosition === 0) {
            loop(data, dropNode.props._key ?? '', (item, index, arr) => {
              item.children = item.children || [];
              item.children.push(dragItem);
            });
          } else {
            loop(data, dropNode.props._key ?? '', (item, index, arr) => {
              arr.splice(dropPosition < 0 ? index : index + 1, 0, dragItem);
            });
          }

          setTreeData([...data]);
        }}
      />
    </div>
  );
});
SideTree.displayName = 'SideTree';
