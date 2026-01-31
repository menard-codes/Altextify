import { SetStateAction } from "react";
import { NewJobForm } from "../../new-job.schema";

type OnlyGenerateMissingAltSwitch = {
  isSubmitting: boolean;
  onlyGenerateMissingAlt: boolean;
  setFormData: (value: SetStateAction<NewJobForm>) => void;
};

export default function OnlyGenerateMissingAltSwitch({
  isSubmitting,
  onlyGenerateMissingAlt,
  setFormData,
}: OnlyGenerateMissingAltSwitch) {
  return (
    <label
      htmlFor="onlyGenerateMissingAlt"
      className="flex items-start gap-4 cursor-pointer group"
    >
      <span className="sr-only">Only Generate Missing Alt Text</span>
      <div className="flex-1 space-y-1 pt-1">
        <p className="text-sm font-medium text-foreground">
          Only Generate Missing Alt Text
        </p>
        <p className="text-xs text-muted-foreground">
          If enabled, only images without alt text will be processed
        </p>
      </div>
      <div className="shrink-0 pt-0.5">
        <button
          type="button"
          id="onlyGenerateMissingAlt"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              onlyGenerateMissingAlt: !prev.onlyGenerateMissingAlt,
            }))
          }
          disabled={isSubmitting}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            onlyGenerateMissingAlt ? "bg-primary" : "bg-muted"
          } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              onlyGenerateMissingAlt ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </label>
  );
}
