import { expect, test } from "bun:test";

test("bug-repro-13", () => {
  expect("bug-repro-13").toBe("bug-repro-13");
});
