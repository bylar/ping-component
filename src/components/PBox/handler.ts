import { ComponentInternalInstance } from "vue";

export function handler(parent: ComponentInternalInstance, children: ComponentInternalInstance[] = []) {
  console.log({ parent, children });
};
