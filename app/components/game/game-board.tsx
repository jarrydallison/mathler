import { useRef, useState, type JSX } from "react";
import { Toaster } from "~/components/ui/sonner";
import {
  evaluateSubmission,
  functionEval,
  type BackgroundColors,
} from "~/utils/evaluation-submission";
import { Keyboard, numbers } from "./keyboard";
import { operators, type Operator } from "~/utils/generate-numbers";
import { toast } from "sonner";
import { Instructions } from "../game/instructions";
import { Results } from "../game/results";
import { Tiles } from "../game/tiles";
import { Target } from "./target";
import {
  useDynamicContext,
  useUserUpdateRequest,
  type UserProfile,
} from "@dynamic-labs/sdk-react-core";
import { handleUpdateUser } from "~/utils/handle-update-user.client";
import type { PastResult } from "~/routes/stats";
import { ShowHint } from "./show-hint";
import { ClientOnly } from "remix-utils/client-only";
import { Hint } from "./hint";
import type { UpdateUser } from "node_modules/@dynamic-labs/sdk-react-core/src/lib/utils/hooks";

export const tilesPerGuess = 6;
export const totalGuesses = 6;

export type Answer = { expression: string; value: number };

export type WinStates = "playing" | "lost" | "won";

export type GameState = {
  answer: Answer;
  currentGuess: string[];
  currentGuessIndex: number;
  allGuesses: [string[]];
  allGuessesBackground: [BackgroundColors[]];
  winState: WinStates;
};

export const startGame: (answer: Answer) => GameState = (answer) => ({
  answer,
  currentGuess: new Array(tilesPerGuess).fill(""),
  currentGuessIndex: 0,
  allGuesses: new Array(totalGuesses)
    .fill(null)
    .map(() => new Array(tilesPerGuess).fill("")) as [BackgroundColors[]],
  allGuessesBackground: new Array(totalGuesses)
    .fill(null)
    .map(() => new Array(tilesPerGuess).fill("rgb(255,255,255")) as [
    BackgroundColors[]
  ],
  winState: "playing",
});

export const GameBoard = ({
  answer,
  updateUser,
  user,
  showHintElement,
  showHint,
}: {
  answer: Answer;
  user: UserProfile | undefined;
  updateUser: UpdateUser;
  showHintElement: JSX.Element;
  showHint: boolean;
}) => {
  const pastResults = JSON.parse(
    (user?.metadata as { pastResults: string })?.pastResults || "[]"
  ) as PastResult[];

  const [gameState, setGameState] = useState<ReturnType<typeof startGame>>(() =>
    startGame(answer)
  );

  // Create refs for the input fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(tilesPerGuess).fill(null)
  );

  // Handle guess submission
  function handleSubmitGuess() {
    const guess = gameState.currentGuess;
    const state = gameState.winState;

    if (state !== "playing") return;

    // Check that a valid submission was sent
    if (guess.includes("")) {
      toast("Please fill out all characters before submitting");
      return;
    } else if (!operators.some((o) => guess.includes(o))) {
      toast(
        "Please submit a valid equation that includes an operator (+, -, *, or /)"
      );
      return;
    } else if (
      // Function is invalid
      !functionEval(guess.join("")) ||
      // Guess doesn't start or end with a number
      !numbers.includes(guess[0]) ||
      !numbers.includes(guess[tilesPerGuess - 1]) ||
      // Guess includes back to back operators
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
      toast(
        `Invalid submission. Please enter a valid equation that starts and ends with a number, and doesn't have back to back operators.`
      );
      return;
    }

    const evaluatedState = evaluateSubmission(gameState);

    // Update the all guesses background guess arrays
    gameState.allGuesses[gameState.currentGuessIndex] = gameState.currentGuess;
    gameState.allGuessesBackground[gameState.currentGuessIndex] =
      evaluatedState.backgroundArray;
    const winState = evaluatedState.win
      ? "won"
      : gameState.currentGuessIndex < totalGuesses - 1
      ? "playing"
      : "lost";

    // Update state
    setGameState((prev) => ({
      ...prev,
      allGuesses: gameState.allGuesses,
      allGuessesBackground: gameState.allGuessesBackground,
      currentGuess: Array(5).fill(""),
      currentGuessIndex: prev.currentGuessIndex + 1,
      winState,
    }));

    // Check for a win
    if (evaluatedState.win) {
      gameState.winState = "won";
      handleUpdateUser(updateUser, {
        metadata: {
          pastResults: JSON.stringify(
            pastResults.concat({
              date: new Date().toLocaleDateString(),
              result: "win",
              solution: gameState.answer.expression,
            })
          ),
        },
      });
      toast("Congratulations! You won!");
    } else if (gameState.currentGuessIndex === totalGuesses - 1) {
      handleUpdateUser(updateUser, {
        metadata: {
          pastResults: JSON.stringify(
            pastResults.concat({
              date: new Date().toLocaleDateString(),
              result: "loss",
              solution: gameState.answer.expression,
            })
          ),
        },
      });
      toast(`Game Over. The correct answer was ${gameState.answer.expression}`);
    }

    if (!evaluatedState.win && gameState.currentGuessIndex < totalGuesses - 1) {
      // Move focus to first input of the next guess row
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <Target gameState={gameState} />
      {showHint && <Hint gameState={gameState} />}
      <Tiles
        gameState={gameState}
        setGameState={setGameState}
        inputRefs={inputRefs}
        handleSubmitGuess={handleSubmitGuess}
      />
      <Results gameState={gameState} setGameState={setGameState} />
      <div className="flex flex-col w-full">
        <Instructions gameState={gameState} />
        <Keyboard
          gameState={gameState}
          setGameState={setGameState}
          inputRefs={inputRefs}
          onSubmitGuess={handleSubmitGuess}
        />
      </div>
      <ClientOnly>{() => showHintElement}</ClientOnly>
      <Toaster />
    </div>
  );
};
