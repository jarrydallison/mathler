import { operators } from "~/utils/generate-numbers";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import type { WinStates, GameState } from "./game-board";

export const numbers = Array.from({ length: 10 }, (_, i) => String(i));

const RenderButtonRow = ({
  characters,
  handleCharacterInput,
  winState,
}: {
  characters: string[];
  handleCharacterInput: (num: string) => void;
  winState: WinStates;
}) => (
  <div className="flex justify-center gap-2">
    {characters.map((char) => (
      <Button
        key={char}
        onClick={() => handleCharacterInput(String(char))}
        className="size-10 p-0"
        variant="outline"
        disabled={winState !== "playing"}
      >
        {char}
      </Button>
    ))}
  </div>
);

export const Keyboard = ({
  gameState,
  setGameState,
  inputRefs,
  onSubmitGuess,
}: {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  onSubmitGuess: () => void;
}) => {
  const handleCharInput = (num: string) => {
    if (gameState.winState !== "playing") return;

    const currentGuess = [...gameState.currentGuess];
    const emptyIndex = currentGuess.findIndex((c) => c === "");

    if (emptyIndex !== -1) {
      currentGuess[emptyIndex] = num;
      setGameState((prev) => ({
        ...prev,
        currentGuess,
      }));

      // Move focus to the next input
      if (emptyIndex < 4) {
        inputRefs.current[emptyIndex + 1]?.focus();
      }
    }
  };

  function handleBackspace() {
    if (gameState.winState !== "playing") return;

    const currentGuess = [...gameState.currentGuess];
    for (let i = currentGuess.length - 1; i >= 0; i--) {
      if (currentGuess[i] !== "") {
        currentGuess[i] = "";
        setGameState((prev) => ({
          ...prev,
          currentGuess,
        }));

        // Focus on the input that was cleared
        inputRefs.current[i]?.focus();
        break;
      }
    }
  }
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="keyboard">
        <AccordionTrigger>Keyboard</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col md:flex-row gap-2">
            <div
              className="flex flex-col gap-2 w-full"
              style={{ transitionDelay: "600ms" }}
            >
              <RenderButtonRow
                characters={numbers.slice(0, 5)}
                handleCharacterInput={handleCharInput}
                winState={gameState.winState}
              />
              <RenderButtonRow
                characters={numbers.slice(5)}
                handleCharacterInput={handleCharInput}
                winState={gameState.winState}
              />
              <RenderButtonRow
                characters={operators.map((o) => o)}
                handleCharacterInput={handleCharInput}
                winState={gameState.winState}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-max">
              <Button
                onClick={handleBackspace}
                className="px-3"
                variant="outline"
                disabled={gameState.winState !== "playing"}
              >
                ←
              </Button>
              <Button
                onClick={onSubmitGuess}
                className="px-3"
                disabled={gameState.winState !== "playing"}
              >
                Enter
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
