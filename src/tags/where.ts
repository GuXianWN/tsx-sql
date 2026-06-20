import { resolveNode, type ResolvedSqlNode } from "../internal/resolve";
import type { SqlComponentProps, SqlNode } from "../node";

export function Where(props: SqlComponentProps): SqlNode {
  const children = removeLeadingAndOr(resolveNode(props.children ?? ""));

  if (isBlank(children)) {
    return "";
  }

  return [" WHERE ", children];
}

function removeLeadingAndOr(nodes: ResolvedSqlNode[]): ResolvedSqlNode[] {
  // MyBatis where ignores leading whitespace, then removes a leading AND/OR.
  const firstConditionIndex = nodes.findIndex((node) => typeof node !== "string" || node.trim().length > 0);
  if (firstConditionIndex === -1) {
    return [];
  }

  const firstCondition = nodes[firstConditionIndex];
  if (typeof firstCondition !== "string") {
    return nodes;
  }

  return [
    ...nodes.slice(0, firstConditionIndex),
    removeLeadingAndOrText(firstCondition),
    ...nodes.slice(firstConditionIndex + 1)
  ];
}

function removeLeadingAndOrText(text: string): string {
  return text.replace(/^\s*(AND|OR)\b\s*/i, "");
}

function isBlank(nodes: ResolvedSqlNode[]): boolean {
  return nodes.every((node) => typeof node === "string" && node.trim().length === 0);
}
