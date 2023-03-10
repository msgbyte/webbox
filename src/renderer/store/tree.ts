import {
  NodeInstance,
  TreeDataType,
} from '@arco-design/web-react/es/Tree/interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

export type WebsiteTreeNode = {
  title: string;
  key: string;
  children?: WebsiteTreeNode[];
  url: string;
  isLeaf?: boolean;
};

interface TreeStoreState {
  treeData: WebsiteTreeNode[];
  selectedNode: WebsiteTreeNode | null;
  setSelectedNode: (selectedNode: WebsiteTreeNode | null) => void;
  setTreeData: (treeData: WebsiteTreeNode[]) => void;
  addTreeNode: (treeNode: WebsiteTreeNode) => void;
  addTreeNodeChildren: (parentKey: string, treeNode: WebsiteTreeNode) => void;
  moveTreeNode: (
    dragNode: NodeInstance | null,
    dropNode: NodeInstance | null,
    dropPosition: number
  ) => void;
  deleteTreeNode: (key: string) => void;
  patchSelectedNode: <T extends Exclude<keyof WebsiteTreeNode, 'key'>>(
    key: T,
    value: WebsiteTreeNode[T]
  ) => void;
}

const defaultTreeData = [
  {
    key: 'baidu',
    title: 'Baidu',
    url: 'https://baidu.com',
    children: [],
    isLeaf: false,
  },
  {
    key: 'bing',
    title: 'Bing',
    url: 'https://cn.bing.com/',
    children: [],
    isLeaf: false,
  },
];

export const useTreeStore = create<TreeStoreState>()(
  persist(
    immer((set) => ({
      treeData: defaultTreeData,
      selectedNode: null,
      setSelectedNode: (selectedNode: WebsiteTreeNode | null) => {
        set({
          selectedNode,
        });
      },
      setTreeData: (treeData: WebsiteTreeNode[]) => {
        set({
          treeData,
        });
      },
      addTreeNode: (treeNode: WebsiteTreeNode) => {
        set((state) => {
          state.treeData.push(treeNode);
        });
      },
      addTreeNodeChildren: (parentKey: string, treeNode: WebsiteTreeNode) => {
        set((state) => {
          const treeData = state.treeData;

          const targetTreeNode = findTreeNode(treeData, parentKey);
          if (!targetTreeNode) {
            return;
          }

          if (!targetTreeNode.children) {
            targetTreeNode.children = [];
          }
          targetTreeNode.children.push(treeNode);
        });
      },
      moveTreeNode: (
        dragNode: NodeInstance | null,
        dropNode: NodeInstance | null,
        dropPosition: number
      ) => {
        set((state) => {
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

          const data = [...state.treeData];
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

          state.treeData = [...data];
        });
      },
      deleteTreeNode: (key: string) => {
        set((state) => {
          if (state.selectedNode && state.selectedNode.key === key) {
            state.selectedNode = null;
          }

          deleteTreeNode(state.treeData, key);
        });
      },
      patchSelectedNode: (key, value) => {
        set((state) => {
          if (!state.selectedNode) {
            return;
          }

          // Check is changed
          if (state.selectedNode[key] === value) {
            return;
          }

          const node = findTreeNode(state.treeData, state.selectedNode.key);
          if (!node) {
            return;
          }

          state.selectedNode[key] = value;
          node[key] = value;
        });
      },
    })),
    {
      name: 'webbox-tree',
      partialize: (state) => ({ treeData: state.treeData }),
    }
  )
);

function findTreeNode(
  treeData: WebsiteTreeNode[],
  key: string
): WebsiteTreeNode | null {
  for (const node of treeData) {
    if (node.key === key) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const res = findTreeNode(node.children, key);
      if (res) {
        return res;
      }
    }
  }

  return null;
}

/**
 * in-place algorithm
 */
function deleteTreeNode(treeData: WebsiteTreeNode[], key: string): boolean {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    if (node.key === key) {
      treeData.splice(i, 1);
      return true;
    }

    if (node.children && node.children.length > 0) {
      const fixed = deleteTreeNode(node.children, key);
      if (fixed) {
        return true;
      }
    }
  }

  return false;
}

export function generateDefaultNode(): WebsiteTreeNode {
  const key = nanoid();
  return {
    key,
    title: 'Untitled',
    url: '',
    children: [],
    isLeaf: false,
  };
}
