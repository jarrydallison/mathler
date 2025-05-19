import { operators } from "~/utils/generate-numbers";
import { tilesPerGuess, totalGuesses, type GameState } from "./game-board";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "../ui/accordion";

export const Instructions = ({ gameState }: { gameState: GameState }) => (
  <Accordion type="multiple" className="w-full">
    <AccordionItem value="instructions">
      <AccordionTrigger>Instructions</AccordionTrigger>
      <AccordionContent className="text-sm text-gray-600 mt-4">
        Find a {tilesPerGuess}-character math equation that equals{" "}
        <strong>{gameState.answer.value}</strong>. The largest number is 3
        digits. You may use one or more of the following operators:{" "}
        {operators.join(", ")}. After an answer is submitted, the color of the
        tiles indicates whether the numbers and operators are correct. Green
        tiles are the correct character in the correct position. Yellow tiles
        are the correct character in the wrong position. White tiles are wholly
        incorrect. You have {totalGuesses} guesses, and numbers and operators
        can be used multiple times. Good luck!
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
