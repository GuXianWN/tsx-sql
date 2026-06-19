import { createNode, SqlFragment } from "./node";
import type { SqlNode } from "./node";

declare global {
  namespace JSX {
    type Element = SqlNode;

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export { SqlFragment as Fragment };

export const jsx = createNode;
export const jsxs = createNode;
