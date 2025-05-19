import { generateFunction } from "~/utils/generate-function";
import { Button } from "../ui/button";
import { functionEval } from "~/utils/evaluation-submission";
import { type GameState, startGame } from "./game-board";

export const Results = ({
  gameState,
  setGameState,
}: {
  gameState: GameState;
  setGameState: any;
}) =>
  gameState.winState !== "playing" ? (
    <div className="text-center mb-2 animate-fadeIn">
      <p className="text-lg font-medium">
        {gameState.winState === "won"
          ? "You won!"
          : `The correct answer was ${gameState.answer.expression}`}
      </p>
      <Button
        onClick={() => {
          const expression = generateFunction();
          setGameState(
            startGame({ expression, value: functionEval(expression) })
          );
        }}
        className="mt-2"
      >
        New Game
      </Button>
    </div>
  ) : undefined;
