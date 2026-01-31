type DurationCardParams = {
  createdAt: Date;
  finishedOn: Date | null;
};

export default function DurationCard({
  createdAt,
  finishedOn,
}: DurationCardParams) {
  const calculateDuration = (createdAt: Date, finishedOn?: Date) => {
    if (!finishedOn) return "-";
    const seconds = Math.floor(
      (finishedOn.getTime() - createdAt.getTime()) / 1000,
    );
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
      </div>
      <div className="text-2xl font-bold text-foreground">
        {finishedOn ? calculateDuration(createdAt, finishedOn) : "-"}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Processing time</p>
    </div>
  );
}
