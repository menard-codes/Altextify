type SummaryStatsParams = {
  totalImages: number;
  imagesWithAltText: number;
  altTextPercentage: number;
};

export default function SummaryStats({
  totalImages,
  imagesWithAltText,
  altTextPercentage,
}: SummaryStatsParams) {
  const missingAltText = totalImages - imagesWithAltText;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Images Card */}
      <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Images
            </p>
            <p className="mt-2 text-balance text-4xl font-bold text-foreground">
              {totalImages}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* With Alt Text Card */}
      <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              With Alt Text
            </p>
            <p className="mt-2 text-balance text-4xl font-bold text-foreground">
              {imagesWithAltText}
            </p>
            <p className="mt-1 text-sm text-accent font-medium">
              {altTextPercentage}% coverage
            </p>
          </div>
          <div className="rounded-lg bg-accent/10 p-3 text-accent">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Missing Alt Text Card */}
      <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-destructive/50 hover:shadow-lg hover:shadow-destructive/10 sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Missing Alt Text
            </p>
            <p className="mt-2 text-balance text-4xl font-bold text-foreground">
              {missingAltText}
            </p>
            <p className="mt-1 text-sm text-destructive font-medium">
              {100 - altTextPercentage}%{" "}
              {missingAltText <= 1 ? "need update" : "need updates"}
            </p>
          </div>
          <div className="rounded-lg bg-destructive/10 p-3 text-destructive">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 6a9 9 0 110-18 9 9 0 010 18z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
