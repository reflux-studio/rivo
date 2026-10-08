export const GH = 'https://github.com/reflux-studio/rivo/blob/main/skills/'
export const REPO = 'https://github.com/reflux-studio/rivo'

// 时序图泳道与每一步的收发方
export const LANE = { you: 0, lead: 1, impl: 2, rev: 3 } as const
export type Lane = keyof typeof LANE
export const SEQ: [Lane, Lane][] = [['lead', 'impl'], ['impl', 'rev'], ['rev', 'impl'], ['impl', 'rev'], ['impl', 'lead'], ['lead', 'you'], ['you', 'lead'], ['rev', 'lead'], ['lead', 'you']]

// 文件树：[前缀, 名称, 说明在 t.tree 里的下标]
export const TREE: [string, string, number][] = [['', '.rivo/', 0], ['├── ', 'issues/', 1], ['│   ├── ', 'note.md', 2], ['│   ├── ', 'adr/', 3], ['│   ├── ', 'plan.md', 4], ['│   ├── ', 'task.md', 5], ['│   ├── ', 'assets/', 6], ['│   ├── ', 'reviews/', 7], ['│   └── ', 'evidence/', 8], ['├── ', 'knowledge/', 9], ['└── ', 'archived/', 10]]

export const STAGE_SKILLS = ['converging', 'writing-plans', 'implementing-plans', 'knowledge-management']
export const DEMO_STEPS = 9
