/**
 * EventCapacityBar.jsx
 * ============================================================
 * Visual capacity progress bar.
 * Shows "X / Y Homes Filled" with a color-coded bar.
 * Matches mockup sidebar (Image 9).
 * ============================================================
 */

import { cn } from "../../lib/utils";

interface EventCapacityBarProps {
  filled?: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
}

export default function EventCapacityBar({
  filled = 0,
  max = 10,
  label = "Homes Filled",
  showLabel = true,
  wrapperClassName = "",
  labelClassName = "",
}: EventCapacityBarProps) {
  const percent = max > 0 ? Math.min((filled / max) * 100, 100) : 0;

  let fillClass = "capacity-bar__fill bg-primary";
  if (percent >= 100) fillClass += " capacity-bar__fill--full";
  else if (percent >= 75) fillClass += " capacity-bar__fill--warning";

  return (
    <div
      className={cn("capacity-bar", wrapperClassName)}
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemax={max}
    >
      <span
        className={cn(
          "uppercase tracking-wider text-muted-foreground text-xs font-semibold",
          !showLabel && "shrink-0",
          labelClassName,
        )}
      >
        🏠 {showLabel ? `${filled}/${max} ${label}` : `${filled}/${max}`}
      </span>

      <div className="capacity-bar__track h-3 rounded-lg w-full">
        <div className={fillClass} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
