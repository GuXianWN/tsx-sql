import { SqlFragment, type SqlComponentProps, type SqlElement, type SqlNode } from "../node";
import type { SqlParam } from "tsx-sql";

export type ResolvedSqlNode = string | SqlParam;

export function resolveNode(input: SqlNode): ResolvedSqlNode[] {
  if (Array.isArray(input)) {
    return input.flatMap(resolveNode);
  }

  if (typeof input === "string") {
    return [input];
  }

  if (input.kind === "param") {
    return [input];
  }

  if (input.kind === "element") {
    if (input.type === SqlFragment) {
      return resolveNode(input.children ?? "");
    }

    return resolveNode(input.type(componentProps(input)));
  }

  return assertNever(input);
}

function componentProps(element: SqlElement): SqlComponentProps {
  return {
    ...element.props,
    children: element.children
  };
}

function assertNever(value: never): never {
  throw new TypeError(`Unsupported SQL node: ${String(value)}`);
}
