import { useDynamicContext, useOnramp } from "@dynamic-labs/sdk-react-core";
import Big from "big.js";
import { ethers } from "ethers";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useGetEthPrice } from "~/hooks/use-get-eth-price";
import { useSendTransaction } from "wagmi";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";
import { Loader2Icon } from "lucide-react";
import { CopyText } from "../ui/copy-text";
import { useRouteLoaderData } from "react-router";
// import { type Route } from "../../+types/root";

export const ShowHint = ({
  setShowHint,
}: {
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const data = useRouteLoaderData<any>("root");
  const { price } = useGetEthPrice();
  const { open } = useOnramp();
  const { primaryWallet } = useDynamicContext();
  const { isSuccess, sendTransaction, isPending, isError, error } =
    useSendTransaction();
  const [insufficientFunds, setInsufficientFunds] = useState("");

  useEffect(() => {
    const getCurrentBalance = async () => await primaryWallet?.getBalance();
    if (price) {
      getCurrentBalance().then((r) => {
        if (Number(r) < Number(new Big(0.1).div(price).toFixed(6))) {
          setInsufficientFunds(`Insufficient funds: ${r}`);
        }
      });
    }
  }, [primaryWallet, price]);

  return !price ? undefined : (
    <div className="fixed bottom-8 right-6 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="shadow-lg cursor-pointer">Show Hint</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get a Hint!</DialogTitle>
            <DialogDescription>
              Hints are helpful, but cost $0.10 USD. Luckily, since ETH is at $
              {price}, that's only {new Big(0.1).div(price).toFixed(6)} ETH!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {match({
              isSuccess,
              isError,
              isPending,
              noFunds: Boolean(insufficientFunds),
            })
              .with({ noFunds: true }, () => (
                <div className="space-y-2 text-sm">
                  <p>
                    There are not enough funds in your account. Please add more
                    megaETH to purchase a hint! Good news is, megaETH is free!
                  </p>
                  <p>
                    First, copy your address, then click below to add more
                    megaETH.
                  </p>
                  <p>
                    Address: <CopyText text={primaryWallet?.address || ""} />
                  </p>
                  <Button
                    className="cursor-pointer w-full"
                    onClick={() =>
                      open({
                        onrampProvider: "getMegaETH" as any,
                      })
                    }
                  >
                    Get some megaETH
                  </Button>
                </div>
              ))
              .with({ isSuccess: true }, () => {
                setShowHint(true);
                // Modal should close
                return undefined;
              })
              .with({ isError: true }, () => (
                <p className="text-wrap text-red-500 text-xs">
                  An error occurred: {JSON.stringify(error)}
                </p>
              ))
              .with({ isPending: true }, () => (
                <div className="flex justify-center items-center">
                  <Loader2Icon className="animate-spin size-6" />
                </div>
              ))
              .otherwise(() => (
                <>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    To purchase the hint, please click below.
                  </p>
                  <Button
                    disabled={Boolean(insufficientFunds)}
                    className="w-full my-4"
                    onClick={async () => {
                      try {
                        const currentBalance =
                          await primaryWallet?.getBalance();
                        if (
                          Number(currentBalance) <
                          Number(new Big(0.1).div(price).toFixed(6))
                        ) {
                        }
                        sendTransaction({
                          to: data?.paymentAddress as `0x${string}`,
                          value: ethers.parseEther(
                            new Big(0.1).div(price).toFixed(6)
                          ),
                        });
                      } catch (err) {
                        console.error(`Unable to process transaction: ${err}`);
                      }
                    }}
                  >
                    Purchase a hint
                  </Button>
                  <p className="text-xs text-red-500">{insufficientFunds}</p>
                </>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
