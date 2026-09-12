type ProgressBarProps = {
  percent: number;
  label?: string;
};

export function ProgressBar({
  percent,
  label,
}: ProgressBarProps): React.ReactElement {
  const safePercent = Math.min(100, Math.max(0, percent));
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-center justify-between text-sm text-ink/70">
          <span>{label}</span>
          <span>{safePercent}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 overflow-hidden rounded-full bg-mist"
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-leaf"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
