import { useState, useEffect } from "react";
import { Garbage } from "@/types";
import IncomingDeliveriesList from "./IncomingDeliveriesList";
import { getIncomingDeliveries } from "@/services/dealerService";
import { useAuth } from "@/hooks/useAuth";
import { GARBAGE_STATUS } from "@/utils";

function DealerDashboard() {
  const [incomingDeliveries, setIncomingDeliveries] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { user } = useAuth();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIncomingDeliveries();
      setIncomingDeliveries(data);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchDeliveries();
  }, []);

  
  const stats = {
    totalIncoming: incomingDeliveries.length,

    pendingAcceptance: incomingDeliveries.filter(
      (d) => d.status === GARBAGE_STATUS.DELIVERED
    ).length,

    inTransit: incomingDeliveries.filter(
      (d) =>
        d.status === GARBAGE_STATUS.PICKED_UP ||
        d.status === GARBAGE_STATUS.READY_TO_PICK
    ).length,
  };

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dealer Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          {user?.dealerTypes && user.dealerTypes.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Accepting: </span>
              {user.dealerTypes.map((type) => (
                <span
                  key={type}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Incoming Deliveries</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalIncoming}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">In Transit</h3>
            <p className="text-3xl font-bold text-green-600">{stats.inTransit}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Pending Acceptance</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingAcceptance}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Deliveries
          </h2>
          <IncomingDeliveriesList deliveries={incomingDeliveries} />
        </div>
      </div>
    </div>
  );
}

export default DealerDashboard;
