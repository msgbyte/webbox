import {
  NodeInstance,
  TreeDataType,
} from '@arco-design/web-react/es/Tree/interface';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type WebsiteTreeNode = Pick<TreeDataType, 'title'> & {
  key: string;
  children?: WebsiteTreeNode[];
  url: string;
  isLeaf?: boolean;
};

interface TreeStoreState {
  treeData: WebsiteTreeNode[];
  selectedNode: WebsiteTreeNode | null;
  setSelectedNode: (selectedNode: WebsiteTreeNode) => void;
  setTreeData: (treeData: WebsiteTreeNode[]) => void;
  addTreeNode: (treeNode: WebsiteTreeNode) => void;
  addTreeNodeChildren: (parentKey: string, treeNode: WebsiteTreeNode) => void;
  moveTreeNode: (
    dragNode: NodeInstance | null,
    dropNode: NodeInstance | null,
    dropPosition: number
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
  immer((set) => ({
    treeData: defaultTreeData,
    selectedNode: null,
    setSelectedNode: (selectedNode: WebsiteTreeNode) => {
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
  }))
);

function findTreeNode(
  treeData: WebsiteTreeNode[],
  key: string
): WebsiteTreeNode | null {
  const targetNode = treeData.find((node) => {
    return node.key === key;
  });

  if (targetNode) {
    return targetNode;
  }

  for (const node of treeData) {
    if (node.children && node.children.length > 0) {
      const res = findTreeNode(node.children, key);
      if (res) {
        return res;
      }
    }
  }

  return null;
}

export function generateFakeNode(): WebsiteTreeNode {
  const key = 'fooo' + Math.random();
  return {
    key,
    title: key,
    url: 'https://baidu.com',
    children: [],
    isLeaf: false,
  };
}
