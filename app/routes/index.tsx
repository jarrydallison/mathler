import type { Route } from "./+types/index";
import { generateFunction } from "~/utils/generate-function";
import { functionEval } from "~/utils/evaluation-submission";
import { GameBoard } from "~/components/game/game-board";
import {
  useDynamicContext,
  useIsLoggedIn,
  useUserUpdateRequest,
} from "@dynamic-labs/sdk-react-core";
import { Login } from "~/components/login";
import { ShowHint } from "~/components/game/show-hint";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mathler" },
    { name: "description", content: "Try an solve a radnom math equation!" },
  ];
}

export const loader = () => {
  const expression = generateFunction();
  return { expression, value: functionEval(expression) };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const [showHint, setShowHint] = useState(false);
  const loggedIn = useIsLoggedIn();
  const { user } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();
  const ShowHintElement = <ShowHint setShowHint={setShowHint} />;
  return loggedIn ? (
    <GameBoard
      answer={loaderData}
      user={user}
      updateUser={updateUser}
      showHint={showHint}
      showHintElement={ShowHintElement}
    />
  ) : (
    <Login />
  );
}
