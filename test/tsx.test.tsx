import { describe, expect, it } from "vitest";
import { $, compile, If, Where } from "../src";

describe("tsx", () => {
  it("compiles a fragment", () => {
    expect(compile(<>SELECT 1</>)).toEqual({
      sql: "SELECT 1",
      values: [],
      text: "SELECT 1"
    });
  });

  it("includes If children when test is truthy", () => {
    expect(
      compile(
        <>
          SELECT * FROM users WHERE 1 = 1
          <If test={true}> AND name = { $("Tom") }</If>
        </>
      )
    ).toEqual({
      sql: "SELECT * FROM users WHERE 1 = 1 AND name = ?",
      values: ["Tom"],
      text: "SELECT * FROM users WHERE 1 = 1 AND name = 'Tom'"
    });
  });

  it("omits If children when test is falsy", () => {
    expect(
      compile(
        <>
          SELECT * FROM users WHERE 1 = 1
          <If test={false}> AND name = { $("Tom") }</If>
        </>
      )
    ).toEqual({
      sql: "SELECT * FROM users WHERE 1 = 1",
      values: [],
      text: "SELECT * FROM users WHERE 1 = 1"
    });
  });

  it("adds Where and trims a leading AND", () => {
    expect(
      compile(
        <>
          SELECT * FROM users
          <Where>
            <If test={true}> AND name = { $("Tom") }</If>
          </Where>
        </>
      )
    ).toEqual({
      sql: "SELECT * FROM users WHERE name = ?",
      values: ["Tom"],
      text: "SELECT * FROM users WHERE name = 'Tom'"
    });
  });

  it("trims a leading OR from Where", () => {
    expect(
      compile(
        <>
          SELECT * FROM users
          <Where>
            <If test={true}> OR age &gt; { $(18) }</If>
          </Where>
        </>
      )
    ).toEqual({
      sql: "SELECT * FROM users WHERE age > ?",
      values: [18],
      text: "SELECT * FROM users WHERE age > 18"
    });
  });

  it("omits Where when all children are empty", () => {
    expect(
      compile(
        <>
          SELECT * FROM users
          <Where>
            <If test={false}> AND name = { $("Tom") }</If>
          </Where>
        </>
      )
    ).toEqual({
      sql: "SELECT * FROM users",
      values: [],
      text: "SELECT * FROM users"
    });
  });
});
