export default function NotStarted() {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-muted-foreground"
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
        <p className="font-medium text-foreground">Bulk Save Not Started</p>
        <p className="text-sm text-muted-foreground">
          Review the generated alt texts and click &apos;Save All Alt
          Texts&apos; when ready
        </p>
      </div>
    </div>
  );
}
