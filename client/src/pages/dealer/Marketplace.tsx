import { WASTE_TYPE_LABELS, ROUTES } from "@/utils";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import { formatCurrency, formatDateTime } from "@/utils";
import { claimWaste, getMarketplace } from "@/services/dealerService";
import { useEffect, useState } from "react";
import { Garbage } from "@/types";
import { useNavigate } from "react-router-dom";
function Marketplace() {
  const [availableWaste, setAvailableWaste] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // load all waste on mount
  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      setError("");
      setLoading(true);
      const allWaste = await getMarketplace();
      setAvailableWaste(allWaste);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  const startAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(true);
  };

  //
  const handleConfirm = async (id: string) => {
   
    try {
      setLoading(true);
      await claimWaste(id);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to claim waste";

      if (errorMsg.includes("No drivers available")) {
        setError(
          "⚠️ No drivers available at the moment. Please try again later or contact support."
        );
      } else if (errorMsg.includes("already been claimed")) {
        setError("This waste has already been claimed by another dealer.");
        await fetchMarketplace(); // Refresh to remove from list
      } else if (errorMsg.includes("not accept this waste type")) {
        setError("Your facility is not configured to accept this waste type.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleClick = (id: string) => {
    navigate(ROUTES.GET_GARBAGE_PATH(id));
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Waste Marketplace
              </h1>
              <p className="text-gray-600 mt-1">
                Browse and claim available waste matching your facility's
                specialization
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {availableWaste.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Available Waste
                </h3>
                <p className="text-gray-500">
                  There are currently no waste listings matching your accepted
                  types.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableWaste.map((waste) => (
                  <div
                    onClick={() => handleClick(waste._id)}
                    key={waste._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-purple-400r transition"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {WASTE_TYPE_LABELS[waste.wasteType]}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Listed {formatDateTime(waste.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={waste.status} />
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-semibold text-gray-900">
                            {waste.weight} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Value:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(waste.equivalentPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scheduled:</span>
                          <span className="font-medium text-gray-900">
                            {formatDateTime(waste.scheduledPickupDate)}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-center">
                        <button
                          onClick={startAction}
                          className=" m-auto bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-xl cursor-pointer"
                        >
                          Claim
                        </button>
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <ConfirmModal
                          open={open}
                          title="Please Confirm"
                          message="Do you want to confirm this action?"
                          confirmText="Yes, confirm"
                          cancelText="No, cancel"
                          destructive={false}
                          loading={loading}
                          onConfirm={() => handleConfirm(waste._id)}
                          onCancel={() => setOpen(false)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Marketplace;
