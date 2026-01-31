import { formatDate } from "../../utils/date";

type LastUpdatedCardParams = {
  createdAt: Date;
  finishedOn: Date | null;
};

export default function LastUpdatedCard({
  createdAt,
  finishedOn,
}: LastUpdatedCardParams) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Last Updated
        </h3>
      </div>
      <div className="text-sm font-medium text-foreground">
        {formatDate(finishedOn || createdAt)}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {finishedOn ? "Completed" : "Created"}
      </p>
    </div>
  );
}
