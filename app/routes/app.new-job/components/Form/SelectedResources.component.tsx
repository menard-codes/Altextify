import { $Enums } from "@prisma/client";
import { SetStateAction } from "react";
import { NewJobForm } from "../../new-job.schema";

type SelectedResourcesParams = {
  scopeIdentifiers: {
    id: string;
    name: string;
    previewImage: string;
  }[];
  scope: $Enums.JobScope;
  isSubmitting: boolean;
  setFormData: (value: SetStateAction<NewJobForm>) => void;
};

export default function SelectedResources({
  scopeIdentifiers,
  scope,
  isSubmitting,
  setFormData,
}: SelectedResourcesParams) {
  const handleRemoveResource = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      scopeIdentifiers: prev.scopeIdentifiers.filter(
        (identifier) => identifier.id !== id,
      ),
    }));
  };
  return (
    scopeIdentifiers.length > 0 && (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Selected {scopeIdentifiers.length}{" "}
          {scope === "selectedCollections" ? "collection" : "product"}
          {scopeIdentifiers.length !== 1 ? "s" : ""}
        </p>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border/50 bg-background p-2 space-y-2">
          {scopeIdentifiers.map(({ id, name, previewImage }) => (
            <div
              key={id}
              className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5"
            >
              {/* Thumbnail Image */}
              {previewImage && (
                <div className="shrink-0">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt={name}
                    className="h-10 w-10 rounded object-cover border border-border/50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2264%22 height=%2264%22/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}

              {/* Resource Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {name}
                </p>
                <a
                  href={previewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 truncate block transition-colors"
                >
                  View in Shopify Admin →
                </a>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveResource(id)}
                disabled={isSubmitting}
                className="shrink-0 text-primary/60 hover:text-primary transition-colors disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
