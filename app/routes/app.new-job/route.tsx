import { authenticate } from "app/shopify.server";
import { useState } from "react";
import {
  type ActionFunctionArgs,
  data,
  redirect,
  useActionData,
} from "react-router";
import { NewJobForm } from "./new-job.schema";
import { createNewJob } from "./server/create-new-job.server";
import Header from "./components/Header.component";
import ErrorNewJob from "./components/Error.component";
import JobName from "./components/Form/JobName.component";
import Scope from "./components/Form/Scope.component";
import ScopeResourcePicker from "./components/Form/ScopeResourcePicker.component";
import SelectedResources from "./components/Form/SelectedResources.component";
import OnlyGenerateMissingAltSwitch from "./components/Form/OnlyGenerateMissingAltSwitch.component";
import AutoSaveSwitch from "./components/Form/AutoSaveSwitch.component";
import { useFormSubmit } from "./hooks/useFormSubmit";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const res = await createNewJob(request, session.shop);

  if (res.type === "error") {
    return data(res, { status: 400 });
  }

  return redirect(`/app/jobs/${res.data?.id}`);
}

export default function Page() {
  const [formData, setFormData] = useState<NewJobForm>({
    name: "",
    scope: "allProducts",
    scopeIdentifiers: [],
    onlyGenerateMissingAlt: true,
    autoSave: true,
  });
  const actionData = useActionData<typeof action>();
  const { isSubmitting, handleSubmit } = useFormSubmit({
    formData,
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/20">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {actionData?.type === "error" && <ErrorNewJob />}

          {/* Job Name Field */}
          <JobName
            value={formData.name}
            setFormValue={setFormData}
            isSubmitting={isSubmitting}
            error={actionData?.details?.properties?.name?.errors[0]}
          />

          {/* Scope Field */}
          <Scope
            value={formData.scope}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />

          {/* Resource Picker Field - Conditional */}
          {formData.scope !== "allProducts" && (
            <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/30 p-4">
              {/* Scope Resource Picker Button */}
              <ScopeResourcePicker
                scope={formData.scope}
                isSubmitting={isSubmitting}
                setFormData={setFormData}
              />

              {/* Selected Resources List */}
              <SelectedResources
                scope={formData.scope}
                scopeIdentifiers={formData.scopeIdentifiers}
                isSubmitting={isSubmitting}
                setFormData={setFormData}
              />
            </div>
          )}

          {/* Toggle Options */}
          <div className="space-y-4 rounded-lg border border-border/50 bg-secondary/30 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Preferences
            </h3>

            {/* Only Generate Missing Alt Text */}
            <OnlyGenerateMissingAltSwitch
              onlyGenerateMissingAlt={formData.onlyGenerateMissingAlt}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
            />

            {/* Auto Save */}
            <AutoSaveSwitch
              autoSave={formData.autoSave}
              isSubmitting={isSubmitting}
              setFormData={setFormData}
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-linear-to-r from-accent to-primary px-4 py-3 font-medium text-accent-foreground transition-all cursor-pointer hover:shadow-lg hover:shadow-accent/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin"></div>
                  Creating Job...
                </div>
              ) : (
                "Create Job"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
