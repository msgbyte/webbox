import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TreeNode = Pick<TreeDataType, 'title'> & {
  key: string;
  children?: TreeNode[];
  url: string;
  isLeaf?: boolean;
};

interface TreeStoreState {
  treeData: TreeNode[];
  selectedNode: TreeNode | null;
  setTreeData: (treeData: TreeNode[]) => void;
  addTreeNode: (treeNode: TreeNode) => void;
  addTreeNodeChildren: (parentKey: string, treeNode: TreeNode) => void;
}

export const useTreeStore = create<TreeStoreState>()(
  immer((set) => ({
    treeData: [],
    selectedNode: null,
    setTreeData: (treeData: TreeNode[]) => {
      set({
        treeData,
      });
    },
    addTreeNode: (treeNode: TreeNode) => {
      set((state) => {
        state.treeData.push(treeNode);
      });
    },
    addTreeNodeChildren: (parentKey: string, treeNode: TreeNode) => {
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
  }))
);

function findTreeNode(treeData: TreeNode[], key: string): TreeNode | null {
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

export function generateFakeNode(): TreeNode {
  const key = 'fooo' + Math.random();
  return {
    key,
    title: key,
    url: 'https://baidu.com',
    children: [],
    isLeaf: false,
  };
}
