import { describe, expect, it, vi } from "vitest";
import type { useOutletContext } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { generateFunction } from "~/utils/generate-function";
import { functionEval } from "~/utils/evaluation-submission";
import { operators } from "~/utils/generate-numbers";
import { numbers } from "~/components/game/keyboard";
import {
  GameBoard,
  tilesPerGuess,
  totalGuesses,
} from "~/components/game/game-board";
import type { UpdateUserReturnPayload } from "node_modules/@dynamic-labs/sdk-react-core/src/lib/utils/hooks";

vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useOutletContext: () =>
    ({ language: "en" } satisfies Partial<typeof useOutletContext>),
  Link: vi.fn().mockImplementation((props) => props.children),
}));

const setup = () => {
  const testGameExpression = "10+2+3";
  render(
    <GameBoard
      answer={{
        expression: testGameExpression,
        value: 15,
      }}
      showHint={false}
      showHintElement={<>Test</>}
      updateUser={async () => void 0 as unknown as UpdateUserReturnPayload}
      user={undefined}
    />
  );
  const tiles = screen.getAllByLabelText("tile-input");
  return { testGameExpression, tiles };
};

describe("Game rendering", () => {
  const expression = generateFunction();
  it("should render the game board", () => {
    render(
      <GameBoard
        answer={{
          expression,
          value: functionEval(expression),
        }}
        showHint={false}
        showHintElement={<>Test</>}
        updateUser={async () => void 0 as unknown as UpdateUserReturnPayload}
        user={undefined}
      />
    );
    // Ensure answer renders
    const answer = screen.getAllByText(functionEval(expression));
    expect(answer.length).toBe(1);
    expect(answer[0].textContent).toBe(String(functionEval(expression)));
  });

  it(`Should render ${totalGuesses * tilesPerGuess} tiles`, () => {
    render(
      <GameBoard
        answer={{
          expression,
          value: functionEval(expression),
        }}
        showHint={false}
        showHintElement={<>Test</>}
        updateUser={async () => void 0 as unknown as UpdateUserReturnPayload}
        user={undefined}
      />
    );
    const tiles = screen.getAllByLabelText("tile-input");
    // Run a guess to
    fireEvent.keyDown(tiles[tilesPerGuess - 1], {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    expect(tiles.length).toBe(totalGuesses * tilesPerGuess);
    // Input 6 numbers
    expect(tiles[0].textContent).toBe("");
    fireEvent.change(tiles[0], { target: { value: "2" } });
    expect((tiles[0] as HTMLInputElement).value).toBe("2");
    // Background color test
    expect(tiles[0] as HTMLInputElement).toHaveStyle(
      "background-color: rgb(255, 255, 255)"
    );
  });

  it(`Should render all gray background`, () => {
    const { testGameExpression, tiles } = setup();
    // All wrong
    for (let j = 0; j < tilesPerGuess; j++) {
      fireEvent.change(tiles[j], {
        target: {
          value:
            j === 2
              ? operators.find((o) => !testGameExpression.includes(o))
              : numbers.find((n) => !testGameExpression.includes(n)),
        },
      });
    }
    // Press Enter
    fireEvent.keyDown(tiles[tilesPerGuess - 1], {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    for (let j = 0; j < tilesPerGuess; j++) {
      expect(tiles[j] as HTMLInputElement).toHaveStyle(
        "background-color: rgb(158, 158, 158)"
      );
    }
  });

  it(`Should render all yellow background`, () => {
    const { testGameExpression, tiles } = setup();
    // Run the next set of tiles, but this time so all bg colors are yellow
    for (let j = 0; j < tilesPerGuess; j++) {
      fireEvent.change(tiles[j], {
        // Just do the test equation in reverse
        target: { value: testGameExpression[tilesPerGuess - 1 - j] },
      });
    }
    // Press Enter
    fireEvent.keyDown(tiles[tilesPerGuess - 1], {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    for (let j = 0; j < tilesPerGuess; j++) {
      expect((tiles[j] as HTMLInputElement).value).toBe(
        testGameExpression[tilesPerGuess - 1 - j]
      );
      expect(tiles[j] as HTMLInputElement).toHaveStyle(
        "background-color: rgb(234, 179, 8)"
      );
    }
  });

  it(`Should render all green background`, () => {
    const { testGameExpression, tiles } = setup();
    for (let j = 0; j < tilesPerGuess; j++) {
      fireEvent.change(tiles[j], {
        target: { value: testGameExpression[j] },
      });
    }
    // Press Enter
    fireEvent.keyDown(tiles[tilesPerGuess - 1], {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    for (let j = 0; j < tilesPerGuess; j++) {
      expect((tiles[j] as HTMLInputElement).value).toBe(testGameExpression[j]);
      expect(tiles[j] as HTMLInputElement).toHaveStyle(
        "background-color: rgb(76, 175, 80)"
      );
    }
  });
});
