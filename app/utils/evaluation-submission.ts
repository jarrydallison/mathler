import { tilesPerGuess, type GameState } from "~/components/game/game-board";
import { operators, type Operator } from "./generate-numbers";
import { numbers } from "~/components/game/keyboard";

// return an error string
export const functionEval: (stringFunction: string) => number = (
  stringFunction
) => {
  try {
    const response = new Function(`return ${stringFunction}`)();
    // Weed out any functions that result in NaN (e.g. Infinity)
    if (response === Infinity) {
      return undefined;
    }
    return response;
  } catch (e) {
    return undefined;
  }
};

const sortString = (s: string) => s.split("").sort().join("");

const winArray: "rgb(76, 175, 80)"[] = new Array(6).fill("rgb(76, 175, 80)");

export type BackgroundColors =
  | "rgb(76, 175, 80)" // bg-green-500
  | "rgb(234, 179, 8)" // bg-yellow-500
  | "rgb(158, 158, 158)" // bg-gray-500
  | "rgb(255, 255, 255)"; // bg-white

export type SubmissionStatus = {
  win: boolean;
  backgroundArray: BackgroundColors[];
  value: number;
};

export const emptyCharsMessage =
  "Please fill out all characters before submitting";
export const noOperatorsMessage =
  "Please submit a valid equation that includes an operator (+, -, *, or /)";
export const startEndMessage =
  "Your submission must start and end with a number";
export const backToBackMessage =
  "Your submission must not have back to back operators.";
export const invalidFunctionMessage =
  "Your submission must be a valid function. Please try again";

/**
 * Evaluates a submission for validity. We only check for a valid
 * function evaluation at the end, which is the safest
 */
export const checkValidity = (guess: string[]) => {
  // Empty chars fail
  if (guess.includes("")) {
    return emptyCharsMessage;
  } else if (!operators.some((o) => guess.includes(o))) {
    // No operators present fail
    return noOperatorsMessage;
  } else if (
    !numbers.includes(guess[0]) ||
    !numbers.includes(guess[tilesPerGuess - 1])
  ) {
    return startEndMessage;
  } else if (
    // Back to back operators fail
    guess.some((g, idx) => {
      const guessChar = g as unknown as Operator;
      if (operators.includes(guessChar)) {
        if (idx === 0) {
          return operators.includes(guess[idx + 1] as unknown as Operator);
        } else if (idx === tilesPerGuess - 1) {
          return operators.includes(guess[idx - 1] as unknown as Operator);
        } else {
          return (
            operators.includes(guess[idx + 1] as unknown as Operator) ||
            operators.includes(guess[idx - 1] as unknown as Operator)
          );
        }
      }
    })
  ) {
    return backToBackMessage;
  } else if (
    // Invalid function fail
    !functionEval(guess.join(""))
  ) {
    return invalidFunctionMessage;
  }
};

/**
 * Evaluates a valid user submission.
 * Should accept cumulative solutions (e.g. 1+5*15 === 15*5+1)
 * @param submission The expression submission
 * @param answer The expression answer
 * @returns Object describing the guess state:
 * ```jsx
 * ({
  win: boolean;
  backgroundArray: ("green" | "yellow" | "")[];
  value: number;
})
 */
export const evaluateSubmission: (gameState: GameState) => SubmissionStatus = (
  gameState
) => {
  const submission = gameState.currentGuess.join("");
  const answer = gameState.answer.expression;
  // First, see if the strings match
  if (submission === answer) {
    return {
      win: true,
      backgroundArray: winArray,
      value: functionEval(answer),
    };
  } else {
    // Evaluate the functions
    const answerEval = functionEval(answer);
    const submissionEval = functionEval(submission);
    // It's also possible it is a cumulative solution
    if (
      answerEval === submissionEval &&
      sortString(submission) === sortString(answer)
    ) {
      return {
        win: true,
        backgroundArray: winArray,
        value: functionEval(answer),
      };
    } else {
      const answerArray = answer.split("");
      // If not, then we need to see which characters match by building a response
      // array for each entry
      const responseArray = submission.split("").map((entry, idx) => {
        if (entry === answer.charAt(idx)) {
          return "rgb(76, 175, 80)";
        } else if (answerArray.includes(entry)) {
          return "rgb(234, 179, 8)";
        } else {
          return "rgb(158, 158, 158)";
        }
      });
      return {
        win: false,
        backgroundArray: responseArray,
        value: functionEval(submission),
      };
    }
  }
};
