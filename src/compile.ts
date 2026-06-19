import { escapeSqlTextValue } from "./internal/escape";
import { SqlFragment, type SqlComponentProps, type SqlElement, type SqlNode } from "./node";

export interface CompileResult {
  sql: string;
  values: unknown[];
  text: string;
}

export function compile(input: SqlNode): CompileResult {
  const sqlParts: string[] = [];
  const values: unknown[] = [];
  const textParts: string[] = [];

  function collect(input: SqlNode): void {
    // TSX children and manual fragments can be nested arrays; preserve order.
    if (Array.isArray(input)) {
      for (const item of input) {
        collect(item);
      }
      return;
    }

    // Raw strings are SQL text, not parameters.
    if (typeof input === "string") {
      sqlParts.push(input);
      textParts.push(input);
      return;
    }

    // Parameters become placeholders in executable SQL and values in order.
    if (input.kind === "param") {
      sqlParts.push("?");
      values.push(input.value);
      textParts.push(escapeSqlTextValue(input.value));
      return;
    }

    // Fragments only group children; they do not emit SQL by themselves.
    if (input.type === SqlFragment) {
      collect(input.children ?? "");
      return;
    }

    // Components decide which SQL node should be compiled next.
    collect(input.type(componentProps(input)));
  }

  collect(input);

  return {
    sql: compactWhitespace(sqlParts.join("")),
    values,
    text: textParts.join("")
  };
}

function compactWhitespace(source: string): string {
  return source.replace(/\s+/g, " ").trim();
}

function componentProps(element: SqlElement): SqlComponentProps {
  return {
    ...element.props,
    children: element.children
  };
}
