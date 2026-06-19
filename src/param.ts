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
