import type { SqlComponentProps, SqlNode } from "../vnode";

export interface IfProps extends SqlComponentProps {
  test: unknown;
}

export function If(props: IfProps): SqlNode {
  return props.test ? props.children ?? "" : "";
}
