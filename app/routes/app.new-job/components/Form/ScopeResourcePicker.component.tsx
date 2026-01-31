import { $Enums } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { SetStateAction } from "react";
import { NewJobForm } from "../../new-job.schema";
import { extractShopifyId } from "lib/shopify/utils";

type ScopeResourcePicker = {
  isSubmitting: boolean;
  scope: $Enums.JobScope;
  setFormData: (value: SetStateAction<NewJobForm>) => void;
};

export default function ScopeResourcePicker({
  isSubmitting,
  scope,
  setFormData,
}: ScopeResourcePicker) {
  const appBridge = useAppBridge();
  const handleOpenResourcePicker = async () => {
    if (scope === "selectedCollections") {
      const result = await appBridge.resourcePicker({
        type: "collection",
        action: "add",
        multiple: true,
      });
      if (result) {
        setFormData((prev) => ({
          ...prev,
          scopeIdentifiers: [
            ...prev.scopeIdentifiers,
            ...result.map((collection) => ({
              id: extractShopifyId(collection.id),
              name: collection.title,
              previewImage: collection.image?.originalSrc ?? "",
            })),
          ],
        }));
      }
    } else {
      const result = await appBridge.resourcePicker({
        type: "product",
        action: "add",
        multiple: true,
      });
      if (result) {
        setFormData((prev) => ({
          ...prev,
          scopeIdentifiers: [
            ...prev.scopeIdentifiers,
            ...result.map((product) => ({
              id: extractShopifyId(product.id),
              name: product.title,
              previewImage: product.images[0].originalSrc,
            })),
          ],
        }));
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-foreground">
            {scope === "selectedCollections"
              ? "Select Collections"
              : "Select Products"}
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Click the button below to choose{" "}
            {scope === "selectedCollections" ? "collections" : "products"} using
            Shopify&apos;s resource picker
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleOpenResourcePicker}
        disabled={isSubmitting}
        className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add {scope === "selectedCollections" ? "Collections" : "Products"}
      </button>
    </>
  );
}
