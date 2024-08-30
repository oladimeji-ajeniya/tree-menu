import { atom } from "recoil";

export const expandedNodesState = atom({
  key: "expandedNodesState",
  default: new Set(),
});

export const hoveredNodeState = atom({
  key: "hoveredNodeState",
  default: null,
});

export const selectedNodeState = atom({
  key: "selectedNodeState",
  default: null,
});

export const systemManagementState = atom({
  key: "systemManagementState",
  default: null,
});

export const treeDataState = atom({
  key: "treeDataState",
  default: [],
});

export const isTreeVisibleState = atom({
  key: "isTreeVisibleState",
  default: false,
});

export const activeFormState = atom({
  key: "activeFormState",
  default: null,
});
