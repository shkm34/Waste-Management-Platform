import { getGarbageById } from "@/services/garbageService";
import type { Garbage } from "@/types";
import { STATUS_COLORS } from "@/utils";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleString() : undefined;

export default function GarbageDetails() {
  const [garbage, setGarbage] = useState<Garbage>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  // load garbage details on mount and when id changes
  useEffect(() => {
    
    if (!id) {
      // nothing to fetch when id is absent
      setLoading(false);
      setError("Invalid garbage id");
      setGarbage(undefined);
      return;
    }

    const fetchGarbage = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getGarbageById(id);
        setGarbage(res);
      } catch (error: any) {
        setError(
          error.response?.data?.error || "Garbage Detials Loading Error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGarbage();
  }, [id]);

  const statusClass =
    STATUS_COLORS[garbage?.status || "available"] ??
    "bg-gray-100 text-gray-800";

  const personSummary = (
    p?: string | { _id: string; name?: string; phone?: string; location?: any }
  ) => {
    if (!p) return null;
    if (typeof p === "string") return <span className="text-sm">{p}</span>;
    return (
      <div className="text-sm">
        <div>{p.name ?? p._id}</div>
        {p.phone && <div className="text-xs opacity-80">{p.phone}</div>}
      </div>
    );
  };

  const timestamps =
    garbage &&
    ([
      ["Scheduled", garbage.scheduledPickupDate],
      ["Claimed", garbage.claimedAt],
      ["Assigned", garbage.assignedAt],
      ["Ready", garbage.readyAt],
      ["Picked up", garbage.pickedUpAt],
      ["Delivered", garbage.deliveredAt],
      ["Accepted", garbage.acceptedAt],
      ["Created", garbage.createdAt],
      ["Updated", garbage.updatedAt],
    ] as const);

  return (
    <>
      {loading && (
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md max-w-md mx-auto">
          {error}
        </div>
      )}

      {garbage ? (
        <section className="max-w-lg mx-auto p-4 border rounded-lg bg-white shadow-sm">
          <header className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-medium leading-tight">
                {garbage.wasteType}
              </h3>
              <div className="text-sm text-gray-600 mt-0.5">
                {garbage.weight} kg · ₹{garbage.equivalentPrice.toFixed(2)}
              </div>
            </div>

            <div
              className={`px-2 py-1 text-xs font-semibold rounded-md ${statusClass}`}
            >
              {garbage.status}
            </div>
          </header>

          <div className="mt-4 space-y-3 text-sm">
            {/* Row helper style: label left, value right */}
            <div className="flex justify-between items-start">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Customer
              </div>
              <div className="text-right">
                {personSummary(garbage.customerId) ?? (
                  <span className="text-xs text-gray-500">
                    Customer not available
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Dealer
              </div>
              <div className="text-right">
                {/* show 'Dealer not assigned' when dealer is just an id/string */}
                {typeof garbage.dealerId === "string" ? (
                  <span className="text-xs text-gray-500">
                    Dealer not assigned
                  </span>
                ) : (
                  personSummary(garbage.dealerId)
                )}
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Driver
              </div>
              <div className="text-right">
                {garbage.driverId ? (
                  personSummary(garbage.driverId)
                ) : (
                  <span className="text-xs text-gray-500">
                    Driver not assigned
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Origin
              </div>
              <div className="text-right">
                <div className="text-sm">
                  {garbage.originLocation?.address ??
                    JSON.stringify(garbage.originLocation)}
                </div>
              </div>
            </div>

            {garbage.destinationLocation && (
              <div className="flex justify-between items-start">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Destination
                </div>
                <div className="text-right text-sm">
                  {garbage.destinationLocation?.address ??
                    JSON.stringify(garbage.destinationLocation)}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 border-t pt-3 text-xs text-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Timestamps
              </div>
              <div className="text-xs text-gray-500">UTC</div>
            </div>

            <ul className="space-y-1">
              {timestamps?.map(([label, val]) =>
                val ? (
                  <li key={label} className="flex justify-between">
                    <span className="text-xs text-gray-600">{label}</span>
                    <span className="text-xs text-gray-700">{fmt(val)}</span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </section>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
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
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Garbage Details not Available
          </h3>
          <p className="text-sm text-gray-500">
            Details for this garbage item were not found.
          </p>
        </div>
      )}
    </>
  );
}
