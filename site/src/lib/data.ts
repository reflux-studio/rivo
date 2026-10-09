export const GH = 'https://github.com/reflux-studio/rivo/blob/main/skills/'
export const REPO = 'https://github.com/reflux-studio/rivo'

// 时序图泳道与每一步的收发方
export const LANE = { you: 0, lead: 1, impl: 2, rev: 3 } as const
export type Lane = keyof typeof LANE
export const SEQ: [Lane, Lane][] = [['you', 'lead'], ['lead', 'impl'], ['impl', 'lead'], ['lead', 'rev'], ['rev', 'lead'], ['lead', 'impl'], ['lead', 'rev'], ['impl', 'lead'], ['lead', 'you'], ['you', 'lead'], ['lead', 'impl'], ['rev', 'lead'], ['lead', 'you']]

// 文件树：[前缀, 名称, 说明在 t.tree 里的下标]；下标 0 表示该行没有说明
// 说明顺序与 README「文件位置」一致：decisions → adr → research → plan → assets → task → evidence → reviews → knowledge → archived
export const TREE: [string, string, number][] = [['', '.rivo/', 0], ['├── ', 'issues/', 0], ['│   ├── ', 'decisions.md', 1], ['│   ├── ', 'adr/', 2], ['│   ├── ', 'research/', 3], ['│   ├── ', 'plan.md', 4], ['│   ├── ', 'assets/', 5], ['│   ├── ', 'task.md', 6], ['│   ├── ', 'evidence/', 7], ['│   └── ', 'reviews/', 8], ['├── ', 'knowledge/', 9], ['└── ', 'archived/', 10]]

export const STAGE_SKILLS = ['converging', 'writing-plans', 'implementing-plans', 'knowledge-management']
export const DEMO_STEPS = 9
