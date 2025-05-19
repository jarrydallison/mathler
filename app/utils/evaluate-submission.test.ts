import { describe, expect, it, vi } from "vitest";
import { generateFunction } from "./generate-function";
import type { useOutletContext } from "react-router";
import {
  backToBackMessage,
  checkValidity,
  emptyCharsMessage,
  evaluateSubmission,
  functionEval,
  invalidFunctionMessage,
  noOperatorsMessage,
  startEndMessage,
} from "./evaluation-submission";
import { tilesPerGuess, type GameState } from "~/components/game/game-board";

vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useOutletContext: () =>
    ({ language: "en" } satisfies Partial<typeof useOutletContext>),
}));

/**
 * Tests for checking submission validity
 */
describe("Test validity checks", () => {
  it("should fail for empty characters", () => {
    // generate array of guesses with a blank in each space
    const testArray = Array.from({ length: tilesPerGuess }).map((_, idx) =>
      Array.from({ length: tilesPerGuess }).map((_, subIdx) =>
        idx === subIdx ? "" : subIdx === 3 ? "+" : "1"
      )
    );
    for (let i = 0; i < tilesPerGuess; i++) {
      expect(checkValidity(testArray[i])).toBe(emptyCharsMessage);
    }
  });
  it("should fail for no operators", () => {
    // Generate a guess with no operators
    const testArray = Array.from({ length: tilesPerGuess }).map((i) => "1");
    expect(checkValidity(testArray)).toBe(noOperatorsMessage);
  });
  it("should fail for not starting/ending with a number", () => {
    // Generate 3 arrays
    const testArray = Array.from({ length: 3 }).map((_, idx) =>
      Array.from({ length: tilesPerGuess }).map((_, subIdx) => {
        if (
          // First array starts with a +
          (idx === 0 && subIdx === 0) ||
          // Second Array ends with a +
          (idx === 1 && subIdx === tilesPerGuess - 1) ||
          // Third array starts and ends with a +
          (idx === 2 && (subIdx === 0 || subIdx === tilesPerGuess - 1))
        ) {
          return "+";
        }
        return String(subIdx);
      })
    );
    for (let i = 0; i < 3; i++) {
      expect(checkValidity(testArray[i])).toBe(startEndMessage);
    }
  });
  it("should fail for back to back operators", () => {
    // Generate otherwise valid arrays, but for back to back operators e.g. 1++234
    const testArray = Array.from({ length: tilesPerGuess - 3 }).map((_, idx) =>
      Array.from({ length: tilesPerGuess }).map((_, subIdx) => {
        if (
          subIdx !== 0 &&
          subIdx !== tilesPerGuess - 1 &&
          (subIdx === idx + 1 || subIdx === idx + 2)
        ) {
          return "+";
        }
        return String(subIdx);
      })
    );
    for (let i = 0; i < tilesPerGuess - 3; i++) {
      expect(checkValidity(testArray[i])).toBe(backToBackMessage);
    }
  });
  it("should fail for invalid function", () => {
    expect(checkValidity(["1", "2", "3", "4", "/", "0"])).toBe(
      invalidFunctionMessage
    );
  });
});

/**
 * Test for evaluating a submission. Checks for winning
 * a game and for setting the background of the tiles
 * correctly.
 */
describe("Test submission evaluation", () => {
  const generateTestGameState: (guess: string[]) => GameState = (guess) => ({
    answer: {
      expression: "10+2+3",
      value: 15,
    },
    currentGuess: guess,
    currentGuessIndex: 0,
    allGuesses: [[""]],
    allGuessesBackground: [["rgb(255, 255, 255)"]],
    winState: "playing",
  });

  it("should return gray background", () => {
    const failedGuess = ["4", "5", "6", "-", "7", "8"];
    const testGuess = generateTestGameState(failedGuess);
    expect(evaluateSubmission(testGuess)).toStrictEqual({
      win: false,
      backgroundArray: Array.from({ length: tilesPerGuess }).map(
        () => "rgb(158, 158, 158)"
      ),
      value: functionEval(failedGuess.join("")),
    });
  });

  it("should return a win for cumulative submission", () => {
    // Different cumulative guesses for 10+2+3
    const cumulativeGuesses = [
      ["3", "+", "2", "+", "10"],
      ["3", "+", "10", "+", "2"],
      ["2", "+", "3", "+", "10"],
      ["2", "+", "10", "+", "3"],
      ["10", "+", "3", "+", "2"],
    ];
    for (let i = 0; i < cumulativeGuesses.length; i++) {
      const state = generateTestGameState(cumulativeGuesses[i]);
      expect(evaluateSubmission(state)).toStrictEqual({
        win: true,
        backgroundArray: Array.from({ length: tilesPerGuess }).map(
          () => "rgb(76, 175, 80)"
        ),
        value: 15,
      });
    }
  });

  // Check non-cumulative operators and for bg-yellow
  // placement
  it("should fail for non-cumulative operators", () => {
    const nonCumulativeState: GameState = {
      answer: {
        expression: "10-2-3",
        value: 15,
      },
      currentGuess: ["3", "-", "2", "-", "10"],
      currentGuessIndex: 0,
      allGuesses: [[""]],
      allGuessesBackground: [["rgb(255, 255, 255)"]],
      winState: "playing",
    };
    expect(evaluateSubmission(nonCumulativeState)).toStrictEqual({
      win: false,
      backgroundArray: Array.from({ length: tilesPerGuess }).map(
        () => "rgb(234, 179, 8)"
      ),
      value: -9,
    });
  });

  it("Check for individual bg-yellow and bg-green placement", () => {
    // 10+2+3
    const semiRightGuess = ["1", "2", "-", "3", "+", "4"];
    const guess = generateTestGameState(semiRightGuess);
    expect(evaluateSubmission(guess)).toStrictEqual({
      win: false,
      backgroundArray: [
        "rgb(76, 175, 80)",
        "rgb(234, 179, 8)",
        "rgb(158, 158, 158)",
        "rgb(234, 179, 8)",
        "rgb(76, 175, 80)",
        "rgb(158, 158, 158)",
      ],
      value: 13,
    });
  });
});
