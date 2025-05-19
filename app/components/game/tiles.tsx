import { operators } from "~/utils/generate-numbers";
import { numbers } from "./keyboard";
import { type GameState, tilesPerGuess } from "./game-board";

export const Tiles = ({
  gameState,
  setGameState,
  inputRefs,
  handleSubmitGuess,
}: {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  handleSubmitGuess: () => void;
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const lastChar = value.charAt(value.length - 1);

    // Only allow numbers and operators
    if (lastChar && ![...numbers, ...operators].includes(lastChar)) {
      return;
    }

    const newGuess = [...gameState.currentGuess];
    newGuess[index] = lastChar;

    setGameState((prev) => ({
      ...prev,
      currentGuess: newGuess,
    }));

    // Move focus to the next input if a character was entered
    if (lastChar && index < tilesPerGuess - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Moves focus on backspace and arrow, and submits on enter
    if (
      (e.key === "Backspace" && !gameState.currentGuess[index] && index > 0) ||
      (e.key === "ArrowLeft" && index > 0)
    ) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      handleSubmitGuess();
    }
  };

  return (
    <div className="grid grid-rows-6 gap-2 w-full">
      {gameState.allGuesses.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-6 gap-2">
          {row.map((_, colIdx) => {
            const value =
              rowIdx === gameState.currentGuessIndex
                ? gameState.currentGuess[colIdx]
                : gameState.allGuesses[rowIdx][colIdx];

            let backgroundColor =
              gameState.allGuessesBackground[rowIdx][colIdx];
            return (
              <input
                key={colIdx}
                type="text"
                maxLength={1}
                value={value ?? ""}
                // Style background inline to ensure tests can capture
                // the style
                style={{
                  backgroundColor,
                }}
                onChange={(e) => handleInputChange(e, colIdx)}
                onKeyDown={(e) => handleKeyDown(e, colIdx)}
                disabled={
                  rowIdx !== gameState.currentGuessIndex ||
                  gameState.winState !== "playing"
                }
                // For testing
                aria-label="tile-input"
                className={`flex items-center justify-center h-14 w-full border-2 ${
                  value ? "border-gray-400" : "border-gray-300"
                } text-2xl font-bold text-center transition-colors focus:outline-none focus:border-blue-500`}
                ref={(el) => {
                  if (rowIdx === gameState.currentGuessIndex && el) {
                    inputRefs.current[colIdx] = el;
                  }
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
