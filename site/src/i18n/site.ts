export type Locale = 'zh' | 'en'
const zh = {
  meta: { htmlLang: 'zh-CN', title: 'Rivo — 各有职责，一起交付', description: '面向 Claude Code 与 Codex 的产品、开发与测试技能。按角色安装，围绕同一需求协作，让决定、产物与验证都有来处。' },
  nav: ['角色与能力', '如何协作', '持续掌控', '开始使用'], skip: '跳到正文',
  eyebrow: '面向 Claude Code 与 Codex 的协作技能',
  headline: ['各有职责，', '一起交付。'],
  intro: '产品把问题想清楚，开发把方案落到代码，测试发现问题并评估质量。Rivo 让不同角色围绕同一需求工作，把决定、产物和验证的来处留下来。',
  start: '选择你的角色', source: '查看源码', heroNote: '按需安装 · 接入已有团队 · 使用已连接的工具',
  boardLabel: '共享工作区', boardTitle: '一个需求，容纳不同视角。', example: '示意 · 供应商档案改进',
  boardIssue: '参与方与协作索引', boardIssueDesc: '谁在何时向谁发起协作 → 详情',
  boardFooter: '各自维护产物，共享当前依据。', foundation: '公共 Rivo', foundationDesc: '统一入口 / 协作 / 研究 / 修订 / 恢复',
  rolesLabel: '01 / 按角色选择', rolesTitle: '做好你的工作，\n接上团队的工作。',
  rolesIntro: '安装公共 rivo，再选择所需领域。可以只做开发、只做测试，也可以从产品探索开始；领域插件之间不互相依赖。',
  input: '从这些材料开始', output: '负责这些产物', skillsLabel: '查看技能', skillUnit: '项',
  roles: [
    { id: 'product', name: '产品', en: 'Product', package: 'rivo-product', verb: '从问题到明确的需求', description: '探索机会，查证假设，定义用户需要什么，以及怎样衡量结果。', input: '用户反馈、访谈、业务目标、已有研究', output: '研究结论、PRD、产品设计、指标口径', files: ['研究与依据', '需求与产品设计', '指标定义'], skills: [['discovering-products', '探索问题'], ['market-research', '市场研究'], ['competitive-analysis', '竞品分析'], ['user-research', '用户研究'], ['writing-prds', '编写需求'], ['designing-products', '产品设计'], ['reviewing-metrics', '评估指标']] },
    { id: 'development', name: '开发', en: 'Development', package: 'rivo-development', verb: '从技术判断到可运行的实现', description: '查清约束，讨论取舍，形成方案；实施、自测，并在变化中守住架构边界。', input: '需求文档、设计稿、现有代码与约束', output: '技术方案、产品代码、开发自测结果', files: ['技术讨论与方案', '代码与实施记录', '开发自测'], skills: [['converging', '技术讨论'], ['writing-plans', '编写方案'], ['implementing-plans', '实施与审阅'], ['systematic-debugging', '系统调试'], ['test-driven-development', '测试驱动开发']] },
    { id: 'testing', name: '测试', en: 'Testing', package: 'rivo-testing', verb: '从风险到有依据的质量判断', description: '设计测试，执行验证，报告缺陷；修复后复测与回归，保留已测和未测的边界。', input: '需求、接口、设计、待测版本与环境', output: '测试用例、缺陷记录、测试报告', files: ['用例与测试数据', '缺陷与失败证据', '复测与质量报告'], skills: [['designing-tests', '设计测试'], ['testing', '执行与评估'], ['reporting-defects', '反馈缺陷']] }
  ],
  sharedTitle: '共同的方法，放在公共底座。', sharedDesc: '统一入口集中维护领域路由和目录约定。通用方法可以单独使用，不必启动整套交付流程。',
  sharedSkills: [['using-rivo', '统一入口'], ['collaborating', '跨角色协作'], ['resume', '恢复工作'], ['investigating', '查证事实'], ['revising', '修订产物'], ['writing-clearly', '写清楚'], ['dispatching-subagents', '委派任务'], ['knowledge-management', '知识整理']],
  collabLabel: '02 / 协作如何发生', collabTitle: '问题交给负责人，\n决定权跟着产物走。',
  collabIntro: '开发发现需求歧义，就问需求负责人；测试发现缺陷，就交开发处理。每个角色修改自己负责的内容，协作让问题有去处。',
  scenarioLabel: '选择一个协作场景', scenarios: [
    { tab: '需求有歧义', from: '开发', to: '产品', question: '“过期的档案，用户还能查看吗？”', basis: '开发查接口时发现：需求没有明确过期状态的行为。', action: '产品确认业务规则并更新需求；开发据此调整方案，测试补充对应状态用例。', artifacts: ['产品 → 更新需求', '开发 → 调整技术方案', '测试 → 补充测试用例'] },
    { tab: '测试发现缺陷', from: '测试', to: '开发', question: '“保存成功后，刷新却丢失了同行人。”', basis: '测试在待测版本复现问题，保留步骤、期望、实际结果和版本证据。', action: '开发修改产品代码并提供修复版本；测试对新版本复测，按影响回归后更新报告。', artifacts: ['测试 → 记录缺陷与证据', '开发 → 修复产品代码', '测试 → 复测并更新报告'] },
    { tab: '实现需要改方案', from: '开发', to: '需求负责人', question: '“这个限制会影响原先约定的行为。”', basis: '实施查出新的技术约束，当前方案无法满足已确认的业务行为。', action: '开发提出影响和可选做法；业务取舍交有权人确认，再修订自己负责的方案与实现。', artifacts: ['开发 → 说明约束与影响', '有权人 → 确认业务取舍', '开发 → 修订方案与代码'] }
  ],
  request: '协作请求', response: '各方处理自己的产物',
  thinTitle: '工单精简，事项按需读取。', thinDesc: '共享工单只保留参与方和请求索引。问题、回复、证据及处理过程放在独立记录里，恢复工作时再按需读取。',
  communication: '宿主支持且授权覆盖时，可直接联系参与 Agent；否则留下待转交记录。人类同事提供的文档、链接和反馈，同样可以接入。',
  controlLabel: '03 / 在变化中保持掌控', controlTitle: '下一次打开会话，\n仍然知道为什么。',
  controlIntro: '不靠一个会话记住全部过程。让当前依据、修改理由与实际结果留在产物中，变化才有可核对的起点。',
  contextCards: [
    ['重要取舍，先摆出来', '职责边界、契约来源和扩展点的选择，在实现扩散前讨论；由有权人决定，留下理由。', '决定 → 方案 → 实现'],
    ['换个会话，从当前事实接着做', 'resume 核对当前材料、产物归属、实际版本和验证证据，再判断下一步；不用另写一份状态摘要。', '依据 / 版本 / 证据 / 下一步'],
    ['质量结论，说明验证边界', '开发自测、独立审阅和专业测试分别报告。通过、失败、受阻与未执行，都保留在结论里。', '自测 ≠ 独立测试']
  ],
  contract: '你决定范围与重要取舍。AI 查证、提出建议，并在授权内推进。',
  stLabel: '04 / 开始使用', stTitle: '带上已有材料，\n从你负责的工作开始。',
  stInstall: '安装插件', stDomain: '选择领域', stTry: '开启一次工作',
  stEnv: '领域工作流需要公共 rivo + 对应领域包。多个角色可以共装；已有同事和工具无需替换。',
  stNote: '本地文件、在线文档、粘贴内容都可以。不要求输入由其他 Rivo 插件生成。',
  cc: ['添加插件市场', '安装公共包', '安装所选领域包', '开启新会话，描述你的任务'], cx: ['添加插件市场', '安装公共包', '安装所选领域包', '开启新会话，描述你的任务'],
  prompts: ['用 Rivo 根据这些访谈材料梳理产品需求。', '用 Rivo 讨论这个需求的技术方案，参考现有代码和设计稿。', '用 Rivo 为这个版本设计测试并执行，记录缺陷和未覆盖风险。'],
  tagDelivery: '领域工作', tagMethod: '通用方法', copy: '复制', copied: '已复制', copyFailed: '复制失败',
  footLine: '各有职责。\n共同把事情做完。', footNote: '开放源码 · MIT License', footSource: '在 GitHub 参与',
}
const en: typeof zh = {
  meta: { htmlLang: 'en', title: 'Rivo — Own your work. Deliver together.', description: 'Product, development and testing skills for Claude Code and Codex. Choose your role and collaborate around shared requirements, artifacts and evidence.' },
  nav: ['Roles & skills', 'Collaboration', 'Stay in control', 'Get started'], skip: 'Skip to content',
  eyebrow: 'Collaboration skills for Claude Code & Codex', headline: ['Own your work.', 'Deliver together.'],
  intro: 'Product frames the problem. Development builds the solution. Testing finds problems and assesses quality. Rivo connects their work around a shared need, keeping decisions, artifacts and evidence within reach.',
  start: 'Choose your role', source: 'Explore the source', heroNote: 'Install what you need · Work with your team · Use connected tools',
  boardLabel: 'Shared workspace', boardTitle: 'One requirement. Different perspectives.', example: 'Illustration · Improving supplier profiles',
  boardIssue: 'Participants & request index', boardIssueDesc: 'Who asked whom, when → details', boardFooter: 'Own your artifacts. Share the current basis.', foundation: 'Shared Rivo', foundationDesc: 'Entry / Collaboration / Research / Revision / Resume',
  rolesLabel: '01 / Choose your role', rolesTitle: 'Do your work.\nConnect with your team.', rolesIntro: 'Install shared Rivo and the domains you need. Work in development, testing or product discovery; domain plugins do not depend on each other.',
  input: 'Start with', output: 'Own these artifacts', skillsLabel: 'Explore skills', skillUnit: 'skills',
  roles: [
    { id: 'product', name: 'Product', en: 'Product', package: 'rivo-product', verb: 'From a problem to clear requirements', description: 'Explore opportunities, check assumptions and define what users need and how to measure outcomes.', input: 'Feedback, interviews, business goals, existing research', output: 'Research, PRDs, product designs, metric definitions', files: ['Research & evidence', 'Requirements & product design', 'Metric definitions'], skills: [['discovering-products', 'Discover problems'], ['market-research', 'Research markets'], ['competitive-analysis', 'Analyze competitors'], ['user-research', 'Research users'], ['writing-prds', 'Write requirements'], ['designing-products', 'Design products'], ['reviewing-metrics', 'Review metrics']] },
    { id: 'development', name: 'Development', en: 'Development', package: 'rivo-development', verb: 'From technical decisions to working code', description: 'Investigate constraints, weigh trade-offs and design a solution. Build, self-test and preserve architectural boundaries as things change.', input: 'Requirements, designs, existing code and constraints', output: 'Technical plans, product code, developer test results', files: ['Technical discussions & plans', 'Code & implementation records', 'Developer self-tests'], skills: [['converging', 'Discuss technical choices'], ['writing-plans', 'Write plans'], ['implementing-plans', 'Implement & review'], ['systematic-debugging', 'Debug systematically'], ['test-driven-development', 'Test-driven development']] },
    { id: 'testing', name: 'Testing', en: 'Testing', package: 'rivo-testing', verb: 'From risks to an evidenced quality assessment', description: 'Design tests, execute checks and report defects. Retest fixes and run regressions, stating what was and was not verified.', input: 'Requirements, APIs, designs, test builds and environments', output: 'Test cases, defect records, test reports', files: ['Test cases & data', 'Defects & failure evidence', 'Retests & quality reports'], skills: [['designing-tests', 'Design tests'], ['testing', 'Execute & assess'], ['reporting-defects', 'Report defects']] }
  ],
  sharedTitle: 'Shared methods. One common foundation.', sharedDesc: 'One entry owns domain routing and workspace conventions. Use shared methods on their own without starting a full delivery workflow.',
  sharedSkills: [['using-rivo', 'Shared entry'], ['collaborating', 'Collaborate'], ['resume', 'Resume work'], ['investigating', 'Check facts'], ['revising', 'Revise artifacts'], ['writing-clearly', 'Write clearly'], ['dispatching-subagents', 'Delegate tasks'], ['knowledge-management', 'Retain knowledge']],
  collabLabel: '02 / How collaboration works', collabTitle: 'Route questions to owners.\nDecisions follow artifacts.', collabIntro: 'When a requirement is unclear, development asks its owner. When testing finds a defect, it goes to development. Each role updates its own work.',
  scenarioLabel: 'Choose a collaboration example', scenarios: [
    { tab: 'Unclear requirements', from: 'Development', to: 'Product', question: '“Can users still view an expired profile?”', basis: 'While checking the API, development finds no defined behavior for expired profiles.', action: 'Product confirms the rule and updates the requirement. Development adjusts the plan; testing adds the corresponding state cases.', artifacts: ['Product → Update requirements', 'Development → Adjust the technical plan', 'Testing → Add test cases'] },
    { tab: 'A test finds a defect', from: 'Testing', to: 'Development', question: '“Save succeeds, but companions disappear on reload.”', basis: 'Testing reproduces the issue on the supplied build, retaining steps, expected and actual results, and version evidence.', action: 'Development fixes the product code and supplies a new build. Testing retests it, runs relevant regressions and updates the report.', artifacts: ['Testing → Record defect & evidence', 'Development → Fix product code', 'Testing → Retest & update report'] },
    { tab: 'The plan needs to change', from: 'Development', to: 'Requirement owner', question: '“This constraint affects the agreed behavior.”', basis: 'Implementation uncovers a constraint: the current plan cannot satisfy the agreed business behavior.', action: 'Development explains the impact and options. An authorized person decides the business trade-off before development revises its plan and code.', artifacts: ['Development → Explain constraint & impact', 'Authorized owner → Decide the trade-off', 'Development → Revise plan & code'] }
  ],
  request: 'Collaboration request', response: 'Each participant updates their own work',
  thinTitle: 'A thin index. Details when needed.', thinDesc: 'The shared issue holds participants and a request index. Questions, replies, evidence and handling history live in separate records, read as needed.', communication: 'When the host supports it and authorization covers it, contact participating agents directly. Otherwise, record a pending handoff. Documents and feedback from human colleagues work too.',
  controlLabel: '03 / Stay in control as things change', controlTitle: 'Open the next session.\nStill know why.', controlIntro: 'A conversation should not have to remember everything. Keep current sources, reasons for changes and actual results in artifacts, so the next change has a verifiable starting point.',
  contextCards: [['Make important choices visible', 'Discuss responsibilities, contract sources and extension points before they spread through the implementation. Authorized people decide; the reasons remain.', 'Decisions → Plan → Implementation'], ['Resume from current facts', 'Resume checks current materials, ownership, actual versions and verification evidence before choosing the next action. No second status summary to maintain.', 'Sources / Versions / Evidence / Next action'], ['State the limits of quality claims', 'Developer self-tests, independent reviews and professional testing report separately. Preserve passed, failed, blocked and unexecuted checks in the conclusion.', 'Self-testing ≠ independent testing']],
  contract: 'You decide scope and key trade-offs. AI investigates, proposes and proceeds within its authorization.',
  stLabel: '04 / Get started', stTitle: 'Bring your materials.\nStart with your work.', stInstall: 'Install plugins', stDomain: 'Choose a domain', stTry: 'Start a task', stEnv: 'Domain workflows need shared Rivo + the domain plugin. Install several if needed; keep your existing colleagues and tools.', stNote: 'Local files, online documents and pasted content work. Inputs need not come from another Rivo plugin.',
  cc: ['Add the marketplace', 'Install shared Rivo', 'Install your chosen domain', 'Start a new session and describe your task'], cx: ['Add the marketplace', 'Install shared Rivo', 'Install your chosen domain', 'Start a new session and describe your task'],
  prompts: ['Use Rivo to develop product requirements from these interviews.', 'Use Rivo to discuss a technical plan for this requirement, using the existing code and designs.', 'Use Rivo to design and execute tests for this build. Record defects and uncovered risks.'], tagDelivery: 'Domain task', tagMethod: 'Shared method', copy: 'Copy', copied: 'Copied', copyFailed: 'Copy failed',
  footLine: 'Own your work.\nSee it through together.', footNote: 'Open source · MIT License', footSource: 'Contribute on GitHub',
}
export const site: Record<Locale, typeof zh> = { zh, en }
