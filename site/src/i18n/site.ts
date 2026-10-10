// 官网文案（照设计稿 Rivo Landing 的 T 字典）。中英共用同一结构，en 由类型保证与 zh 对齐
export type Locale = 'zh' | 'en'

const zh = {
  navWhy: '为什么',
  navHow: '怎样工作',
  navPrin: '设计原则',
  navSkills: '技能',
  navStart: '开始使用',
  kicker: '面向 Claude Code 与 Codex 的软件交付技能',
  h1a: '设计由',
  h1b: '你',
  h1c: '主导，',
  h1d: 'AI 查证、实施，',
  h1e: '并把理由留下来。',
  heroSub: '面向需要方案设计、团队评审和持续维护的软件交付。重要取舍由你决定，理由写进文档；实施照着你批准的方案进行。',
  ctaStart: '开始使用',
  ctaGh: '在 GitHub 查看',
  demoTitle: '一次交付 · 讨论阶段',
  you: '你',
  prompt: '用 Rivo 完成供应商档案优化。本期包括字段配置、档案页展示、表单物料、历史数据处理和报表接入。先核对我的拆解，查清现状与依赖，再讨论需要决定的问题。',
  lines: [ [ '核对拆解', '5 个模块，与你的划分一致' ], [ '查清依赖', '报表接入依赖历史数据处理' ], [ '查清现状', '档案页有 3 处读取旧字段' ] ],
  dNeed: '需要你决定',
  dQ: '历史数据怎样处理？',
  dA: '一次性迁移',
  dAd: '停机窗口内完成，代码更简单',
  dB: '读时兼容',
  dBd: '不停机，旧格式保留一个版本周期',
  stamp: '已决定',
  dWritten: '已写入 adr/001-历史数据读时兼容.md',
  whyT1: '代码能跑，',
  whyT2: '理由却丢了。',
  whyLa: '问题',
  whyLb: 'Rivo 的做法',
  whyP1: 'AI 能写出可以运行的代码，团队却未必清楚它为什么这样设计。设计交给 AI 之后，人对系统的理解越来越少；等到下一次修改，还得重新查明哪些行为能改、哪些约束必须保留。',
  whyP2: 'Rivo 让设计留在人手里。你带着需求和自己的拆解开始，AI 查清现状、指出需要决定的问题；重要取舍由你决定，理由写进文档。实施照着你批准的方案进行，验收后，核实过的机制和理由进入项目知识库。',
  howTitle: '四个阶段，每一处取舍都由你拍板。',
  howSub: '交付依次经过讨论、方案、实施与验收、知识整理。实施中发现方案的假设不成立，AI 带着证据回来找你，只暂停受影响的任务。',
  colAi: 'AI 做什么',
  colYou: '你决定什么',
  colLeave: '留下什么',
  colSkill: '技能',
  seqLabel: '实施',
  seqTitle: '实施中的往来',
  seqSub: '逐任务派发与轻审，P0 修复后由同一审阅者复核。已确认的内容要改时，带证据交你决定，再逐层修订。整体审阅通过后请你验收。',
  lanes: [ '你', '主代理', '执行者', '审阅者' ],
  seqGroups: ["循环 · 每项任务执行与轻审", "条件 A · 仅有属实 P0 时（逐任务与整体审阅均适用）", "条件 B · 仅需改已确认内容时（实施中随时进入）", "全部任务完成后 · 整体审阅与验收"],
  seq: [
    "批准方案并授权实施",
    "派发任务",
    "提交结果与验证",
    "发起逐任务轻审",
    "报告结论与问题",
    "修复核实属实的 P0",
    "提交修复与验证",
    "交同一审阅者复核",
    "无 P0，通过",
    "报告证据与修订建议",
    "决定或确认修订",
    "逐层修订，重做受影响任务",
    "发起整体审阅",
    "无 P0，通过",
    "交付结果，请验收"
],
  planLabel: '产物',
  planTitle: '稳定的主线，随内容展开。',
  planSub: '技术方案沿同一条主线展开，团队读过几次就知道去哪里找什么。章节随本次需求的内容增减。',
  tocCap: '技术方案 · 阅读主线',
  chapters: [
    [ '需求背景', '为什么做，本期的范围' ],
    [ '需求总览', '本期有哪些模块，各自交付什么' ],
    [ '整体设计', '各部分怎样配合' ],
    [ '详细设计', '逐个模块展开，与总览对应' ],
    [ '发布计划', '上线顺序、结果检查与回滚' ]
  ],
  treeCap: '文件位置',
  treeNote: '用户或项目指定的位置优先。',
  tree: [ '', '范围、决定与待决事项', '重要取舍及理由', '调查笔记与原始材料', '技术方案', '方案附件', '实施方案与实施记录', '验证证据', '审阅报告', '项目知识库', '验收后归档的需求' ],
  issue: '<需求>',
  prinTitle: '七条原则，写明了 Rivo 不做什么。',
  prinMore: '每条原则的来由见 CONTRIBUTING.md',
  principles: [
    [ '人主导设计', '你给出拆解和方向，AI 核对、查证、建议。范围、业务行为和重要取舍由你决定。' ],
    [ '一套流程，不分档位', '小需求直接写代码，不必走 Rivo。中大型需求走同一套流程，是否进入由你决定。' ],
    [ '稳定的主线，随内容展开', '每种产物有自己的模板和固定的位置，团队知道去哪里找什么；章节随本次需求的内容增减。' ],
    [ '审阅要克制', '方案只在首次定稿前全量审阅一次，之后的修订由你确认。主代理核实每条审阅意见，可以拒绝。' ],
    [ '每次实施都是对方案的检验', '执行者发现方案走不通时停下来报告证据，不绕开硬做。' ],
    [ '不维护状态', '进度从文档、审阅报告和实际改动中核对，没有状态文件，也没有跨会话交接。' ],
    [ '技能自包含', '每个阶段带着自己的模板和审阅提示词，不依赖别的技能的文件。' ]
  ],
  skTitle: '一个入口，五个流程技能，四种方法。',
  skSub: '入口技能决定什么时候走 Rivo；每个阶段带着自己的模板与审阅提示词。方法技能按名称加载，做完就结束。',
  skEntry: '入口 · 什么时候走 Rivo、交付顺序与宿主调用方式',
  skMethods: '方法',
  skMethodsSub: '按名称加载，可独立使用',
  stageSkills: [
    [ 'converging', '讨论', '核对范围，讨论并记录每个决定', [ '决定记录', 'ADR' ] ],
    [ 'writing-plans', '方案', '编写、审阅和修订技术方案', [ '技术方案', '审阅提示词', '接收审阅意见' ] ],
    [ 'implementing-plans', '实施', '安排实施、审阅与验收', [ '实施方案', '执行者', '审阅者', '接收意见' ] ],
    [ 'knowledge-management', '知识', '维护项目知识，归档交付材料', [ '知识文档' ] ]
  ],
  revising: [ '修订', '已确认的决定、方案或实施方案要改时，从受影响的最上游一层改起，逐层改到代码。', '决定 → 技术方案 → 实施方案 → 实现' ],
  methodSkills: [
    [ 'investigating', '查清技术事实，维护调查笔记' ],
    [ 'writing-clearly', '文档的表达规约，可独立使用' ],
    [ 'test-driven-development', '用失败测试驱动行为实现' ],
    [ 'systematic-debugging', '复现异常，检验原因假设并验证修复' ]
  ],
  stages: [
    {
      name: '讨论',
      ai: '核对你的拆解，查清依赖，提出需要取舍的问题',
      you: '范围和重要取舍',
      leaves: [ 'decisions.md', 'ADR' ],
      file: 'issues/供应商档案优化/adr/001-历史数据读时兼容.md',
      doc: [
        [ 'h', '# 001：历史数据采用读时兼容' ],
        [ 'm', '状态：接受（用户，2026-10-08）' ],
        [ 'm', '影响模块：历史数据处理、报表接入' ],
        [ '', '' ],
        [ 'k', '背景' ],
        [ '', '报表接入依赖历史数据；一次性迁移需要停机窗口。' ],
        [ 'k', '可行选项' ],
        [ '', '一次性迁移；读时兼容。' ],
        [ 'k', '决定与理由' ],
        [ 'r', '读时兼容，旧格式保留一个版本周期。' ],
        [ '', '不停机；回滚只需关闭兼容开关。' ]
      ]
    },
    {
      name: '方案',
      ai: '按模板写技术方案，组织一次独立审阅',
      you: '是否批准',
      leaves: [ 'plan.md' ],
      file: 'issues/供应商档案优化/plan.md',
      doc: [
        [ 'h', '## 整体设计' ],
        [ '', '字段配置与档案页共用一份 schema，表单物料由 schema 生成。' ],
        [ '', '历史数据走读时兼容，见 ADR-001。' ],
        [ '', '' ],
        [ 'q', '审阅 · 独立审阅者 · 首次定稿前一次' ],
        [ 'q', 'P1 × 2：核实 1 条已采纳，1 条拒绝并附理由' ],
        [ '', '' ],
        [ 'r', '✓ 你已批准' ]
      ]
    },
    {
      name: '实施',
      ai: '按可验收的结果实施，逐任务和整体各审一次',
      you: '是否验收',
      leaves: [ '代码', 'task.md', '验证证据' ],
      file: 'issues/供应商档案优化/task.md',
      doc: [
        [ 'h', '## 任务' ],
        [ '', 'T1 字段配置　依赖：无' ],
        [ '', 'T2 档案页展示　依赖：T1' ],
        [ '', 'T3 历史数据处理　依赖：T1' ],
        [ '', 'T4 报表接入　依赖：T3' ],
        [ '', 'T5 表单物料　依赖：T1' ],
        [ '', '' ],
        [ 'h', '## 实施记录' ],
        [ 'r', 'T3 方案假设不成立，已带证据请你确认' ],
        [ 'm', '证据 → evidence/t3-legacy-read.md' ],
        [ 'm', 'T4 等待 T3 的方案修订' ]
      ]
    },
    {
      name: '知识',
      ai: '对照最新代码更新知识库，归档需求材料',
      you: '无需决定',
      leaves: [ 'knowledge/', 'archived/' ],
      file: 'knowledge/供应商档案.md',
      doc: [
        [ 'h', '# 供应商档案' ],
        [ 'm', '适用范围：供应商档案 v2' ],
        [ 'k', '工作方式' ],
        [ '', '字段由 schema 驱动，档案页与表单共用。' ],
        [ 'k', '约束与设计理由' ],
        [ '', '旧格式读时兼容，下个版本周期移除。' ],
        [ 'k', '来源' ],
        [ 'm', 'archived/供应商档案优化 · ADR-001 · 已对照最新代码核实' ],
        [ '', '' ],
        [ 'r', '→ issues/供应商档案优化 已归档' ]
      ]
    }
  ],
  stTitle: '带着目标和你自己的拆解开始。',
  stInstall: '安装',
  stTry: '这样开口',
  stEnv: '模型分工、画图工具和开发环境写在你项目的 AGENTS.md 或 CLAUDE.md 里，Rivo 不指定。',
  stNote: '普通请求按普通方式处理。项目里有 .rivo/ 目录，也不会让每个请求都进入流程。',
  cc: [
    '在 Claude Code 会话中添加插件市场。',
    '安装 Rivo 插件。',
    '开启新会话，用 Skill 加载 rivo:<技能名>。启动 Hook 在含 .rivo/ 的项目里注入入口技能，其他项目只提示一行。'
  ],
  cx: [
    '在终端添加插件市场。',
    '安装 Rivo 插件。',
    '开启新会话，说“用 Rivo”并描述需求即可。'
  ],
  tagDelivery: '完整交付',
  tagMethod: '方法技能',
  prompts: [
    '用 Rivo 完成供应商档案优化。本期包括字段配置、档案页展示、表单物料、历史数据处理和报表接入。先核对我的拆解，查清现状与依赖，再讨论需要决定的问题。',
    '用 investigating 查清数组字段的读取方式。',
    '用 systematic-debugging 定位这个测试失败的原因。',
    '用 writing-clearly 编辑这份报告，保留现有结构。'
  ],
  copy: '复制',
  copied: '已复制',
  footLine: '下一次修改时，理由还在。',
  footCta: '在 GitHub 上获取 Rivo',
  skip: '跳到正文',
  meta: { htmlLang: 'zh-CN', title: 'Rivo — 设计由你主导', description: '面向 Claude Code 与 Codex 的软件交付技能。你主导设计，AI 查证、实施，并把理由留下来。' }
}

