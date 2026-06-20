# tsx-sql

Compile TSX SQL fragments into parameterized SQL.

`tsx-sql` is a small SQL generation library. It lets you write dynamic SQL with TSX tags, then compile it into SQL text and parameter values.

It does not execute SQL, manage database connections, model schemas, or replace your ORM. Use the generated SQL with your database client or ORM of choice.

## Install

```sh
npm install tsx-sql
```

## TypeScript Setup

Configure TypeScript to use the `tsx-sql` JSX runtime:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "tsx-sql"
  }
}
```

Use `.tsx` files for SQL fragments written with JSX syntax.

## Basic Usage

```tsx
import { $, compile, If, Where } from "tsx-sql";

const name: string | undefined = "Tom";
const age: number | undefined = undefined;

const query = compile(
  <>
    SELECT * FROM users
    <Where>
      <If test={name !== undefined}> AND name = { $(name) }</If>
      <If test={age !== undefined}> AND age = { $(age) }</If>
    </Where>
  </>
);

console.log(query);
```

Output:

```ts
{
  sql: "SELECT * FROM users WHERE name = ?",
  values: ["Tom"],
  text: "SELECT * FROM users WHERE name = 'Tom'"
}
```

## Dynamic Conditions

Use `If` to include SQL only when a condition is true.

```tsx
import { $, compile, If } from "tsx-sql";

const name: string | undefined = "Tom";

const query = compile(
  <>
    SELECT * FROM users
    <If test={name !== undefined}> WHERE name = { $(name) }</If>
  </>
);
```

## Where

`Where` follows the MyBatis-style behavior:

- emits `WHERE` only when its children produce SQL
- removes a leading `AND` or `OR`

```tsx
import { $, compile, If, Where } from "tsx-sql";

const name: string | undefined = "Tom";
const age: number | undefined = undefined;

const query = compile(
  <>
    SELECT * FROM users
    <Where>
      <If test={name !== undefined}> AND name = { $(name) }</If>
      <If test={age !== undefined}> AND age = { $(age) }</If>
    </Where>
  </>
);
```

Output:

```ts
{
  sql: "SELECT * FROM users WHERE name = ?",
  values: ["Tom"],
  text: "SELECT * FROM users WHERE name = 'Tom'"
}
```

## Execute With Your Database Library

`compile` returns a plain object:

```ts
interface CompileResult {
  sql: string;
  values: unknown[];
  text: string;
}
```

Use `sql` and `values` with a mature database client that accepts `?` placeholders.

```ts
await connection.query(query.sql, query.values);
```

`text` is intended for debugging and logging. Do not use it as executable SQL.

## API

### `compile(node)`

Compiles a TSX SQL node into:

- `sql`: SQL with `?` placeholders
- `values`: parameter values in order
- `text`: debug SQL with escaped values

### `$(value)`

Marks a value as a SQL parameter. Raw `{value}` expressions are not treated as SQL parameters; wrap values with `$()`.

```tsx
WHERE id = { $(id) }
```

### `<If test={boolean}>`

Includes its children when `test` is true.

### `<Where>`

Adds `WHERE` when children are not empty, and removes a leading `AND` or `OR`.

## Scope

This project only generates SQL.

It intentionally does not provide:

- database drivers
- connection pooling
- query execution
- schema modeling
- migrations
- ORM behavior
