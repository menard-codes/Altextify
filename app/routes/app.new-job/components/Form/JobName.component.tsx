import { SetStateAction, useCallback } from "react";
import { NewJobForm } from "../../new-job.schema";

type JobNameParams = {
  value: string;
  isSubmitting: boolean;
  error?: string;
  setFormValue: (value: SetStateAction<NewJobForm>) => void;
};

export default function JobName({
  value,
  isSubmitting,
  error,
  setFormValue,
}: JobNameParams) {
  const handleAutoGenerateName = useCallback(() => {
    const datetime = new Date();

    // Formatters
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const dateStr = dateFormatter.format(datetime);
    const timeStr = timeFormatter.format(datetime);
    const dateTimeStr = `${dateStr} | ${timeStr}`;

    const generatedTaskName = `Bulk Alt Task (${dateTimeStr})`;

    setFormValue((prev) => ({
      ...prev,
      name: generatedTaskName,
    }));
  }, [setFormValue]);

  return (
    <div className="space-y-2">
      <label
        htmlFor="name"
        className="block text-sm font-semibold text-foreground"
      >
        Job Name
      </label>
      <p className="text-xs text-muted-foreground">
        Give your job a unique, descriptive name (required)
      </p>
      <input
        type="text"
        id="name"
        value={value}
        onChange={(e) =>
          setFormValue((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        placeholder="e.g., Summer Collection Alt Texts"
        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        disabled={isSubmitting}
        autoComplete="off"
      />
      <p className="text-xs text-red-500">{error}</p>
      <button
        type="button"
        className="flex-1 rounded-lg border border-primary/30 bg-primary/5 px-2 py-1 text-xs font-medium text-primary transition-all hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        onClick={handleAutoGenerateName}
      >
        Auto-Generate Name
      </button>
    </div>
  );
}
