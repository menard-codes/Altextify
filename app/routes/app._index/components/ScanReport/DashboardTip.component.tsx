export default function DashboardTip() {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/20 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/20 p-3 text-primary">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Tip</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Alt text helps make your store more accessible and improves SEO. Use
            our AI tool to automatically generate descriptive alt text for all
            images.
          </p>
        </div>
      </div>
    </div>
  );
}
