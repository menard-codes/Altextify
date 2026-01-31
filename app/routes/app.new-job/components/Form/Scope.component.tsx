import { $Enums } from "@prisma/client";
import { SetStateAction } from "react";
import { NewJobForm } from "../../new-job.schema";

type ScopeParams = {
  value: $Enums.JobScope;
  isSubmitting: boolean;
  setFormData: (value: SetStateAction<NewJobForm>) => void;
};

export default function Scope({
  value,
  setFormData,
  isSubmitting,
}: ScopeParams) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="scope"
        className="block text-sm font-semibold text-foreground"
      >
        Scope
      </label>
      <p className="text-xs text-muted-foreground">
        Choose which products to generate alt text for
      </p>
      <select
        id="scope"
        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        disabled={isSubmitting}
        value={value}
        onInput={(e) =>
          setFormData((prev) => ({
            ...prev,
            scope: e.currentTarget.value as $Enums.JobScope,
          }))
        }
      >
        <option value="allProducts">All Products</option>
        <option value="selectedCollections">Selected Collections</option>
        <option value="selectedProducts">Selected Products</option>
      </select>
    </div>
  );
}