const en: typeof zh = {
  navWhy: 'Why',
  navHow: 'How it works',
  navPrin: 'Principles',
  navSkills: 'Skills',
  navStart: 'Get started',
  kicker: 'Software delivery skills for Claude Code & Codex',
  h1a: '',
  h1b: 'You',
  h1c: ' lead the design.',
  h1d: 'AI investigates and builds,',
  h1e: 'and writes down why.',
  heroSub: 'For software that needs real design, team review and long-term upkeep. You make the important trade-offs and the reasons go into docs; implementation follows the plan you approved.',
  ctaStart: 'Get started',
  ctaGh: 'View on GitHub',
  demoTitle: 'A delivery · Discussion',
  you: 'you',
  prompt: 'Use Rivo to improve supplier profiles: field config, profile page, form assets, legacy data and reporting. Check my breakdown, map the current state and dependencies, then raise what needs deciding.',
  lines: [
    [ 'breakdown', '5 modules, matches yours' ],
    [ 'dependency', 'reporting depends on legacy data' ],
    [ 'current', '3 reads of old fields on profile page' ]
  ],
  dNeed: 'YOUR CALL',
  dQ: 'How should legacy data be handled?',
  dA: 'One-off migration',
  dAd: 'Done in a downtime window; simpler code',
  dB: 'Read-time compat',
  dBd: 'No downtime; old format kept one cycle',
  stamp: 'DECIDED',
  dWritten: 'Written to adr/001-read-time-compat.md',
  whyT1: 'The code runs.',
  whyT2: 'The reasons are gone.',
  whyLa: 'The problem',
  whyLb: 'What Rivo does',
  whyP1: 'AI writes code that works, yet the team may not know why it was designed that way. Hand the design to AI and people understand less of their own system; at the next change, someone has to rediscover which behaviour may change and which constraints must stay.',
  whyP2: 'Rivo keeps design in human hands. You start with the requirement and your own breakdown; AI maps the current state and surfaces what needs deciding. You make the important calls, and the reasons are written down. Implementation follows the approved plan, and after acceptance the verified mechanisms and reasons enter the project knowledge base.',
  howTitle: 'Four stages. Every trade-off is your call.',
  howSub: 'Discussion, plan, implementation & acceptance, knowledge. If a plan assumption breaks mid-build, AI comes back to you with evidence — pausing only the affected tasks.',
  colAi: 'AI does',
  colYou: 'You decide',
  colLeave: 'Leaves behind',
  colSkill: 'Skill',
  seqLabel: 'Implementation',
  seqTitle: 'The back-and-forth of implementation',
  seqSub: 'Tasks are dispatched and lightly reviewed one by one; P0 fixes go back to the same reviewer. When confirmed work must change, evidence comes to you for a decision, then the revision goes layer by layer. After the full review passes, you accept.',
  lanes: [ 'You', 'Lead agent', 'Implementer', 'Reviewer' ],
  seqGroups: ["Repeat for each task · implement and review", "If verified P0 issues exist · applies to both review levels", "If confirmed work must change · at any point during implementation", "After all tasks · overall review and acceptance"],
  seq: [
    "Approve the plan and authorise work",
    "Dispatch task",
    "Submit results and checks",
    "Request task review",
    "Report findings",
    "Fix verified P0 issues",
    "Submit fixes and checks",
    "Ask the same reviewer to re-check",
    "No P0 — passed",
    "Present evidence and proposed revision",
    "Decide or confirm",
    "Revise in order; redo affected tasks",
    "Request overall review",
    "No P0 — passed",
    "Deliver results for your acceptance"
],
  planLabel: 'Artifacts',
  planTitle: 'A stable reading line, shaped by content.',
  planSub: 'Every technical plan follows the same reading line — after a few reads the team knows where to look. Chapters are added or dropped as the work requires.',
  tocCap: 'Technical plan · reading line',
  chapters: [
    [ 'Background', 'Why, and what is in scope' ],
    [ 'Overview', 'Modules in scope and what each delivers' ],
    [ 'Architecture', 'How the parts fit together' ],
    [ 'Detailed design', 'Each module, mirroring the overview' ],
    [ 'Release plan', 'Rollout order, checks and rollback' ]
  ],
  treeCap: 'File layout',
  treeNote: 'Locations set by you or the project take precedence.',
  tree: [
    '',
    'scope, decisions, open items',
    'key trade-offs and reasons',
    'investigation notes & sources',
    'technical plan',
    'plan attachments',
    'build plan & log',
    'verification evidence',
    'review reports',
    'project knowledge',
    'accepted & archived'
  ],
  issue: '<issue>',
  prinTitle: 'Seven principles — including what Rivo won’t do.',
  prinMore: 'The reasoning behind each lives in CONTRIBUTING.md',
  principles: [
    [
      'Humans lead design',
      'You give the breakdown and direction; AI checks, investigates and advises. Scope, behaviour and key trade-offs are yours.'
    ],
    [
      'One process, no tiers',
      'Small changes? Just write code. Medium and large ones share one process — and you decide when to enter it.'
    ],
    [
      'A stable reading line, shaped by content',
      'Every artifact has its own template and place, so the team knows where to look; chapters follow what the work needs.'
    ],
    [
      'Restrained review',
      'A plan gets one full review before first sign-off; later revisions are yours to confirm. The lead verifies each comment and may reject it.'
    ],
    [
      'Every build tests the plan',
      'When the plan doesn’t work, the implementer stops and reports evidence instead of forcing a workaround.'
    ],
    [
      'No state to maintain',
      'Progress is read from docs, review reports and actual changes. No state files, no cross-session handoff.'
    ],
    [
      'Self-contained skills',
      'Each stage carries its own templates and review prompts, with no dependency on other skills’ files.'
    ]
  ],
  skTitle: 'One entry, five flow skills, four methods.',
  skSub: 'The entry skill decides when Rivo applies; each stage ships its own templates and review prompts. Method skills load by name and end when done.',
  skEntry: 'Entry · when to use Rivo, delivery order, host invocation',
  skMethods: 'Methods',
  skMethodsSub: 'Load by name, use on their own',
  stageSkills: [
    [ 'converging', 'Discuss', 'Check the scope; discuss and record every decision', [ 'Decisions', 'ADR' ] ],
    [ 'writing-plans', 'Plan', 'Write, review and revise the technical plan', [ 'Plan', 'Reviewer prompt', 'Receiving review' ] ],
    [
      'implementing-plans',
      'Build',
      'Run implementation, review and acceptance',
      [ 'Build plan', 'Implementer', 'Reviewer', 'Receiving' ]
    ],
    [ 'knowledge-management', 'Knowledge', 'Maintain project knowledge; archive delivery', [ 'Knowledge doc' ] ]
  ],
  revising: [ 'Revise', 'When a confirmed decision, plan or build plan must change, start at the highest affected layer and work down to code.', 'decisions → plan → build plan → code' ],
  methodSkills: [
    [ 'investigating', 'Establish technical facts; keep investigation notes' ],
    [ 'writing-clearly', 'Writing conventions for docs; usable alone' ],
    [ 'test-driven-development', 'Drive behaviour with failing tests' ],
    [ 'systematic-debugging', 'Reproduce, test cause hypotheses, verify the fix' ]
  ],
  stages: [
    {
      name: 'Discuss',
      ai: 'Checks your breakdown, maps dependencies, raises trade-offs',
      you: 'Scope and key trade-offs',
      leaves: [ 'decisions.md', 'ADR' ],
      file: 'issues/supplier-profile/adr/001-read-time-compat.md',
      doc: [
        [ 'h', '# 001: Legacy data uses read-time compat' ],
        [ 'm', 'Status: accepted (user, 2026-10-08)' ],
        [ 'm', 'Modules: legacy data, reporting' ],
        [ '', '' ],
        [ 'k', 'Context' ],
        [ '', 'Reporting depends on legacy data; migration needs downtime.' ],
        [ 'k', 'Options' ],
        [ '', 'One-off migration; read-time compat.' ],
        [ 'k', 'Decision and reasons' ],
        [ 'r', 'Read-time compat; old format kept one release cycle.' ],
        [ '', 'No downtime; rollback is a single switch.' ]
      ]
    },
    {
      name: 'Plan',
      ai: 'Writes the plan from a template; runs one independent review',
      you: 'Approve or not',
      leaves: [ 'plan.md' ],
      file: 'issues/supplier-profile/plan.md',
      doc: [
        [ 'h', '## Architecture' ],
        [ '', 'Field config and profile page share one schema; form assets are generated from it.' ],
        [ '', 'Legacy data uses read-time compat — see ADR-001.' ],
        [ '', '' ],
        [ 'q', 'Review · independent · once before sign-off' ],
        [ 'q', 'P1 × 2: one verified & adopted, one rejected with reason' ],
        [ '', '' ],
        [ 'r', '✓ Approved by you' ]
      ]
    },
    {
      name: 'Build',
      ai: 'Builds toward verifiable outcomes; reviews per task and overall',
      you: 'Accept or not',
      leaves: [ 'code', 'task.md', 'evidence/' ],
      file: 'issues/supplier-profile/task.md',
      doc: [
        [ 'h', '## Tasks' ],
        [ '', 'T1 field config — depends: none' ],
        [ '', 'T2 profile page — depends: T1' ],
        [ '', 'T3 legacy data — depends: T1' ],
        [ '', 'T4 reporting — depends: T3' ],
        [ '', 'T5 form assets — depends: T1' ],
        [ '', '' ],
        [ 'h', '## Build log' ],
        [ 'r', 'T3 plan assumption broke; evidence sent to you' ],
        [ 'm', 'evidence → evidence/t3-legacy-read.md' ],
        [ 'm', 'T4 waits for the T3 plan revision' ]
      ]
    },
    {
      name: 'Knowledge',
      ai: 'Updates the knowledge base against latest code; archives the issue',
      you: 'Nothing to decide',
      leaves: [ 'knowledge/', 'archived/' ],
      file: 'knowledge/supplier-profile.md',
      doc: [
        [ 'h', '# Supplier profile' ],
        [ 'm', 'Scope: supplier profile v2' ],
        [ 'k', 'How it works' ],
        [ '', 'Fields are schema-driven; page and form share it.' ],
        [ 'k', 'Constraints and reasons' ],
        [ '', 'Old format read-compatible; removed next cycle.' ],
        [ 'k', 'Sources' ],
        [ 'm', 'archived/supplier-profile · ADR-001 · verified against latest code' ],
        [ '', '' ],
        [ 'r', '→ issues/supplier-profile archived' ]
      ]
    }
  ],
  stTitle: 'Start with a goal — and your own breakdown.',
  stInstall: 'Install',
  stTry: 'Say it like this',
  stEnv: 'Model roles, diagram tools and dev environment belong in your project’s AGENTS.md or CLAUDE.md. Rivo doesn’t prescribe them.',
  stNote: 'Ordinary requests are handled ordinarily. Having a .rivo/ directory doesn’t push every request into the process.',
  cc: [
    'Add the marketplace in a Claude Code session.',
    'Install the Rivo plugin.',
    'Start a new session and load skills as rivo:<skill>. The startup hook injects the entry skill in projects with .rivo/; elsewhere it prints a single line.'
  ],
  cx: [
    'Add the marketplace from your terminal.',
    'Install the Rivo plugin.',
    'Start a new chat, say “Use Rivo”, and describe your task.'
  ],
  tagDelivery: 'full delivery',
  tagMethod: 'method skill',
  prompts: [
    'Use Rivo to improve supplier profiles: field config, profile page, form assets, legacy data and reporting. Check my breakdown, map the current state and dependencies, then discuss what needs deciding.',
    'Use investigating to find out how array fields are read.',
    'Use systematic-debugging to find why this test fails.',
    'Use writing-clearly to edit this report, keeping its structure.'
  ],
  copy: 'copy',
  copied: 'copied',
  footLine: 'At the next change, the reasons are still there.',
  footCta: 'Get Rivo on GitHub',
  skip: 'Skip to content',
  meta: {
    htmlLang: 'en',
    title: 'Rivo — Design stays with you',
    description: 'Software delivery skills for Claude Code & Codex. You lead the design; AI investigates, builds and writes down why.'
  }
}

export const site: Record<Locale, typeof zh> = { zh, en }
