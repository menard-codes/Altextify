export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold text-foreground">
              ALTextify
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-powered alt text management for your store
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
