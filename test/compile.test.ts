import { describe, expect, it } from "vitest";
import { $, compile } from "../src";

describe("compile", () => {
  it("compiles plain SQL text", () => {
    expect(compile("SELECT * FROM users")).toEqual({
      sql: "SELECT * FROM users",
      values: [],
      text: "SELECT * FROM users"
    });
  });

  it("compacts whitespace for executable SQL only", () => {
    expect(compile("SELECT   *\nFROM users")).toEqual({
      sql: "SELECT * FROM users",
      values: [],
      text: "SELECT   *\nFROM users"
    });
  });

  it("compiles parameterized SQL fragments", () => {
    expect(compile(["SELECT * FROM users WHERE name = ", $("O'Reilly")])).toEqual({
      sql: "SELECT * FROM users WHERE name = ?",
      values: ["O'Reilly"],
      text: "SELECT * FROM users WHERE name = 'O''Reilly'"
    });
  });
});
