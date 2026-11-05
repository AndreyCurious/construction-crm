import { z } from "zod";

const statuses = z.enum(["new", "in_progress", "in_review", "accepted", "revision"]);
const timestamps = {
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  revision: z.number()
};

export const demoStateSchema = z.object({
  profiles: z.array(
    z.object({
      id: z.string(),
      full_name: z.string(),
      role: z.enum(["manager", "executor"]),
      created_at: z.string()
    })
  ),
  objects: z.array(
    z.object({ id: z.string(), name: z.string(), address: z.string(), created_by: z.string(), ...timestamps })
  ),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      object_id: z.string(),
      assignee_id: z.string(),
      author_id: z.string(),
      status: statuses,
      ...timestamps
    })
  ),
  history: z.array(
    z.object({
      id: z.number(),
      task_id: z.string(),
      actor_id: z.string(),
      actor_name: z.string(),
      from_status: statuses.nullable(),
      to_status: statuses,
      comment: z.string().nullable(),
      created_at: z.string()
    })
  )
});

export type DemoState = z.infer<typeof demoStateSchema>;
