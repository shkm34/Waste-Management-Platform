import { STATUS_COLORS, STATUS_LABELS } from "@/utils";
import type { GarbageStatus } from "@/types";

interface StatusBadgeProps {
    status: GarbageStatus
}

function StatusBadge({status}: StatusBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export default StatusBadge
