import { useAuth } from "@/hooks/useAuth";
import AssignmentCard from "./AssignmentCard";
import { useDriverDashboard } from "./hooks/useDriverDashboard";

function DriverDashboard() {
  const { user } = useAuth();
  const {
    assignments,
    loading,
    error,
    success,
    updatingId,
    assignGarbage,
    handleStatusUpdate,
  } = useDriverDashboard();

  // Calculate statistics
  const stats = {
    active: assignments?.filter((a) =>
      ["assigned", "ready_to_pick", "picked_up"].includes(a.status)
    ).length,
    delivered: assignments?.filter((a) => a.status === "delivered").length,
    total: assignments?.length,
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          <div className="mt-3">
            <span
              className={`inline-block px-4 py-2 rounded-full font-semibold ${
                user?.driverStatus === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Status:{" "}
              {user?.driverStatus === "available" ? "Available" : "Busy"}
            </span>
          </div>
        </div>

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

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Active Assignments</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Awaiting Acceptance</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.delivered}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Assignments</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.total}</p>
          </div>
        </div>

        {/* Assignments */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            My Assignments
          </h2>

          {assignments?.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Active Assignments
              </h3>
              <p className="text-gray-500">
                You don't have any pickup assignments at the moment.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Your status is set to{" "}
                <span className="font-semibold">
                  {user?.driverStatus === "available" ? "Available" : "Busy"}
                </span>
              </p>
              <div>
                {user?.driverStatus === "available" && (
                  <button
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={assignGarbage}
                  >
                    Assign Job
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {assignments?.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  onStatusUpdate={handleStatusUpdate}
                  updatingId={updatingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
