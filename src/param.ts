export interface SqlParam {
  kind: "param";
  value: unknown;
}

export function $(value: unknown): SqlParam {
  return {
    kind: "param",
    value
  };
}

export function isSqlParam(value: unknown): value is SqlParam {
  return typeof value === "object" && value !== null && "kind" in value && value.kind === "param";
}
