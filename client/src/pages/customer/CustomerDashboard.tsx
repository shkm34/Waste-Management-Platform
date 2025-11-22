import WasteTable from "@/components/common/WasteTable";
import { useCustomerDashboard } from "./hooks/useCustomerDashboard";
function CustomerDashboard() {
  const { garbage, stats, walletBalance, error, loading, onCancelWaste } =
    useCustomerDashboard();

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Customer Dashboard
            </h1>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm mb-2">
                  Total Waste Created
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalWasteCreated}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm mb-2">Wallet Balance</h3>
                <p className="text-3xl font-bold text-green-600">
                  ₹{walletBalance}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm mb-2">Pending Pickups</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingPickups}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Waste Listings
              </h2>

              <WasteTable
                waste={garbage}
                onCancelWaste={onCancelWaste}
              ></WasteTable>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerDashboard;
