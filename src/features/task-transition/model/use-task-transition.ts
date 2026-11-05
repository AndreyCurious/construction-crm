import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

import type { Task, TaskStatus } from "@/entities/task";
import { getApi } from "@/shared/api";
import { useCrmMutation } from "@/shared/lib/use-crm-mutation";

type UseTaskTransitionResult = {
  task: Task;
  comment: string;
  required: boolean;
  invalid: boolean;
  pending: boolean;
  error: Error | null;
  changeComment: (event: ChangeEvent<HTMLInputElement>) => void;
  submit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export function useTaskTransition(
  initialTask: Task,
  status: TaskStatus,
  onSuccess: () => void
): UseTaskTransitionResult {
  const [task] = useState(initialTask);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const required: boolean = status === "revision";
  const missing: boolean = required && !comment.trim();
  const mutation = useCrmMutation(() => getApi().transitionTask(task, status, comment));

  const changeComment = (event: ChangeEvent<HTMLInputElement>): void => {
    setComment(event.target.value);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (!missing) {
      mutation.mutate(undefined, { onSuccess });
    }
  };

  return {
    task,
    comment,
    required,
    invalid: submitted && missing,
    pending: mutation.isPending,
    error: mutation.error,
    changeComment,
    submit
  };
}
