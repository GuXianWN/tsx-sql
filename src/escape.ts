export function escapeSqlTextValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  if (value instanceof Date) {
    return quoteString(value.toISOString());
  }

  return quoteString(String(value));
}

function quoteString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}
