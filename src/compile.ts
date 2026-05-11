import { escapeSqlTextValue } from "./escape";
import { isSqlParam } from "./param";
import { SqlFragment } from "./runtime/fragment";
import { isSqlElement, type SqlNode } from "./vnode";

export type CompileInput = SqlNode;

export interface CompileResult {
  sql: string;
  values: unknown[];
  text: string;
}

export function compile(input: CompileInput): CompileResult {
  const sqlParts: string[] = [];
  const values: unknown[] = [];
  const textParts: string[] = [];

  collect(input, {
    text(value) {
      sqlParts.push(value);
      textParts.push(value);
    },
    param(value) {
      sqlParts.push("?");
      values.push(value);
      textParts.push(escapeSqlTextValue(value));
    }
  });

  return {
    sql: compactWhitespace(sqlParts.join("")),
    values,
    text: textParts.join("")
  };
}

interface Collector {
  text(value: string): void;
  param(value: unknown): void;
}

function collect(input: SqlNode, collector: Collector): void {
  if (Array.isArray(input)) {
    for (const item of input) {
      collect(item, collector);
    }
    return;
  }

  if (isSqlParam(input)) {
    collector.param(input.value);
    return;
  }

  if (isSqlElement(input)) {
    if (input.type === SqlFragment) {
      collect(input.props.children ?? "", collector);
      return;
    }

    if (typeof input.type === "function") {
      collect(input.type(input.props), collector);
      return;
    }
  }

  if (isSqlElement(input)) {
    throw new TypeError("Unsupported JSX node.");
  }

  collector.text(input);
}

function compactWhitespace(source: string): string {
  return source.replace(/\s+/g, " ").trim();
}
