import {
  formatCurrency,
  formatDate,
  WASTE_TYPE_LABELS,
  STATUS_LABELS,
} from "../../utils";
import StatusBadge from "../../components/common/StatusBadge";
import type { Garbage } from "../../types";
import { DriverGarbageAction } from "../../types";


interface AssignmentCardProps {
  assignment: Garbage;
  onStatusUpdate: (id: string, action: DriverGarbageAction) => void;
  updatingId?: string | null;
}
function AssignmentCard({
  assignment,
  onStatusUpdate,
  updatingId,
}: AssignmentCardProps) {

     const isUpdating = updatingId === assignment._id;

  // Determine next action based on current status
  const getNextAction = () => {
    switch (assignment.status) {
      case 'assigned':
        return { action: 'ready_to_pick' as const, label: 'Mark Ready to Pick', color: 'blue' };
      case 'ready_to_pick':
        return { action: 'picked_up' as const, label: 'Mark as Picked Up', color: 'green' };
      case 'picked_up':
        return { action: 'delivered' as const, label: 'Mark as Delivered', color: 'purple' };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {WASTE_TYPE_LABELS[assignment.wasteType]} Pickup
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ID: {assignment._id.slice(-8)}
            </p>
          </div>
          <StatusBadge status={assignment.status} />
        </div>

        {/* Waste Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <p className="font-semibold text-gray-900">
                {assignment.weight} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Value</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(assignment.equivalentPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {STATUS_LABELS[assignment.status]}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                assignment.status === "assigned"
                  ? "w-1/4 bg-blue-500"
                  : assignment.status === "ready_to_pick"
                  ? "w-1/2 bg-yellow-500"
                  : assignment.status === "picked_up"
                  ? "w-3/4 bg-orange-500"
                  : "w-full bg-green-500"
              }`}
            />
          </div>
        </div>

        {/* Pickup Location */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Pickup Location
          </h4>
          {typeof assignment.customerId !== "string" && (
            <div className="ml-6 text-sm">
              <p className="font-medium text-gray-900">
                {assignment.customerId.name}
              </p>
              <p className="text-gray-600">{assignment.customerId.phone}</p>
              <p className="text-gray-600">
                {assignment.customerId.location.address}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Scheduled: {formatDate(assignment.scheduledPickupDate)}
              </p>
            </div>
          )}
        </div>

        {/* Delivery Location */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Delivery Location
          </h4>
          {assignment.destinationLocation &&
            typeof assignment.dealerId !== "string" && (
              <div className="ml-6 text-sm">
                <p className="font-medium text-gray-900">
                  {assignment.dealerId?.name}
                </p>
                <p className="text-gray-600">{assignment.dealerId?.phone}</p>
                <p className="text-gray-600">
                  {assignment.destinationLocation.address}
                </p>
              </div>
            )}
        </div>

        {/* Action Button */}
        {nextAction && (
          <button
            onClick={() => onStatusUpdate(assignment._id, nextAction.action)}
            disabled={isUpdating}
            className={`w-full bg-${nextAction.color}-600 text-white py-3 px-4 rounded-lg hover:bg-${nextAction.color}-700 disabled:bg-${nextAction.color}-300 disabled:cursor-not-allowed transition font-medium`}
            style={{
              backgroundColor: isUpdating
                ? undefined
                : nextAction.color === "blue"
                ? "#2563eb"
                : nextAction.color === "green"
                ? "#16a34a"
                : "#9333ea",
            }}
          >
            {isUpdating ? "Updating..." : nextAction.label}
          </button>
        )}

        {/* Waiting for dealer message */}
        {assignment.status === "delivered" && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-purple-800 font-medium">
              Delivered Successfully!
            </p>
            <p className="text-purple-600 text-sm mt-1">
              Waiting for dealer to accept delivery
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentCard;
