import { extractShopifyId } from "lib/shopify/utils";
import RegenerateButton from "./RegenerateButton.component";
import { BulkSaveStatus } from "app/routes/app.jobs.$id/types";
import Pagination from "./Pagination.component";

type ProcessedImagesTable = {
  generatedAltTexts: {
    id: string;
    generatedAltText: string;
    imageId: string;
    originalAltText: string;
    url: string;
    productId: string;
    productName: string;
    variantId: string | null;
  }[];
  jobAutoSave: boolean;
  bulkSaveStatus: BulkSaveStatus;
  pagination: {
    currentPage: number;
    pageEnd: number;
    isChangingPage: boolean;
    totalGeneratedAltTexts: number;
    handlePageChange: (nextPage: number) => void;
  };
};

export default function ProcessedImagesTable({
  generatedAltTexts,
  jobAutoSave,
  bulkSaveStatus,
  pagination: {
    currentPage,
    pageEnd,
    isChangingPage,
    totalGeneratedAltTexts,
    handlePageChange,
  },
}: ProcessedImagesTable) {
  return (
    <>
      <div className="space-y-3">
        {generatedAltTexts.map(
          ({
            id,
            url,
            productId,
            productName,
            generatedAltText,
            originalAltText,
          }) => (
            <div
              key={id}
              className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex gap-6">
                <ImageThumbnail
                  url={url}
                  altText={
                    originalAltText !== generatedAltText && !jobAutoSave
                      ? originalAltText
                      : generatedAltText
                  }
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <ProductInfo
                    productId={productId}
                    productName={productName}
                  />

                  {/* Alt Text Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <OriginalAltText originalAltText={originalAltText} />
                    <GeneratedAltText generatedAltText={generatedAltText} />
                  </div>

                  {/* Saved Status and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Saved Status */}
                    <SaveStatus
                      autoSave={jobAutoSave}
                      bulkSaveStatus={bulkSaveStatus}
                    />

                    {/* Action Button */}
                    <RegenerateButton
                      autoSave={jobAutoSave}
                      generatedAltTextId={id}
                    />
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        pageEnd={pageEnd}
        isChangingPage={isChangingPage}
        totalGeneratedAltTexts={totalGeneratedAltTexts}
        handlePageChange={handlePageChange}
      />
    </>
  );
}

// ###############################################
// Child Components:
// ###############################################

function ImageThumbnail({ url, altText }: { url: string; altText: string }) {
  return (
    <div className="shrink-0">
      <div className="h-24 w-24 overflow-hidden rounded-lg border border-border/50 bg-muted flex items-center justify-center">
        <img
          src={url || "/placeholder.svg"}
          alt={altText}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E";
          }}
        />
      </div>
    </div>
  );
}

function ProductInfo({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-muted-foreground mb-1">Product</p>
      <a
        href={`https://admin.shopify.com/products/${extractShopifyId(productId)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {productName} →
      </a>
    </div>
  );
}

function OriginalAltText({ originalAltText }: { originalAltText: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">
        Original Alt Text
      </p>
      <p className="text-sm text-muted-foreground bg-secondary/50 rounded p-2">
        {originalAltText || <span className="italic">No alt text</span>}
      </p>
    </div>
  );
}

function GeneratedAltText({ generatedAltText }: { generatedAltText: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-foreground mb-1">
        Generated Alt Text
      </p>
      <p className="text-sm text-foreground bg-primary/5 rounded p-2">
        {generatedAltText}
      </p>
    </div>
  );
}

function SaveStatus({
  autoSave,
  bulkSaveStatus,
}: {
  autoSave: boolean;
  bulkSaveStatus: BulkSaveStatus;
}) {
  return (
    <div className="flex items-center gap-2">
      {autoSave ? (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-200">
          <svg
            className="h-4 w-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium text-green-600">
            Auto-saved Alt Text
          </span>
        </div>
      ) : bulkSaveStatus === "Completed" ? (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-200">
          <svg
            className="h-4 w-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium text-green-600">
            Alt Text Saved
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
          <svg
            className="h-4 w-4 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium text-yellow-600">
            Pending Save
          </span>
        </div>
      )}
    </div>
  );
}
