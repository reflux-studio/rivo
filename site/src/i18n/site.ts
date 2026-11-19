// 官网文案。中英共用同一结构，en 由类型保证与 zh 对齐
export type Locale = 'zh' | 'en'

const zh = {
  navWhy: '为什么',
  navHow: '怎样工作',
  navPrin: '设计原则',
  navSkills: '技能',
  navStart: '开始使用',
  kicker: '面向 Claude Code、Codex、Antigravity 与 Gemini CLI 的软件交付技能',
  h1a: '设计由',
  h1b: '你',
  h1c: '主导，',
  h1d: 'AI 查证、实施，',
  h1e: '并把理由留下来。',
  heroSub: '不让 AI 一把梭吐出上万行失控代码。你先定方向与重要取舍，AI 查清现状和组件映射，把精炼方案拆成任务后分次推进、先复用后编码，再把核实过的机制写进项目 Wiki。',
  ctaStart: '开始使用',
  ctaGh: '在 GitHub 查看',
  you: '你',
  heroDemo: {
    title: '一次完整交付 · 供应商档案优化',
    tabsLabel: '交付阶段切换',
    replay: '↻ 自动演示',
    stages: [
      {
        tab: '讨论',
        skill: 'converging',
        prompt: '用 Rivo 完成供应商档案优化。我倾向字段与表单共用一套 schema，包含字段配置、档案页、表单物料、历史数据和报表接入。请先核对拆解、现状与组件映射。',
        lines: [
          [ '方向与拆解', '沿用单 schema 思路；5 个模块一致，报表依赖历史数据' ],
          [ '代码现状', '档案页有 3 处直接读取旧字段结构' ],
          [ '组件映射', '基础表单控件可复用 FormKit，缺动态多选样式' ]
        ],
        cardMode: 'choice' as 'choice' | 'pair',
        cardHead: '需要你决定',
        cardStep: '1 / 2',
        cardTitle: '历史数据怎样处理？',
        opt1: [ 'A', '一次性迁移', '停机窗口内完成，代码更简单' ] as [string, string, string],
        opt2: [ 'B', '读时兼容', '不停机，旧格式保留一个版本周期' ] as [string, string, string],
        stamp: '已决定',
        stampDate: '2026·10·08',
        wrote: '已写入 decisions.md 与 adr/001-历史数据读时兼容.md'
      },
      {
        tab: '方案',
        skill: 'writing-plans',
        prompt: '方向已定。按这套决定写一份精炼方案，并做一次全量审阅；我批准后，就趁当前上下文把实施任务拆出来。',
        lines: [
          [ '写进 plan.md', '架构边界、FormKit 样板与读时兼容契约（10 分钟读完）' ],
          [ '不搬进方案', '按钮显隐与常规校验留在原 PRD，不重复抄写' ],
          [ '方案审阅', '独立全量检查无 P0，已采纳 1 条契约补充' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: '批准定稿 · 同会话紧接着拆解',
        cardStep: '5 项任务',
        cardTitle: 'plan.md 定稿 v1.0 → 拆出 task.md',
        opt1: [ 'T1–2', '基础链路', '字段 schema 配置 → 档案页复用 FormKit' ] as [string, string, string],
        opt2: [ 'T3–5', '兼容与扩展', '历史读时兼容 → 报表接入 · 表单物料' ] as [string, string, string],
        stamp: '已定稿',
        stampDate: 'PLAN v1.0',
        wrote: '已写入 plan.md（定稿 v1.0）与 task.md'
      },
      {
        tab: '实施',
        skill: 'implementing-plans',
        prompt: '方案和 task.md 都已批准。请从 T2 档案页开始分次实施，优先复用 FormKit 与现有样板，做完交独立审阅。',
        lines: [
          [ '复用与实测', '沿用 BaseProfile 与 FormKit，补齐数组 null 兜底' ],
          [ '双轴审阅', '代码质量无 P0 · 需求与方案符合度无 P0' ],
          [ '发布核对', 'typecheck、构建与跨仓库发布检查已通过' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: '全部任务完成 · 待你验收',
        cardStep: '5 / 5',
        cardTitle: '交付代码与双轴审阅报告',
        opt1: [ '质量', '代码写得好不好', '复用既有组件与样板，无多余抽象' ] as [string, string, string],
        opt2: [ '符合', '需求做对没有', '对齐 PRD、ADR-001 与 plan.md' ] as [string, string, string],
        stamp: '已验收',
        stampDate: 'ALL PASS',
        wrote: '代码已提交，实测踩坑与审阅记录更新至 task.md 与 reviews/'
      },
      {
        tab: '知识',
        skill: 'knowledge-management',
        prompt: '所有任务已验收通过，帮我对照最新代码更新按系统域组织的知识库 Wiki，再把这个需求目录归档。',
        lines: [
          [ '核实最新代码', '确认字段 schema、FormKit 适配与 null 兜底已落地' ],
          [ '合并系统域 Wiki', '更新 supplier-archive.md，不单建结项总结' ],
          [ '归档需求目录', '移入 .rivo/archived/供应商档案优化/' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: '知识库已按系统域更新',
        cardStep: 'Wiki',
        cardTitle: 'knowledge/supplier-archive.md',
        opt1: [ '正文', '核心机制与约束', '数据落点、组件复用与读时兼容生命周期' ] as [string, string, string],
        opt2: [ '溯源', '演进来源', '关联归档目录、ADR-001 与验证记录' ] as [string, string, string],
        stamp: '已归档',
        stampDate: 'WIKI SYNC',
        wrote: '下一次新会话开启，打开 Wiki 与 README 即接上全部上下文'
      }
    ]
  },
  whyT1: '代码能跑，',
  whyT2: '人却接不住了。',
  whyLa: '问题',
  whyLb: 'Rivo 的做法',
  whyP1: '让 AI 一把梭写完需求，往往换来上万行牵一发而动全身的代码；写前端时也容易放着项目组件库不用，自己重造一套原生控件。设计长期外包给 AI 之后，人对系统越来越陌生，下一次改动还得重新查明哪些约束不能碰。',
  whyP2: 'Rivo 把节奏和决定权留给人。设计前先问你是否已有思路，再查清代码现状与组件映射，用决策树只把关键取舍交给你；方案定稿后趁上下文完整拆出任务，分次推进、做完由独立审阅者检查代码质量与方案符合度，验收后把最新机制写进按系统域组织的 Wiki。',
  howTitle: '四个阶段，重要取舍由你拍板，节奏可控推进。',
  howSub: '交付依次经过讨论、方案、实施与验收、知识整理。局部假设不成立时带证据用 revising 逐层修改；中后期若发现底层模型要重做，及时收尾并另开需求，不把平行方案堆在同一个目录。',
  colAi: 'AI 做什么',
  colYou: '你决定什么',
  colLeave: '留下什么',
  colSkill: '技能',
  seqLabel: '实施',
  seqTitle: '分次实施与独立双轴审阅',
  seqSub: '按任务分次推进，每项任务开工先列待办、动手前先复用已有组件与样板，完成后分别审阅代码写得好不好（代码质量与规范）和需求做对没有（需求与方案符合度）。全部完成后做整体审阅，同时核对发布准备。',
  lanes: [ '你', '主会话', '任务实施', '双轴审阅' ],
  seqGroups: [
    '循环 · 按任务接力实施，完成后双轴独立审阅',
    '条件 A · 仅有属实 P0 时（单项任务与整体收尾均适用）',
    '条件 B · 仅需改已确认内容时（实施中随时进入）',
    '全部任务完成后 · 整体审阅、发布核对与验收'
  ],
  seq: [
    '批准 plan.md 并在同会话拆出 task.md，授权开工',
    '按任务取参照样板与组件约束执行',
    '提交改动、真实验证输出与 task.md 记录',
    '发起代码质量与方案符合度双轴审阅',
    '分开报告两轴结论、分级与实测证据',
    '修复核实属实的 P0 问题',
    '提交修复与真实命令验证输出',
    '交同一审阅者复核',
    '两轴均无 P0，通过',
    '带证据报告偏离（局部或底层模型问题）',
    '决定按修订链改，或收尾后另开重构需求',
    '按修订链从上游逐层重做受影响任务',
    '发起整体双轴审阅，同时核对发布清单',
    '两轴均无 P0，通过',
    '交付代码、审阅结论与发布核对项，请验收'
  ],
  planLabel: '产物',
  planTitle: '技术方案做减法，十分钟能读完。',
  planSub: '技术方案只写架构边界、参照样板、核心契约、关键假设与发布顺序；PRD 里已写明的按钮显隐和常规校验不搬进来，批准后立即在同会话拆进 task.md。',
  tocCap: '技术方案 · 阅读主线',
  chapters: [
    [ '需求背景与范围', '为什么做；本期做什么，明确不做什么' ],
    [ '需求总览', '有哪些模块，各自交付什么、涉及哪些系统' ],
    [ '整体设计', '完整做法与前后端参照样板、组件复用约定' ],
    [ '关键设计与契约', '数据模型、状态流转、职责边界与接口契约' ],
    [ '关键假设与风险', '最依赖的前提假设（失真后果）及协作风险' ],
    [ '发布计划', '部署与配置顺序、数据迁移、检查与回滚' ]
  ],
  treeCap: '文件位置',
  treeNote: '用户或项目指定的位置优先；需求根目录只放以上入口。',
  tree: [
    '',
    '范围、决定与待决事项',
    '重要取舍及理由',
    '按主题维护的调查笔记',
    '精炼的技术方案',
    '方案附件与长字段表',
    '任务拆分与每项任务的实测记录',
    '验证证据与一次性排障日志',
    '双轴审阅报告',
    '按系统域组织的知识库 Wiki',
    '验收后归档的需求'
  ],
  issue: '<需求>',
  prinTitle: '五条原则，管住边界也留出余地。',
  prinMore: '每条原则的来由见 CONTRIBUTING.md',
  principles: [
    [ '人主导设计，AI 拆决策树', '动手设计前先问你是否已有方向，没有时 AI 再拟方案。代码和配置能查明的事实由 AI 自己查，影响架构、行为和返工成本的取舍交你拍板。' ],
    [ '方案与任务同会话产出，实施分次接力', '批准 plan.md 后趁上下文完整立即拆出 task.md；之后按任务分次开启新会话推进，靠 task.md 的实测记录和仓库里已提交的样板接力。' ],
    [ '方案做减法，代码先复用', 'plan.md 控制在十分钟内读完，不搬运 PRD 细则；动手写代码前先核对前后端参照样板和组件映射，不放着现有组件重造轮子。' ],
    [ '代码质量与方案符合度双轴审阅', '每项任务开工先建待办清单防止漏步，收尾由独立审阅者分别检查“代码写得好不好”和“需求做对没有”，不让一边掩盖另一边。' ],
    [ '知识库按系统域维护成 Wiki', '验收后对照最新代码合入对应系统域专题，只在出现独立新系统或全新能力域时新建文件；写作和制图遵循项目自身约定，不绑定特定工具。' ]
  ],
  skTitle: '一个入口，五个流程技能，四种方法。',
  skSub: '入口技能说明何时走 Rivo 与交付顺序；流程技能按交付顺序把控上游门禁；四个方法技能完全解耦，拿去任意项目都能单独用，做完就结束。',
  skEntry: '入口 · 什么时候走 Rivo、交付顺序与宿主调用',
  skMethods: '方法',
  skMethodsSub: '按名称加载，不依赖 Rivo 流程也能独立使用',
  stageSkills: [
    [ 'converging', '讨论', '先问方向、查清代码与组件映射，按决策树讨论并记录决定', [ '决定记录', 'ADR' ] ],
    [ 'writing-plans', '方案', '写精炼的技术方案并组织审阅，批准后同会话拆出 task.md', [ '技术方案', '拆解任务', '方案审阅', '接收意见' ] ],
    [ 'implementing-plans', '实施', '按任务实施并复用样板，做独立双轴审阅、发布核对与验收', [ '双轴审阅', '接收意见' ] ],
    [ 'knowledge-management', '知识', '验收后对照最新代码合进系统域 Wiki，归档需求材料', [ '知识 Wiki' ] ]
  ],
  revising: [ '修订', '已确认的决定、方案或任务需局部调整时，从受影响的最上游逐层改到代码；若底层模型要推翻重做，另开独立重构需求。', '决定 → 技术方案 → 实施方案 → 代码' ],
  methodSkills: [
    [ 'investigating', '查清代码机制、协议约束或设计稿组件映射，维护调查笔记' ],
    [ 'dispatching-subagents', '安排只读调查、独立审阅，或在样板定型后批量委派独立模块' ],
    [ 'test-driven-development', '先写失败测试，用测试驱动行为实现' ],
    [ 'systematic-debugging', '复现异常，用证据检验原因假设并验证修复' ]
  ],
  stages: [
    {
      name: '讨论',
      ai: '先问你的方向，查清现状与组件映射，按决策树提问',
      you: '方向、范围与重要取舍',
      leaves: [ 'decisions.md', 'ADR', 'research/' ],
      file: 'issues/供应商档案优化/adr/001-历史数据读时兼容.md',
      doc: [
        [ 'h', '# 001：历史数据采用读时兼容' ],
        [ 'm', '状态：接受（用户，2026-10-08）' ],
        [ 'm', '影响模块：历史数据处理、报表接入' ],
        [ '', '' ],
        [ 'k', '背景与约束' ],
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
      ai: '写精炼的技术方案并审阅；你批准后，同会话拆出 task.md',
      you: '确认方案与任务拆分',
      leaves: [ 'plan.md', 'task.md' ],
      file: 'issues/供应商档案优化/plan.md & task.md',
      doc: [
        [ 'h', '## 整体设计（plan.md）' ],
        [ '', '字段与表单共用 schema；参照样板：FormKit 与 SupplierFieldService。' ],
        [ '', '历史数据走读时兼容（ADR-001）；按钮显隐细则留待原 PRD 对照。' ],
        [ 'q', '方案审阅：一次全量检查 → 无 P0，已采纳 1 条契约补充' ],
        [ 'r', '✓ 你已批准 plan.md（定稿 v1.0）' ],
        [ '', '' ],
        [ 'h', '## 同会话紧接着拆出的 task.md' ],
        [ '', 'T1 字段配置 schema（无依赖） → T2 档案页展示 → T3 历史兼容' ],
        [ '', 'T4 报表接入（依赖 T3） → T5 表单物料（复用 FormKit）' ]
      ]
    },
    {
      name: '实施',
      ai: '按任务分次接力、先复用样板、双轴独立审阅与发布核对',
      you: '逐项校准与整体验收',
      leaves: [ '代码与测试', 'task.md', 'reviews/' ],
      file: 'issues/供应商档案优化/task.md',
      doc: [
        [ 'h', '### T2：档案页展示  [进行中]' ],
        [ '', '参照样板：pages/supplier/BaseProfile.tsx · 复用 FormKit' ],
        [ 'm', '实测踩坑：旧接口数组字段缺省返回 null，已在适配器兜底' ],
        [ 'q', '双轴审阅：代码质量通过 · 方案符合度通过（已核 typecheck 与构建）' ],
        [ '', '' ],
        [ 'h', '### T3：历史数据处理  [阻塞]' ],
        [ 'r', '发现历史附件表无租户索引，原假设计算方式超时，已带证据交你决定' ],
        [ 'm', '证据 → evidence/t3-legacy-scan.md' ]
      ]
    },
    {
      name: '知识',
      ai: '验收后对照最新代码合进按系统域组织的 Wiki，归档需求目录',
      you: '无需决定',
      leaves: [ 'knowledge/', 'archived/' ],
      file: 'knowledge/supplier-archive.md',
      doc: [
        [ 'h', '# 供应商档案域' ],
        [ 'm', '适用范围：supplier-service · supplier-web · vms-report' ],
        [ 'k', '核心机制与数据落点' ],
        [ '', '字段由 schema 驱动，档案页与表单共用；FormKit 统一承载录入控件。' ],
        [ 'k', '约束与设计理由' ],
        [ '', '旧格式读时兼容，适配器处理数组 null 兜底；下个版本周期清理。' ],
        [ 'k', '演进来源' ],
        [ 'm', '#供应商档案优化（2026-10-16）：archived/供应商档案优化 · ADR-001' ],
        [ 'r', '→ 需求已合并进系统域 Wiki 并归档' ]
      ]
    }
  ],
  stTitle: '带着目标和你自己的想法开始。',
  stInstall: '安装',
  stTry: '这样开口',
  stEnv: '模型分工遵循你的偏好和项目约定；默认按任务分次由主会话实施，独立审阅与批量重构再交给子代理。画图工具、写作风格和构建命令写在目标项目的 AGENTS.md 或 CLAUDE.md 里，Rivo 不做绑定。',
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
  agy: [
    '在终端运行安装命令，Antigravity 会读取根目录 plugin.json 并加载全套技能。',
    '开启新会话，直接调用技能或说“用 Rivo”并描述需求即可。'
  ],
  gemini: [
    '在终端安装 Gemini CLI 扩展（自动加载 skills/，不启用不兼容的 Hook）。',
    '开启新会话，按技能名称触发或说“用 Rivo”并描述需求即可。'
  ],
  tagDelivery: '完整交付',
  tagMethod: '方法技能',
  prompts: [
    '用 Rivo 完成供应商档案优化。本期包括字段配置、档案页展示、表单物料、历史数据处理和报表接入。我倾向字段与表单共用一套 schema，先核对我的拆解、现状与组件映射，再讨论需要决定的问题。',
    '用 investigating 查清数组字段的读取方式，以及新表单和现有组件库的映射关系。',
    '用 dispatching-subagents 分别请两个子代理独立调查上游鉴权与前端上传限制。',
    '用 systematic-debugging 定位这个测试失败的原因。'
  ],
  copy: '复制',
  copied: '已复制',
  footLine: '下一次修改时，理由还在，系统脉络也还在。',
  footCta: '在 GitHub 上获取 Rivo',
  skip: '跳到正文',
  meta: {
    htmlLang: 'zh-CN',
    title: 'Rivo — 设计由你主导',
    description: '面向 Claude Code、Codex、Antigravity 与 Gemini CLI 的软件交付技能。你主导方向与取舍，AI 查现状与组件映射、分次实施、从代码质量与方案符合度独立审阅，并维护按系统域组织的 Wiki。'
  }
}

const en: typeof zh = {
  navWhy: 'Why',
  navHow: 'How it works',
  navPrin: 'Principles',
  navSkills: 'Skills',
  navStart: 'Get started',
  kicker: 'Software delivery skills for Claude Code, Codex, Antigravity & Gemini CLI',
  h1a: '',
  h1b: 'You',
  h1c: ' lead the design.',
  h1d: 'AI investigates and builds,',
  h1e: 'and writes down why.',
  heroSub: 'Keep AI from dumping thousands of tangled lines in one shot. You set the direction and key trade-offs; AI checks code and UI component mapping, splits a lean plan into tasks, builds incrementally by reusing exemplars, and folds verified facts into a domain Wiki.',
  ctaStart: 'Get started',
  ctaGh: 'View on GitHub',
  you: 'you',
  heroDemo: {
    title: 'Full delivery · Supplier profile',
    tabsLabel: 'Switch delivery stage',
    replay: '↻ Auto-play',
    stages: [
      {
        tab: 'Discuss',
        skill: 'converging',
        prompt: 'Use Rivo on supplier profiles: fields, page, form assets, legacy data & reporting. Let’s share one schema — check breakdown, code & UI mapping.',
        lines: [
          [ 'direction', 'single-schema confirmed; 5 modules match, reporting depends on legacy data' ],
          [ 'current', '3 reads of old fields on the profile page' ],
          [ 'UI mapping', 'base inputs map to FormKit; custom multi-select needed' ]
        ],
        cardMode: 'choice' as 'choice' | 'pair',
        cardHead: 'YOUR CALL',
        cardStep: '1 / 2',
        cardTitle: 'How should legacy data be handled?',
        opt1: [ 'A', 'One-off migration', 'Done in a downtime window; simpler code' ] as [string, string, string],
        opt2: [ 'B', 'Read-time compat', 'No downtime; old format kept one cycle' ] as [string, string, string],
        stamp: 'DECIDED',
        stampDate: '2026·10·08',
        wrote: 'Written to decisions.md & adr/001-read-time-compat.md'
      },
      {
        tab: 'Plan',
        skill: 'writing-plans',
        prompt: 'Decisions are set. Draft a lean plan, run one full review, and once I approve it, split task.md right in this session.',
        lines: [
          [ 'in plan.md', 'architecture boundaries, FormKit exemplar & read-compat contract' ],
          [ 'kept out', 'button visibility & validation rules stay in the original PRD' ],
          [ 'plan review', 'single full check -> no P0, 1 contract clarification adopted' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: 'APPROVED · SPLIT IN SAME SESSION',
        cardStep: '5 tasks',
        cardTitle: 'plan.md v1.0 → split task.md immediately',
        opt1: [ 'T1–2', 'Core chain', 'Field schema config -> profile page reusing FormKit' ] as [string, string, string],
        opt2: [ 'T3–5', 'Compat & rollout', 'Read-time compat -> reporting · form assets' ] as [string, string, string],
        stamp: 'APPROVED',
        stampDate: 'PLAN v1.0',
        wrote: 'Written to plan.md (v1.0) & task.md'
      },
      {
        tab: 'Build',
        skill: 'implementing-plans',
        prompt: 'Plan and task.md are approved. Start T2 profile page, reuse FormKit, run real checks, and send it for independent review.',
        lines: [
          [ 'reuse & checks', 'followed BaseProfile & FormKit; guarded null legacy arrays' ],
          [ 'two-axis review', 'code quality: no P0 · requirement & plan fit: no P0' ],
          [ 'release check', 'typecheck, build & cross-repo dependency check passed' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: 'ALL TASKS DONE · READY TO ACCEPT',
        cardStep: '5 / 5',
        cardTitle: 'Deliver changes & two-axis review report',
        opt1: [ 'Quality', 'Is it written cleanly?', 'Reused repo components & exemplars, no extra wrappers' ] as [string, string, string],
        opt2: [ 'Fit', 'Does it match the goal?', 'Aligned with PRD, ADR-001 & plan.md' ] as [string, string, string],
        stamp: 'ACCEPTED',
        stampDate: 'ALL PASS',
        wrote: 'Committed changes; build notes & review verdicts saved in task.md & reviews/'
      },
      {
        tab: 'Wiki',
        skill: 'knowledge-management',
        prompt: 'Acceptance is done. Verify against the latest code, merge updates into the domain Wiki, and archive this issue.',
        lines: [
          [ 'verified code', 'confirmed schema-driven fields, FormKit & null-array adapter' ],
          [ 'domain Wiki', 'merged into supplier-archive.md instead of a closure report' ],
          [ 'archived', 'moved issue folder to .rivo/archived/supplier-profile/' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: 'DOMAIN WIKI UPDATED',
        cardStep: 'Wiki',
        cardTitle: 'knowledge/supplier-archive.md',
        opt1: [ 'Docs', 'Mechanisms & limits', 'Data flow, component reuse & compat lifecycle' ] as [string, string, string],
        opt2: [ 'Links', 'Evolution history', 'Points to archive folder, ADR-001 & checks' ] as [string, string, string],
        stamp: 'ARCHIVED',
        stampDate: 'WIKI SYNC',
        wrote: 'Next session opens README.md and lands straight on live context'
      }
    ]
  },
  whyT1: 'The code runs.',
  whyT2: 'The team can’t steer it.',
  whyLa: 'The problem',
  whyLb: 'What Rivo does',
  whyP1: 'Asking AI to build a whole feature in one shot often leaves thousands of tightly coupled lines, while UI work skips existing project components in favor of ad-hoc controls. Hand the design to AI and people lose grip on the system, forcing the next change to rediscover basic constraints from scratch.',
  whyP2: 'Rivo keeps humans in control. AI asks for your direction first, checks the codebase and component mapping, and uses a decision tree so you decide real trade-offs. Once you approve the lean plan, AI breaks down tasks in the same session, builds incrementally from working exemplars, runs independent reviews on code quality and plan fit, and updates a domain-organized Wiki after acceptance.',
  howTitle: 'Four stages. Every trade-off is your call, at a steady pace.',
  howSub: 'Discussion, plan, implementation & acceptance, knowledge. Local mismatches trigger a layered fix via revising; if core assumptions collapse late in the build, wrap up cleanly and open a dedicated refactor issue rather than piling parallel plans together.',
  colAi: 'AI does',
  colYou: 'You decide',
  colLeave: 'Leaves behind',
  colSkill: 'Skill',
  seqLabel: 'Implementation',
  seqTitle: 'Incremental build and two-axis review',
  seqSub: 'Tasks are implemented in steady steps with a checklist upfront and exemplar reuse first. Each completed round goes through independent review along two axes — code quality and requirement fit — and all tasks end with an overall review and release check.',
  lanes: [ 'You', 'Main session', 'Implementation', 'Two-axis review' ],
  seqGroups: [
    'Repeat by task · build incrementally, then run two-axis review',
    'If verified P0 issues exist · applies per task and at sign-off',
    'If confirmed work must change · at any point during build',
    'After all tasks · overall review, release check & acceptance'
  ],
  seq: [
    'Approve plan.md and split task.md in the same session',
    'Build the task following exemplars and UI component constraints',
    'Submit changes, real check outputs and task.md notes',
    'Run independent code quality & plan-fit review',
    'Report both axes separately with severity and evidence',
    'Fix verified P0 issues',
    'Submit fixes and real verification commands',
    'Ask the same reviewer to re-check',
    'No P0 on either axis — passed',
    'Present evidence (local mismatch or model breakdown)',
    'Decide on revision, or wrap up for a new refactor issue',
    'Revise layer by layer and redo affected tasks',
    'Run overall two-axis review alongside release checklist',
    'No P0 on either axis — passed',
    'Deliver code, review verdicts & release check for acceptance'
  ],
  planLabel: 'Artifacts',
  planTitle: 'A lean technical plan you can read in ten minutes.',
  planSub: 'Keep architecture boundaries, reference exemplars, contracts, key assumptions and rollout order in plan.md. Leave UI button copy and validation details in the original PRD, and split task.md in the same session right after approval.',
  tocCap: 'Technical plan · reading line',
  chapters: [
    [ 'Background & scope', 'Why, what is in scope, and what is explicitly out' ],
    [ 'Overview', 'Modules in scope, deliverables, and affected systems' ],
    [ 'Overall design', 'How parts fit together, reference exemplars & component reuse' ],
    [ 'Key design & contracts', 'Data models, state transitions, boundaries and interfaces' ],
    [ 'Assumptions & risks', 'Core assumptions (and impact if wrong) plus rollout risks' ],
    [ 'Release plan', 'Deploy order, config steps, verification and rollback' ]
  ],
  treeCap: 'File layout',
  treeNote: 'Locations set by you or the project take precedence; keep only these entries in the issue root.',
  tree: [
    '',
    'scope, decisions, open items',
    'key trade-offs and reasons',
    'topic-based investigation notes',
    'lean technical plan',
    'plan attachments & large tables',
    'task breakdown & build notes',
    'verification evidence & debug logs',
    'two-axis review reports',
    'domain-organized project Wiki',
    'accepted & archived'
  ],
  issue: '<issue>',
  prinTitle: 'Five principles — clear boundaries without extra ceremony.',
  prinMore: 'The reasoning behind each lives in CONTRIBUTING.md',
  principles: [
    [ 'Humans lead design; AI maps decisions', 'Ask if the user already has a direction before proposing one. AI verifies codebase and config facts itself and surfaces real trade-offs as a decision tree.' ],
    [ 'Plan and task breakdown in one session; incremental handoffs', 'Split task.md right when plan.md is approved so no context is lost. Then work through tasks across sessions using task.md build notes and committed exemplars.' ],
    [ 'Lean plans, reuse-first code', 'Keep plan.md short enough to read in ten minutes without copying PRD UI rules. Check backend/frontend exemplars and component libraries before writing new code.' ],
    [ 'Independent quality and plan-fit review', 'Start every task with a todo checklist so review isn’t skipped. Independent reviewers judge code quality (is it well written?) and requirement fit (is it right?) separately.' ],
    [ 'A domain-based project Wiki', 'After acceptance, fold verified behaviour into existing domain pages instead of creating per-issue closure reports. Writing and diagram tools follow the repo’s own conventions.' ]
  ],
  skTitle: 'One entry, five flow skills, four methods.',
  skSub: 'The entry skill explains when Rivo applies and the delivery order; flow skills enforce upstream gates in sequence; the four method skills are completely standalone and work in any repo.',
  skEntry: 'Entry · when to use Rivo, delivery order, host usage',
  skMethods: 'Methods',
  skMethodsSub: 'Standalone skills — load by name without starting a Rivo delivery flow',
  stageSkills: [
    [ 'converging', 'Discuss', 'Ask for user direction, check code & UI mapping, discuss via decision tree', [ 'Decisions', 'ADR' ] ],
    [ 'writing-plans', 'Plan', 'Write and review a lean plan; split task.md in the same session on approval', [ 'Plan', 'Task breakdown', 'Plan review', 'Receiving' ] ],
    [ 'implementing-plans', 'Build', 'Execute by task with exemplar reuse, two-axis review, release check & acceptance', [ 'Two-axis review', 'Receiving' ] ],
    [ 'knowledge-management', 'Knowledge', 'Merge verified behaviour into the domain Wiki after acceptance and archive', [ 'Knowledge Wiki' ] ]
  ],
  revising: [ 'Revise', 'When confirmed decisions, plans or tasks need local changes, update from the highest affected layer down to code; if core models break, open a dedicated refactor issue.', 'decisions → plan → task → code' ],
  methodSkills: [
    [ 'investigating', 'Investigate code mechanisms, protocols or UI component mappings and keep topic notes' ],
    [ 'dispatching-subagents', 'Run independent investigations, code reviews, or parallel batch edits once exemplars are set' ],
    [ 'test-driven-development', 'Drive behaviour with failing tests' ],
    [ 'systematic-debugging', 'Reproduce failures, test root-cause hypotheses and verify fixes' ]
  ],
  stages: [
    {
      name: 'Discuss',
      ai: 'Asks your direction, checks code & UI mapping, raises trade-offs',
      you: 'Direction, scope & key trade-offs',
      leaves: [ 'decisions.md', 'ADR', 'research/' ],
      file: 'issues/supplier-profile/adr/001-read-time-compat.md',
      doc: [
        [ 'h', '# 001: Legacy data uses read-time compat' ],
        [ 'm', 'Status: accepted (user, 2026-10-08)' ],
        [ 'm', 'Modules: legacy data, reporting' ],
        [ '', '' ],
        [ 'k', 'Context & constraints' ],
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
      ai: 'Writes & reviews a lean plan; splits task.md in the same session on approval',
      you: 'Approve plan & task split',
      leaves: [ 'plan.md', 'task.md' ],
      file: 'issues/supplier-profile/plan.md & task.md',
      doc: [
        [ 'h', '## Overall design (plan.md)' ],
        [ '', 'Fields and form share one schema; exemplars: FormKit & SupplierFieldService.' ],
        [ '', 'Legacy data uses read-time compat (ADR-001); UI button copy stays in PRD.' ],
        [ 'q', 'Plan review: single pass → no P0, 1 contract clarification adopted' ],
        [ 'r', '✓ Plan approved by you (v1.0)' ],
        [ '', '' ],
        [ 'h', '## task.md split right in the same session' ],
        [ '', 'T1 field schema (no deps) → T2 profile page → T3 legacy compat' ],
        [ '', 'T4 reporting (after T3) → T5 form assets (reusing FormKit)' ]
      ]
    },
    {
      name: 'Build',
      ai: 'Builds incrementally, reuses exemplars, runs two-axis review & release check',
      you: 'Review rounds & accept delivery',
      leaves: [ 'code & tests', 'task.md', 'reviews/' ],
      file: 'issues/supplier-profile/task.md',
      doc: [
        [ 'h', '### T2: Profile page  [in progress]' ],
        [ '', 'Exemplar: pages/supplier/BaseProfile.tsx · reuse FormKit' ],
        [ 'm', 'Pitfall noted: legacy array field returns null when empty; guarded in adapter' ],
        [ 'q', 'Review: Code quality passed · Plan fit passed (verified typecheck & build)' ],
        [ '', '' ],
        [ 'h', '### T3: Legacy data  [blocked]' ],
        [ 'r', 'Attachment table lacks tenant index; plan assumption timed out — evidence sent' ],
        [ 'm', 'evidence → evidence/t3-legacy-scan.md' ]
      ]
    },
    {
      name: 'Knowledge',
      ai: 'Merges verified mechanisms into the domain Wiki after acceptance; archives',
      you: 'Nothing to decide',
      leaves: [ 'knowledge/', 'archived/' ],
      file: 'knowledge/supplier-archive.md',
      doc: [
        [ 'h', '# Supplier archive domain' ],
        [ 'm', 'Scope: supplier-service · supplier-web · vms-report' ],
        [ 'k', 'Core mechanisms & data flow' ],
        [ '', 'Fields are schema-driven and shared by page & form; FormKit backs inputs.' ],
        [ 'k', 'Constraints & design reasons' ],
        [ '', 'Old format read-compatible with null-array adapter guard; drop next cycle.' ],
        [ 'k', 'History' ],
        [ 'm', '#supplier-profile (2026-10-16): archived/supplier-profile · ADR-001' ],
        [ 'r', '→ Merged into domain Wiki and issue archived' ]
      ]
    }
  ],
  stTitle: 'Start with a goal — and your own direction.',
  stInstall: 'Install',
  stTry: 'Say it like this',
  stEnv: 'Model choices follow your preferences and repo conventions. By default the main session builds incrementally while independent subagents handle investigation, review, or post-exemplar batch edits. Put diagram tools, writing style, and build commands in your repo’s AGENTS.md or CLAUDE.md.',
  stNote: 'Ordinary requests are handled ordinarily. Having a .rivo/ directory doesn’t force every prompt into the delivery flow.',
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
  agy: [
    'Install from your terminal; Antigravity reads plugin.json at the repo root and loads all skills.',
    'Start a new session, call a skill or say “Use Rivo”, and describe your task.'
  ],
  gemini: [
    'Install the Gemini CLI extension (loads skills/ directly without incompatible hooks).',
    'Start a new session, invoke skills by name or say “Use Rivo”, and describe your task.'
  ],
  tagDelivery: 'full delivery',
  tagMethod: 'method skill',
  prompts: [
    'Use Rivo to improve supplier profiles: field config, profile page, form assets, legacy data and reporting. I want fields and forms to share one schema — check my breakdown, current code and UI mapping, then raise what needs deciding.',
    'Use investigating to find how array fields are read and map the new form to existing UI components.',
    'Use dispatching-subagents to have two subagents independently investigate upstream auth and upload limits.',
    'Use systematic-debugging to find why this test fails.'
  ],
  copy: 'copy',
  copied: 'copied',
  footLine: 'At the next change, the reasons and system map are still there.',
  footCta: 'Get Rivo on GitHub',
  skip: 'Skip to content',
  meta: {
    htmlLang: 'en',
    title: 'Rivo — Design stays with you',
    description: 'Software delivery skills for Claude Code, Codex, Antigravity & Gemini CLI. You set direction and trade-offs; AI checks code and UI mapping, builds incrementally, reviews code quality and plan fit, and maintains a domain Wiki.'
  }
}

export const site: Record<Locale, typeof zh> = { zh, en }
