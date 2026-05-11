import type { SqlParam } from "./param";
import { SqlFragment } from "./runtime/fragment";

// Any piece of SQL content that compile(...) knows how to read.
// You can write:
//   <>WHERE name = { $("Tom") }</>
// TSX stores those children as:
//   ["WHERE name = ", SqlParam]
// Nested tags are also SqlNode values, so children can contain more elements.
export type SqlNode = string | SqlParam | SqlElement | SqlNode[];

// The props object passed into a SQL component.
// You can write:
//   <If test={name}>AND name = { $("Tom") }</If>
// TSX calls If with props shaped like:
//   { test: name, children: ["AND name = ", SqlParam] }
// Each tag can extend this base shape with its own required props.
export type SqlComponentProps = {
  children?: SqlNode;
  [name: string]: unknown;
};

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
  type: typeof SqlFragment | SqlComponent;
  props: SqlComponentProps;
}

// TypeScript calls this through jsx/jsxs/jsxDEV after compiling TSX.
// We keep the node shape tiny: just the tag/component type and its props.
export function createNode(type: SqlElement["type"], props: SqlElement["props"] | null): SqlElement {
  return {
    type,
    props: props ?? {}
  };
}

export function isSqlElement(input: unknown): input is SqlElement {
  return typeof input === "object" && input !== null && "type" in input && "props" in input;
}
