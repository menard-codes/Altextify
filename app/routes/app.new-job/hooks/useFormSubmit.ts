import { FormEvent, useCallback } from "react";
import { useLocation, useNavigation, useSubmit } from "react-router";
import { NewJob, NewJobForm } from "../new-job.schema";

export function useFormSubmit({ formData }: { formData: NewJobForm }) {
  const submit = useSubmit();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      submit(
        {
          ...formData,
          scopeIdentifiers: formData.scopeIdentifiers.map(({ id }) => id),
        } as NewJob,
        {
          method: "POST",
          encType: "application/json",
        },
      );
    },
    [submit, formData],
  );

  const navigation = useNavigation();
  const location = useLocation();

  const submittingForm = navigation.location?.pathname === location.pathname;
  const navigatingToNewJob = Boolean(
    navigation.location?.pathname.match(/^\/app\/jobs\/[a-zA-Z0-9-]+$/),
  );
  const isSubmitting = Boolean(submittingForm || navigatingToNewJob);

  return {
    isSubmitting,
    handleSubmit,
  };
}
