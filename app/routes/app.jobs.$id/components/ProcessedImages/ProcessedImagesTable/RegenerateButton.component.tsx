import { ProductImageAltGen } from "app/routes/api.regenerate-product-image-alt/ProductImageAltGenSchema";
import { action } from "app/routes/api.regenerate-product-image-alt/route";
import { useCallback } from "react";
import { useFetcher } from "react-router";

type RegenerateParams = {
  generatedAltTextId: string;
  autoSave: boolean;
};

export default function RegenerateButton({
  generatedAltTextId,
  autoSave,
}: RegenerateParams) {
  const regenerateFetcher = useFetcher<typeof action>();
  const handleRegenerate = useCallback(
    (generatedAltTextId: string) => {
      regenerateFetcher.submit(
        {
          autoSave,
          generatedAltTextId: generatedAltTextId,
        } as ProductImageAltGen,
        {
          action: `/api/regenerate-product-image-alt`,
          method: "POST",
          encType: "application/json",
        },
      );
    },
    [regenerateFetcher, autoSave],
  );

  const isRegenerating = regenerateFetcher.state !== "idle";

  return (
    <button
      onClick={() => handleRegenerate(generatedAltTextId)}
      disabled={isRegenerating}
      className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all cursor-pointer hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isRegenerating ? (
        <>
          <div className="h-3 w-3 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
          Generating...
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Regenerate
        </>
      )}
    </button>
  );
}
