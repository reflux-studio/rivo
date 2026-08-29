import { z } from "zod";

const nonEmpty = z.string().min(1);

export const NodeSchema = z.object({
  id: nonEmpty,
  assignees: z.array(nonEmpty).min(1),
  approve: z
    .union([z.literal("all"), z.literal("any"), z.number().int().positive()])
    .default("all"),
  instruction: z.string().optional(),
});

export const FlowSchema = z.object({
  mode: z.enum(["manual", "auto"]).default("manual"),
  description: z.string().optional(),
  nodes: z.array(NodeSchema).min(1),
}).refine(
  (f) => new Set(f.nodes.map((n) => n.id)).size === f.nodes.length,
  { message: "节点 id 必须唯一" },
);

export const EventSchema = z.discriminatedUnion("t", [
  z.object({
    t: z.literal("transition"),
    ts: nonEmpty,
    node: nonEmpty,
    flow: z.string().optional(),
    cause: z.enum(["approve", "reject", "recall"]).optional(),
  }),
  z.object({
    t: z.literal("approve"),
    ts: nonEmpty,
    node: nonEmpty,
    by: nonEmpty,
    reason: nonEmpty,
  }),
  z.object({
    t: z.literal("reject"),
    ts: nonEmpty,
    node: nonEmpty,
    by: nonEmpty,
    reason: nonEmpty,
    to: z.string().optional(),
  }),
  z.object({
    t: z.literal("recall"),
    ts: nonEmpty,
    from: nonEmpty,
    to: nonEmpty,
    by: nonEmpty,
    reason: nonEmpty,
  }),
  z.object({
    t: z.literal("close"),
    ts: nonEmpty,
    by: nonEmpty,
    reason: z.string().optional(),
  }),
]);

export const SettingsSchema = z.object({
  agents: z.record(nonEmpty, z.object({ ref: z.string().optional() })).default({}),
  scripts: z
    .object({
      transition: z.string().optional(),
      reject: z.string().optional(),
      recall: z.string().optional(),
      close: z.string().optional(),
    })
    .strict()
    .default({}),
}).strict();

export type FlowNode = z.infer<typeof NodeSchema>;
export type Flow = z.infer<typeof FlowSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Settings = z.infer<typeof SettingsSchema>;

/** The final verdict from an assignee on the current node. */
export type Verdict = {
  by: string;
  verdict: "approve" | "reject";
  reason: string;
  to?: string;
};

export const SCRIPT_EVENTS = ["transition", "reject", "recall", "close"] as const;
export type ScriptEvent = (typeof SCRIPT_EVENTS)[number];

/** The complete set of template variables. No platform concept may appear here. */
export const TEMPLATE_VARS = [
  "issue_slug",
  "node",
  "agent",
  "agent_ref",
  "reason",
  "flow",
  "log_path",
  "issue_dir",
  "workspace_dir",
] as const;
export type TemplateVar = (typeof TEMPLATE_VARS)[number];
