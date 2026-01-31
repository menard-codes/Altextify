export default function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create New Job
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure alt text generation settings for your store
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
