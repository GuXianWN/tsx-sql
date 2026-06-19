import type { SqlParam } from "./param";

const FRAGMENT_SYMBOL = "tsx-sql.fragment";

// SQL fragments are transparent wrappers for <>...</>.
export const SqlFragment = Symbol.for(FRAGMENT_SYMBOL);

// Any piece of SQL content that compile(...) knows how to read.
// You can write:
//   <>WHERE name = { $("Tom") }</>
// TSX stores those children as:
//   ["WHERE name = ", SqlParam]
// Nested tags are also SqlNode values, so children can contain more elements.
export type SqlNode = string | SqlParam | SqlElement | SqlNode[];

type SqlProps = Record<string, unknown>;

export type SqlComponentProps = SqlProps & { children?: SqlNode };

// A function that can be used as a TSX SQL tag.
// You can write:
//   <If test={name}>...</If>
// The element stores the If function in its type field, and compile(...)
// calls that function to decide which SqlNode should be compiled next.
export type SqlComponent = (props: SqlComponentProps) => SqlNode;

// The object created by createNode(...) after TypeScript compiles TSX.
// You can write:
//   <If test={name}>AND name = { $("Tom") }</If>
// Runtime stores:
//   { type: If, props: { test: name, children: ["AND name = ", SqlParam] } }
// Fragment elements use SqlFragment as their type and only wrap children.
export interface SqlElement {
  kind: "element";
  type: typeof SqlFragment | SqlComponent;
  props: SqlProps;
  children?: SqlNode;
}

// TypeScript calls this through jsx/jsxs/jsxDEV after compiling TSX.
// We keep the node shape tiny: just the tag/component type and its props.
export function createNode(type: SqlElement["type"], props: (SqlProps & { children?: SqlNode }) | null): SqlElement {
  const { children, ...restProps } = props ?? {};

  return {
    kind: "element",
    type,
    props: restProps,
    children
  };
}
