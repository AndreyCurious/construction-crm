import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { ConstructionObject, ObjectInput } from "@/entities/object";
import { getApi } from "@/shared/api";
import { useCrmMutation } from "@/shared/lib/use-crm-mutation";

import { objectSchema } from "./object.schema";

type UseObjectEditorResult = {
  formMethods: UseFormReturn<ObjectInput>;
  pending: boolean;
  error: Error | null;
  submit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export function useObjectEditor(
  initialObject: ConstructionObject | undefined,
  onSuccess: () => void
): UseObjectEditorResult {
  const [object] = useState(initialObject);
  const formMethods = useForm<ObjectInput>({
    resolver: zodResolver(objectSchema),
    defaultValues: { name: object?.name ?? "", address: object?.address ?? "" }
  });

  const mutation = useCrmMutation(async (input: ObjectInput): Promise<string> => {
    if (object) {
      await getApi().updateObject(object, input);

      return object.id;
    }

    return getApi().createObject(input);
  });

  const onSubmit = (input: ObjectInput): void => {
    mutation.mutate(input, { onSuccess });
  };

  const submit = (event: SubmitEvent<HTMLFormElement>): void => {
    void formMethods.handleSubmit(onSubmit)(event);
  };

  return { formMethods, pending: mutation.isPending, error: mutation.error, submit };
}
