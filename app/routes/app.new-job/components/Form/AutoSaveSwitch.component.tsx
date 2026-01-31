import { SetStateAction } from "react";
import { NewJobForm } from "../../new-job.schema";

type AutoSaveSwitchParams = {
  isSubmitting: boolean;
  autoSave: boolean;
  setFormData: (value: SetStateAction<NewJobForm>) => void;
};

export default function AutoSaveSwitch({
  isSubmitting,
  autoSave,
  setFormData,
}: AutoSaveSwitchParams) {
  return (
    <label
      htmlFor="autoSave"
      className="flex items-start gap-4 border-t border-border/50 pt-4 cursor-pointer group"
    >
      <span className="sr-only">Auto Save Generated Alt Text</span>
      <div className="flex-1 space-y-1 pt-1">
        <p className="text-sm font-medium text-foreground">
          Auto Save Generated Alt Text
        </p>
        <p className="text-xs text-muted-foreground">
          If enabled, generated alt text will be automatically saved to your
          products
        </p>
      </div>
      <div className="shrink-0 pt-0.5">
        <button
          type="button"
          id="autoSave"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              autoSave: !prev.autoSave,
            }))
          }
          disabled={isSubmitting}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            autoSave ? "bg-primary" : "bg-muted"
          } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              autoSave ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </label>
  );
}
