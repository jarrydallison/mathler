import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Login } from "~/components/login";
import { StatsTable } from "~/components/stats/stats-table";
import { Footer } from "~/components/ui/footer";
import { Header } from "~/components/ui/header";

export type PastResult = {
  date: string;
  result: "win" | "loss";
  solution: string;
};

export default function Stats() {
  const loggedIn = useIsLoggedIn();
  return (
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      {loggedIn ? <StatsTable /> : <Login />}
    </div>
  );
}
