import { Link } from "react-router";

export default function Header() {
  return (
    <header className="border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/app/jobs"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-2 py-1 mb-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/80"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to History
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Job Details</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your alt text generation job
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
