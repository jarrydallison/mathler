import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";

export const Login = () => {
  const { setShowAuthFlow } = useDynamicContext();
  return (
    <div className="h-screen mt-8 md:mt-20 lg:mt-40">
      <Button onClick={() => setShowAuthFlow(true)}>Log in to play!</Button>
    </div>
  );
};
