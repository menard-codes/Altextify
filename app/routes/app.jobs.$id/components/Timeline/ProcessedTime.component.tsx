import { formatDate } from "../../utils/date";

type ProcessedTimeParams = {
  processedOn: Date;
};

export default function ProcessedTime({ processedOn }: ProcessedTimeParams) {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 pt-1">
        <p className="font-medium text-foreground">Processing Started</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(processedOn)}
        </p>
      </div>
    </div>
  );
}
