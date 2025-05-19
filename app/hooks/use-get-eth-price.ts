import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Big from "big.js";

export const useGetEthPrice = () => {
  const [ethUsdPrice, setEthUsdPrice] = useState<{
    ethPriceInUSD: Big;
    tenCentsInEth: Big;
    tenCentsInWei: bigint;
  }>({
    ethPriceInUSD: new Big(0),
    tenCentsInEth: new Big(0),
    tenCentsInWei: BigInt(0),
  });
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchEthUsdPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      if (data && data.ethereum && data.ethereum.usd) {
        return data.ethereum.usd;
      } else {
        setError("Could not retrieve ETH/USD price from CoinGecko.");
      }
    } catch (err: any) {
      setError(`Error fetching ETH/USD price: ${err.message}`);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchEthUsdPrice()
      .then((r) => {
        setPrice(r);
      })
      .catch(() => void 0)
      .finally(() => setLoading(false));
  }, []);

  return {
    price,
    loading,
    error,
    refetchPrice: fetchEthUsdPrice,
  };
};
