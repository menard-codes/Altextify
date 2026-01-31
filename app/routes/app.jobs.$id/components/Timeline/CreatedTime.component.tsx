import { formatDate } from "../../utils/date";

type CreatedTimeParams = {
  createdAt: Date;
};

export default function CreatedTime({ createdAt }: CreatedTimeParams) {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 pt-1">
        <p className="font-medium text-foreground">Job Created</p>
        <p className="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
}
