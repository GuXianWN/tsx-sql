import type { SqlComponentProps, SqlNode } from "../node";

export interface IfProps extends SqlComponentProps {
  test: boolean;
}

export function If(props: IfProps): SqlNode {
  return props.test ? props.children ?? "" : "";
}
