import { Transaction } from "@/types/transaction.types";
import { formatDate } from "@/utils";

function TransactionCard({transaction}: {transaction: Transaction}) {
  return (
  <div className="max-w-md mx-auto bg-white text-black rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">
  {/* Top Section: Credit/Debit & Amount */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex flex-col">
      <span
        className={`text-sm font-medium ${
          transaction.transactionType === "credit"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {transaction.transactionType === "credit" ? "Credit" : "Debit"}
      </span>
      <h2 className="text-2xl font-semibold mt-1">
        ₹{transaction.amount}
      </h2>
    </div>

    <span
      className={`px-2.5 py-1 text-xs rounded-full font-medium ${
        transaction.garbageId.status === "accepted"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {transaction.garbageId.status}
    </span>
  </div>

  {/* Description */}
  <p className="text-sm text-gray-700 mb-3">{transaction.description}</p>

  {/* Info Bar */}
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-500">Waste Type</span>
      <span className="font-medium">{transaction.garbageId.wasteType}</span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Weight</span>
      <span className="font-medium">{transaction.garbageId.weight} kg</span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Transaction Type</span>
      <span
        className={`font-medium capitalize ${
          transaction.transactionType === "credit"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {transaction.transactionType}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Date</span>
      <span className="font-medium">{formatDate(transaction.createdAt)}</span>
    </div>
  </div>

  {/* Footer */}
  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
    <span className="text-xs text-gray-500">Customer ID:</span>
    <span className="text-xs font-mono text-gray-600">
      {transaction.customerId.slice(0, 10)}...
    </span>
  </div>
</div>
  )
}

export default TransactionCard
