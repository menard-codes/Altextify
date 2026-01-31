export default function AutoSave() {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-accent"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 pt-1">
        <p className="font-medium text-foreground">Auto-Save Enabled</p>
        <p className="text-sm text-muted-foreground">
          Alt texts are being automatically saved
        </p>
      </div>
    </div>
  );
}
