type ScanDetailsParams = {
  altTextPercentage: number;
  shop: string;
  lastScan: Date;
};

export default function ScanDetails({
  altTextPercentage,
  shop,
  lastScan,
}: ScanDetailsParams) {
  return (
    <>
      <h2 className="text-lg font-semibold text-foreground">Scan Details</h2>

      <div className="mt-6 space-y-4">
        {/* Alt Text Coverage Bar */}
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Alt Text Coverage
            </p>
            <p className="text-sm font-semibold text-accent">
              {altTextPercentage}%
            </p>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-linear-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${altTextPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Store Info */}
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Store
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">{shop}</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Last Scan
            </p>
            <p className="mt-1 text-sm text-foreground">
              {lastScan
                ? new Date(lastScan).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
