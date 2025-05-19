import type { GameState } from "./game-board";

export const Target = ({ gameState }: { gameState: GameState }) => (
  <div className="text-sm md:text-2xl font-bold bg-gray-100 px-6 py-3 rounded-lg shadow-sm">
    Find an equation that equals:{" "}
    <span className="text-base md:text-3xl text-green-600">
      {gameState.answer.value}
    </span>
  </div>
);
