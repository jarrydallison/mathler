import type { GameState } from "./game-board";

export const Hint = ({ gameState }: { gameState: GameState }) => (
  <p>
    <b>Hint:</b> The first three values are:{" "}
    {gameState.answer.expression.slice(0, 3)}
  </p>
);
