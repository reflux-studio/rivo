export const GH = 'https://github.com/reflux-studio/rivo/blob/main/skills/'
export const REPO = 'https://github.com/reflux-studio/rivo'

// 整次交付中的人机与独立视角协作节奏
export const LANE = { you: 0, lead: 1, impl: 2, rev: 3 } as const
export type Lane = keyof typeof LANE
export const SEQ: [Lane, Lane][] = [
  ['you', 'lead'],
  ['lead', 'impl'],
  ['lead', 'rev'],
  ['lead', 'you'],
  ['lead', 'impl'],
  ['lead', 'rev'],
  ['lead', 'you'],
  ['lead', 'impl'],
  ['lead', 'you'],
  ['you', 'lead']
]
export const SEQ_GROUPS = [
  { start: 0, end: 1 },
  { start: 1, end: 4 },
  { start: 4, end: 7 },
  { start: 7, end: 10 }
]

// 文件树：[前缀, 名称, 说明在 t.tree 里的下标]；下标 0 表示该行没有说明
// 说明顺序与 README「文件位置」一致：decisions → adr → research → plan → assets → test-plan → task → evidence → reviews → knowledge → archived
export const TREE: [string, string, number][] = [['', '.rivo/', 0], ['├── ', 'issues/', 0], ['│   ├── ', 'decisions.md', 1], ['│   ├── ', 'adr/', 2], ['│   ├── ', 'research/', 3], ['│   ├── ', 'plan.md', 4], ['│   ├── ', 'assets/', 5], ['│   ├── ', 'test-plan.md', 6], ['│   ├── ', 'task.md', 7], ['│   ├── ', 'evidence/', 8], ['│   └── ', 'reviews/', 9], ['├── ', 'knowledge/', 10], ['└── ', 'archived/', 11]]

export const STAGE_SKILLS = ['converging', 'writing-plans', 'implementing-plans', 'knowledge-management']
export const DEMO_STEPS = 8
