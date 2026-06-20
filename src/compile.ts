import { escapeSqlTextValue } from "./internal/escape";
import { resolveNode } from "./internal/resolve";
import type { SqlNode } from "./node";

export interface CompileResult {
  sql: string;
  values: unknown[];
  text: string;
}

export function compile(input: SqlNode): CompileResult {
  const sqlParts: string[] = [];
  const values: unknown[] = [];
  const textParts: string[] = [];

  for (const node of resolveNode(input)) {
    // Raw strings are SQL text, not parameters.
    if (typeof node === "string") {
      sqlParts.push(node);
      textParts.push(node);
      continue;
    }

    // Parameters become placeholders in executable SQL and values in order.
    sqlParts.push("?");
    values.push(node.value);
    textParts.push(escapeSqlTextValue(node.value));
  }

  return {
    sql: compactWhitespace(sqlParts.join("")),
    values,
    text: textParts.join("")
  };
}

function compactWhitespace(source: string): string {
  return source.replace(/\s+/g, " ").trim();
}
