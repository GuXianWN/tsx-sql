import type { SqlNode } from "../vnode";

declare global {
  namespace JSX {
    type Element = SqlNode;

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
