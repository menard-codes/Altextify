export default function DashboardLoader() {
  return (
    <>
      <div className="mb-8 rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              Scan in Progress
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;re scanning your store for images. This may take a few
              moments.
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-primary/20">
              <div
                className="h-full w-3/4 rounded-full bg-linear-to-r from-primary to-accent transition-all duration-700 ease-out"
                style={{
                  animation: "slideRight 2s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-secondary"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin"></div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    </>
  );
}
