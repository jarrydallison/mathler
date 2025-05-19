import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Footer } from "~/components/ui/footer";
import { Header } from "~/components/ui/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export type PastResult = {
  date: string;
  result: "win" | "loss";
  solution: string;
};

export const StatsTable = () => {
  const { user } = useDynamicContext();
  const pastResults = JSON.parse(
    (user?.metadata as { pastResults: string })?.pastResults || "[]"
  ) as PastResult[];
  return (
    <div className="w-screen px-4 md:px-20">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Solution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastResults.length > 0
            ? pastResults.map((p) => (
                <TableRow key={p.solution}>
                  <TableCell className="font-medium">{p.date}</TableCell>
                  <TableCell>{p.result}</TableCell>
                  <TableCell>{p.solution}</TableCell>
                </TableRow>
              ))
            : "No games played yet!"}
        </TableBody>
      </Table>
    </div>
  );
};
