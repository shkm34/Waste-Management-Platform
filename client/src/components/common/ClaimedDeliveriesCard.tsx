import {
  formatCurrency,
  formatDateTime,
  WASTE_TYPE_LABELS,
  STATUS_LABELS,
} from "../../utils";
import StatusBadge from "./StatusBadge";
import type { Garbage } from "../../types";

type ClaimedDeliveryCardProps = {
  delivery: Garbage;
  onUnclaim: (id: string) => void;
};

function ClaimedDeliveryCard({
  delivery,
  onUnclaim,
}: ClaimedDeliveryCardProps) {
  // Fallback for customer data, in case it's not populated
  const customerAddress =
    typeof delivery.customerId !== "string" && delivery.customerId?.location
      ? delivery.customerId.location.address
      : "Customer location not available";

  if (!delivery) {
    return (
      <div>
        <p>No New Claimed Deliveries</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="p-4 sm:p-5">
        {/* --- Header --- */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {WASTE_TYPE_LABELS[delivery.wasteType]} Delivery
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              ID: {delivery._id.slice(-8)}
            </p>
          </div>
          <StatusBadge status={delivery.status} />
        </div>

        {/* --- Main Details --- */}
        <div className="grid md:grid-cols-5 gap-4 my-4">
          {/* Left Column - Waste Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Waste Details
            </h4>
            <div className="space-y-2 text-sm">
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
                <span className="text-gray-600">Claimed At:</span>
                <span className="font-medium text-gray-900">
                  {delivery.claimedAt
                    ? formatDateTime(delivery.claimedAt)
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Info */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Customer Location
            </h4>
            <div className="text-sm space-y-1">
              <p className="text-gray-600">{customerAddress}</p>
            </div>
          </div>
        </div>

        {/* --- Status Footer --- */}
        <div className="border-t border-gray-100 pt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-yellow-800 font-medium text-sm">
              Waiting for a driver to be assigned
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              Current status: {STATUS_LABELS[delivery.status]}
            </p>
          </div>
          <button
            onClick={() => onUnclaim(delivery._id)}
            className="btn mt-4 w-full rounded-xl bg-green-100 px-4 py-2 text-sm font-medium text-amber-800 transition-colors duration-200 ease-in-out hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            Unclaim This Garbage
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimedDeliveryCard;
