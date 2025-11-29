import { useWalletTransaction } from "./hooks/useWalletTransaction";
import TransactionCard from "@/components/common/TransactionCard";
import { Wallet } from "lucide-react";

function WalletTransaction() {
  const {walletBalance, transactions, loading, error } = useWalletTransaction();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-md mx-auto bg-white text-black rounded-2xl shadow-md border border-gray-200 p-5 flex items-center justify-between hover:shadow-lg transition">
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl shadow-inner">
            <Wallet className="text-blue-600" size={48} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Wallet Balance
            </h2>
            <p className="text-sm text-gray-500">Available amount</p>
          </div>
        </div>

        {/* Right: Balance Amount */}
        <div className="text-right">
          <h3 className="text-3xl font-bold text-green-600">
            ₹{walletBalance ?? 0}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Updated just now</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4 mt-10">
        <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
        <div className="flex items-center gap-2"></div>
      </div>

      {/* responsive grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-4
          auto-rows-fr
        "
      >
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="w-full"
            /* ensures cards stretch to equal height for nice alignment */
          >
            <TransactionCard transaction={transaction} />
          </div>
        ))}
      </div>

      {/* helpful empty state */}
      {transactions.length === 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          No transactions yet.
        </div>
      )}
    </section>
  );
}

export default WalletTransaction;
