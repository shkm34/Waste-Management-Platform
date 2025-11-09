import { useState } from "react";
import {
  formatCurrency,
  formatDateTime,
  WASTE_TYPE_LABELS,
  STATUS_LABELS,
} from "../../utils";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmModal from "@/components/common/ConfirmModal";
import type { Garbage } from "../../types";
import { acceptDelivery } from "@/services/dealerService";

interface IncomingDeliveriesListProps {
  deliveries: Garbage[];
}

function IncomingDeliveriesList({ deliveries }: IncomingDeliveriesListProps) {
  const [acceptingId, setAcceptingId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Set acceptingId state for grabage dealer choosed to accept
  // open confirm modal for confirmation of action
  const startAction = (garbageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcceptingId(garbageId);
    setOpen(true);
  };

  const handleAcceptDelivery = async (garbageId: string) => {
    if (!garbageId) {
      setSuccess("");
      setLoading(false);
      setError("No delivery selected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const result = await acceptDelivery(garbageId);
      setSuccess(
        `Delivery accepted! Customer has been credited ${formatCurrency(
          result.data.transaction.amount
        )}.`
      );

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to accept delivery");
    } finally {
      setLoading(false);
    }
  };

  if (deliveries.length === 0) {
    return (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Incoming Deliveries
        </h3>
        <p className="text-gray-500">
          You don't have any waste being delivered at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 scroll-auto max-h-[600px] overflow-y-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          Loading...
        </div>
      ) : (
        <>
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white hover:bg-indigo-100 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {WASTE_TYPE_LABELS[delivery.wasteType]} Delivery
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {delivery._id.slice(-8)}
                    </p>
                  </div>
                  <StatusBadge status={delivery.status} />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Left Column - Waste Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Waste Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900">
                          {WASTE_TYPE_LABELS[delivery.wasteType]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium text-gray-900">
                          {delivery.weight} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(delivery.equivalentPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Status:</span>
                        <span className="font-medium text-gray-900">
                          {STATUS_LABELS[delivery.status]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Driver & Customer Info */}
                  <div className="space-y-4">
                    {/* Driver Info */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Driver Information
                      </h4>
                      {typeof delivery.driverId !== "string" &&
                        delivery.driverId && (
                          <div className="text-sm space-y-1">
                            <p className="font-medium text-gray-900">
                              {delivery.driverId.name}
                            </p>
                            <p className="text-gray-600">
                              {delivery.driverId.phone}
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Customer Location
                      </h4>
                      {typeof delivery.customerId !== "string" && (
                        <div className="text-sm space-y-1">
                          <p className="text-gray-600">
                            {delivery.customerId.location.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Delivery Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    {delivery.claimedAt && (
                      <div className="flex justify-between text-gray-600">
                        <span>Claimed:</span>
                        <span>{formatDateTime(delivery.claimedAt)}</span>
                      </div>
                    )}
                    {delivery.assignedAt && (
                      <div className="flex justify-between text-gray-600">
                        <span>Driver Assigned:</span>
                        <span>{formatDateTime(delivery.assignedAt)}</span>
                      </div>
                    )}
                    {delivery.pickedUpAt && (
                      <div className="flex justify-between text-gray-600">
                        <span>Picked Up:</span>
                        <span>{formatDateTime(delivery.pickedUpAt)}</span>
                      </div>
                    )}
                    {delivery.deliveredAt && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Delivered:</span>
                        <span>{formatDateTime(delivery.deliveredAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accept Button - Only show if delivered */}
                {delivery.status === "delivered" && (
                  <button
                    onClick={(e) => startAction(delivery._id, e)}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition font-medium"
                  >
                    {loading
                      ? "Accepting..."
                      : "Accept Delivery & Credit Customer"}
                  </button>
                )}

                {/* Waiting message for other statuses */}
                {delivery.status !== "delivered" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-800 font-medium">
                      Waiting for driver to deliver this waste
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      Current status: {STATUS_LABELS[delivery.status]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmModal
          open={open}
          title="Confirm that you have received this waste?"
          message="This will credit the customer."
          confirmText="Yes, confirm"
          cancelText="No, cancel"
          destructive={false}
          loading={loading}
          onConfirm={() => handleAcceptDelivery(acceptingId)}
          onCancel={() => setOpen(false)}
        />
      </div>
    </div>
  );
}

export default IncomingDeliveriesList;
