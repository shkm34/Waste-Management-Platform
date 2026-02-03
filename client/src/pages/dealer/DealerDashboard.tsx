import IncomingDeliveriesList from "./IncomingDeliveriesList";
import ClaimedDeliveryCard from "@/components/common/ClaimedDeliveriesCard";
import { useAuth } from "@/hooks/useAuth";
import { useDealerDashboard } from "./hooks/useDealerDashboard";
import { GARBAGE_STATUS } from "@/utils";

function DealerDashboard() {
  const { user } = useAuth();

  const { incomingDeliveries, loading, error, stats, handleUnclaimDeliveries, fetchDeliveries } =
    useDealerDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Dealer Dashboard
          </h1>
          <p className="mt-1 text-lg text-slate-600">
            Welcome back, {user?.name}!
          </p>
          {user?.dealerTypes && user.dealerTypes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-slate-500 self-center">
                Accepting:
              </span>
              {user.dealerTypes.map((type) => (
                <span
                  key={type}
                  className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 mb-8 md:mb-10">
          <div className="transform-gpu rounded-xl border border-slate-100 bg-white p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              Incoming Deliveries
            </h3>
            <p className="text-4xl font-bold text-blue-600">
              {stats.totalIncoming}
            </p>
          </div>
          <div className="transform-gpu rounded-xl border border-slate-100 bg-white p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              In Transit
            </h3>
            <p className="text-4xl font-bold text-green-600">
              {stats.inTransit}
            </p>
          </div>
          <div className="transform-gpu rounded-xl border border-slate-100 bg-white p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              Pending Acceptance
            </h3>
            <p className="text-4xl font-bold text-orange-600">
              {stats.pendingAcceptance}
            </p>
          </div>
        </div>

        {/* --- Main Dashboard Layout --- */}
        {/* This grid handles the responsive 2-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Main Column: Recent Deliveries List */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="p-5 sm:p-6 md:p-8">
                <h2 className="border-b border-slate-200 pb-4 text-xl sm:text-2xl font-semibold text-slate-800">
                  Recent Deliveries
                </h2>
                <div className="mt-6">
                  <IncomingDeliveriesList
                    deliveries={incomingDeliveries}
                    onAccepted={fetchDeliveries}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Claimed Deliveries */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="p-5 sm:p-6">
                <h2 className="border-b border-slate-200 pb-4 text-lg font-semibold text-slate-800">
                  Claimed Deliveries
                </h2>
                <div className="mt-6 flex flex-col gap-4">
                  {/* This IIFE (Immediately Invoked Function Expression) checks
                if there are any claimed deliveries and renders them,
                or shows an empty state message.
              */}
                  {(() => {
                    const claimedDeliveries = incomingDeliveries.filter(
                      (delivery) => delivery.status === GARBAGE_STATUS.CLAIMED
                    );

                    if (claimedDeliveries.length === 0) {
                      return (
                        <p className="text-center text-sm text-slate-500 py-4">
                          No claimed deliveries yet.
                        </p>
                      );
                    }

                    return claimedDeliveries.map((delivery) => (
                      <ClaimedDeliveryCard
                        key={delivery._id}
                        delivery={delivery}
                        onUnclaim={handleUnclaimDeliveries}
                      />
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealerDashboard;
