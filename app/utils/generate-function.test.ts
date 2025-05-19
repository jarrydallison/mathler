import { describe, expect, it, vi } from "vitest";
import { generateFunction } from "./generate-function";
import type { useOutletContext } from "react-router";
import { functionEval } from "./evaluation-submission";

vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useOutletContext: () =>
    ({ language: "en" } satisfies Partial<typeof useOutletContext>),
}));

/**
 * Generates a string function with the following properties:
 * 6 characters long
 * Numbers and operators can appear multiple times.
 * Order of operation applies (* and / are calculated before + and -)
 * For user experience, we should also ensure that the equation is
 * always a whole number
 */
describe("generate function", () => {
  const expression = generateFunction();
  it("should return a string", () => {
    expect(typeof expression).toBe("string");
  });
  it("should have a length of 6 characters", () => {
    expect(expression.length).toBe(6);
  });
  it("Should only contain numbers and valid operators", () => {
    const remainingCharacters = expression.replace(/[-+*/0-9.]/g, "");
    expect(remainingCharacters).toBe("");
  });
  it("should evaluate to a integer", () => {
    const evaluatedValue = functionEval(expression);
    expect(typeof evaluatedValue).toBe("number");
    expect(Number.isInteger(evaluatedValue)).toBe(true);
  });
});
