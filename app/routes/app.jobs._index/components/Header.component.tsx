export default function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tasks History
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track all alt text generation tasks and their status
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
