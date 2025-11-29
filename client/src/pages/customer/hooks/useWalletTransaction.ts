import { getWalletBalance, getMyTransactions } from "@/services/garbageService";
import { Transaction } from "@/types/transaction.types";
import { useEffect, useState } from "react";

export const useWalletTransaction = () => {
    const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchWalletTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, walletData] = await Promise.all([
        getMyTransactions(),
        getWalletBalance(),
      ]);
      setTransactions(transactionsData.data.transactions);
      setWalletBalance(walletData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletTransactions();
  }, []);

  return { walletBalance, transactions, loading, error };
}