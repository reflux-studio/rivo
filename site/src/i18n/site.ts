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
  heroSub: 'AI 让写代码变便宜了，却没让接住一个代码库变容易。Rivo 把设计和取舍留给你，AI 负责查清现状、写方案、自测交付，并把系统脉络沉淀回仓库。',
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
        prompt: '用 Rivo 完成供应商档案优化。我倾向字段与表单共用一套 schema，含字段配置、档案页、表单物料、历史数据和报表接入。先查清现状，确认取舍和不能改坏的老功能。',
        lines: [
          [ '方向与拆解', '沿用单 schema；5 个模块一致，老报表导出必须保持兼容' ],
          [ '代码现状', '档案页有 3 处直接读取旧字段结构，空数组缺省返回 null' ],
          [ '组件与回归范围', '基础控件复用 FormKit；异常处理与回归范围写入 decisions.md' ]
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
        prompt: '方向已定。写出技术方案和测试方案并各自独立审阅；我评审批准后，同会话拆出任务清单 task.md。',
        lines: [
          [ '技术方案（plan.md）', '架构边界、FormKit 样板与读时兼容契约（独立审阅通过）' ],
          [ '测试方案（test-plan.md）', '按模块编排 18 条分层用例与旧导出回归范围（兼容测试平台）' ],
          [ '下游 task.md', 'T1–2 基建连续自动推进 · T3 档案页设人工验收并引用 TC-xx' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: '两份方案批准 · 同会话拆出 task.md',
        cardStep: '5 项任务',
        cardTitle: 'plan.md + test-plan.md 定稿 v1.0 → task.md',
        opt1: [ 'plan.md', '怎么改', '单 schema 架构、FormKit 样板与兼容契约' ] as [string, string, string],
        opt2: [ 'test-plan.md', '怎么测与影响面', '18 条等价类/边界/状态用例与老功能回归范围' ] as [string, string, string],
        stamp: '已定稿',
        stampDate: 'DUAL v1.0',
        wrote: '已写入 plan.md、test-plan.md 与任务清单 task.md'
      },
      {
        tab: '实施',
        skill: 'implementing-plans',
        prompt: '两份方案和 task.md 都已批准。按任务逐项推进：先跑通编译、单测和集成验证再交独立审阅，关键页面请我验收，最后跑回归出报告。',
        lines: [
          [ '自动验证在前', '由 TC-01..08 驱动实现，审阅前先跑通静态检查、单测与集成测试' ],
          [ '审阅与人工验收', '独立审阅通过并拒绝多余抽象；T3 档案页完成人工验收' ],
          [ '整体回归', '全量自动测试通过 + 跨任务冒烟与旧导出回归全绿' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: '全部任务完成 · 待你最终验收',
        cardStep: '5 / 5',
        cardTitle: '交付代码、实测凭证与 test-report.md',
        opt1: [ '质量把关', '真实改动与覆盖', '复用 FormKit 样板，引用用例真实落地，无全 mock 冒充' ] as [string, string, string],
        opt2: [ '验证报告', 'evidence/test-report.md', '分层实测汇总、回归结果与如实标注的未覆盖范围' ] as [string, string, string],
        stamp: '已验收',
        stampDate: 'ALL PASS',
        wrote: '代码、task.md 踩坑记录与 evidence/test-report.md 就绪'
      },
      {
        tab: '知识',
        skill: 'knowledge-management',
        prompt: '整体验收已通过，对照最新代码与测试报告更新按系统域组织的知识库 Wiki，保留回归范围后再归档。',
        lines: [
          [ '核实最新真相', '对照最新代码与 test-report.md 确认机制与回归范围' ],
          [ '合并系统域 Wiki', '更新 supplier-archive.md 与测试环境踩坑，不建结项总结' ],
          [ '归档需求目录', '移入 .rivo/archived/供应商档案优化/' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: '知识库已按系统域更新',
        cardStep: 'Wiki',
        cardTitle: 'knowledge/supplier-archive.md',
        opt1: [ '机制与回归', '核心架构与回归点', 'schema 契约、组件复用与必保旧导出回归项' ] as [string, string, string],
        opt2: [ '环境与溯源', '演进来源与踩坑', '关联归档目录、ADR-001 与测试数据前提' ] as [string, string, string],
        stamp: '已归档',
        stampDate: 'WIKI SYNC',
        wrote: '下一次新会话开启，打开 Wiki 与 README 即接上系统上下文'
      }
    ]
  },
  whyT1: '代码能跑，',
  whyT2: '团队却接不住、也越改越怕。',
  whyLa: '问题',
  whyLb: 'Rivo 的做法',
  whyP1: '让 AI 一口气写完需求，往往换来上万行牵一发而动全身的代码，人不知道为什么这样设计，也不敢确认没把老功能改坏；自测常挑刚写的正常路径写几条宽松断言，而硬拆成“开发阶段 → 测试阶段”来回扯皮，又只会重走瀑布流老路、凭空增加返工。',
  whyP2: 'Rivo 把设计与拍板权留在人手里，把测试和验证放进编码过程本身：你先定方向、重要取舍和不能破坏的老功能；AI 在同一会话写清技术方案和测试方案再拆任务，先跑自动检查再做独立审阅，只在关键页面和流程节点请你人工验收；全部做完后交出真实验证报告，验收后把核实过的机制与回归范围留进项目 Wiki。',
  howTitle: '四个阶段，你只守住关键节点，其余交给仓库里的证据。',
  howSub: '需求依次经过讨论、方案、实施与验收、知识沉淀。局部假设或预期有变时，用 revising 从受影响的上游逐层修订；如果底层模型走不通，及时暂停或收尾，另开独立重构需求，不往原目录堆平行方案。',
  colAi: 'AI 做什么',
  colYou: '你决定什么',
  colLeave: '留下什么',
  colSkill: '技能',
  seqLabel: '协作',
  seqTitle: '人定方向与验收，AI 推进开发，独立审阅查漏盲区',
  seqSub: '不用盯着 AI 写每一行代码，也不把设计权外包出去。整次交付里，你只在方向拍板、方案评审、关键节点验收与最终验收介入；查证现状、自动验证与独立审阅在后台把关。',
  lanes: [ '你', '主会话', '开发与验证', '独立审阅' ],
  seqGroups: [
    '讨论与方案 · 查清现状，定好“怎么改”与“怎么测”',
    '任务实施 · 先自动验证，再独立审阅，关键处请人验收',
    '回归与沉淀 · 回归出报告，把系统脉络留进项目知识库'
  ],
  seq: [
    '给出需求目标、方向思路和不能破坏的老功能',
    '查清代码现状、组件对应与受影响老功能',
    '技术方案与测试方案各自独立审阅，查漏边界',
    '呈交关键取舍与两份方案；批准后拆出 task.md',
    '复用样板编码，先跑通编译、单测与轻量集成',
    '独立审阅代码质量与测试落地，拒绝多余抽象',
    '仅在关键交互节点请人验收（基建自动推进）',
    '跑通全量单测集成 + 影响面冒烟，出验证报告',
    '交付改动、验证报告与发布核对，请最终验收',
    '确认验收，对照最新代码合入系统域 Wiki 并归档'
  ],
  planLabel: '产物',
  planTitle: '每类信息只存一处，用完沉淀为活文档。',
  planSub: '技术方案 plan.md 写清楚怎么改，测试方案 test-plan.md 写清楚怎么测和影响哪些老功能，合并拆出 task.md；项目验收后，真正长期留在仓库里的是按系统域演进的 knowledge/ Wiki。',
  tocSwitchLabel: '切换查看核心文档结构',
  tocCap: '技术方案 · 阅读主线',
  chapters: [
    [ '需求背景与范围', '为什么做；本期做什么，明确不做什么' ],
    [ '需求总览', '有哪些模块，各自交付什么、涉及哪些系统' ],
    [ '整体设计', '完整做法与前后端参照样板、组件复用约定' ],
    [ '关键设计与契约', '数据模型、状态流转、职责边界与接口契约' ],
    [ '关键假设与风险', '最依赖的前提假设（失真后果）及协作风险' ],
    [ '发布计划', '部署与配置顺序、数据迁移、检查与回滚' ]
  ],
  testTocCap: '测试方案 · 模块与回归范围',
  testChapters: [
    [ '环境与数据前提', '账号权限、依赖 Mock 边界与预置存量数据' ],
    [ '测试分层与平台约定', '单元、集成与端到端边界，以及外部测试平台对接' ],
    [ '功能测试矩阵', '按业务模块以等价类、边界值与状态迁移编排用例' ],
    [ '老功能影响面与回归范围', '对照技术方案圈出公共改动会波及的老功能' ],
    [ '不测范围与已知限制', '明确划出本期不覆盖的场景与环境约束' ]
  ],
  wikiTocCap: '项目知识库 · 按系统域演进',
  wikiChapters: [
    [ '核心机制与数据落点', '系统现在怎样运转，入口、存储与各端配合' ],
    [ '约束与设计理由', '必须遵守的契约边界，以及关键取舍的原因' ],
    [ '变更与运维', '改动入口、发版步骤、核心回归范围与已知缺口' ],
    [ '演进来源', '关联已归档的需求目录与 ADR，按需回溯' ]
  ],
  treeCap: '文件位置',
  treeNote: '用户或项目指定的位置优先；需求根目录只放以上入口。',
  tree: [
    '',
    '范围、决定、验收标准与待决事项',
    '重要取舍及理由',
    '按主题维护的调查笔记',
    '精炼的技术方案',
    '方案附件与长字段表',
    '测试方案与分层用例（TC-xx）',
    '合并方案后的任务、引用用例与验收节点',
    '任务实测证据与最终验证报告 test-report.md',
    '技术方案、测试方案与代码独立审阅报告',
    '按系统域组织的知识库 Wiki',
    '验收后归档的需求'
  ],
  issue: '<需求>',
  prinTitle: '四条克制，管住失控也避开过场。',
  prinMore: '每条原则的来由见 CONTRIBUTING.md',
  principles: [
    [ '设计权留在人手里', '动手设计前先问你是否已有方向，代码和配置能查明的事实由 AI 自己查；影响架构、异常处理和老功能回归范围的关键取舍，按依赖交你拍板并留下 ADR。' ],
    [ '开发与测试合一，先快后慢验证', '不拆成割裂的开发和测试阶段，编码前同时对照需求和技术方案定下 TC-xx 与回归范围；开发时先过编译和单测，关键节点请人验收，最后交出独立的 test-report.md。' ],
    [ '独立审阅查盲区，不盲从多余改动', '技术方案、测试方案与代码改动都交给独立审阅者检查；同时明确识别并拒绝为未发生需求抽层的过度设计，以及对已保证前提重复判空的过度防御。' ],
    [ '只留活文档，不绑定任何工具', '方案十分钟读完、不搬运 PRD 细则；验收后把系统机制与回归范围合并进按系统域组织的 Wiki；画图、写作和外部测试平台（如果项目接入了）按项目 AGENTS.md 的约定来。' ]
  ],
  skTitle: '一套完整交付流程，八种可单独带走的工程方法。',
  skSub: '中大型需求走流程保住上下游一致与系统记忆；平时单查一段代码、写一份方案、设计测试用例或审一次 PR，八个方法技能零 .rivo/ 依赖，拿去任意仓库都能单用。',
  skEntry: '入口 · 何时走 Rivo、交付顺序与目录约定',
  skMethods: '方法（构建与测试）',
  skMethodsSub: '脱离 Rivo 也可独立使用 · 一个技能只做一件事',
  stageSkills: [
    [ 'converging', '讨论', '先问方向、查清现状与组件对应，按依赖逐轮讨论并记下决定与回归范围', [ '决定记录', 'ADR' ] ],
    [ 'writing-plans', '方案', '依次写出并独立审阅技术方案与测试方案，批准后同会话拆出 task.md', [ 'plan.md', 'test-plan.md', 'task.md' ] ],
    [ 'implementing-plans', '实施', '先自动验证再独立审阅、关键节点请人验收，最后整体回归并出验证报告', [ '分层验证', '验证报告', '发布核对' ] ],
    [ 'knowledge-management', '知识', '验收后对照最新代码与报告，把机制和回归范围合进系统域 Wiki 并归档', [ '知识 Wiki' ] ]
  ],
  revising: [ '修订', '已确认的决定、方案或任务需局部调整时，从受影响的最上游逐层改到代码；如果底层模型要推翻重做，另开独立重构需求。', '决定 → 技术 / 测试方案 → 任务清单 → 代码' ],
  methodSkills: [
    [ 'investigating', '基础 · 调研', '查清代码机制、协议约束或设计稿组件对应关系，按主题维护调查笔记' ],
    [ 'system-design', '设计 · 构建', '写出十分钟读完的技术方案，配套独立审阅与过度设计识别' ],
    [ 'test-driven-development', '实现 · 构建', '先跑失败测试再写实现，优先取自已有测试清单并守住适用边界' ],
    [ 'code-review', '把关 · 构建', '从代码质量与需求符合度两方面独立审阅，拒绝过度设计与多余防御' ],
    [ 'dispatching-subagents', '基础 · 委派', '安排独立调查、独立审阅，或在样板跑通契约稳定后批量委派任务' ],
    [ 'test-design', '设计 · 测试', '对照需求与技术方案做测试分析，产出按模块分层的用例并独立审阅' ],
    [ 'systematic-debugging', '排障 · 测试', '从证据复现并检验原因假设，定位根因后再修复并保留回归验证' ],
    [ 'verifying', '把关 · 测试', '从快到慢做分层验证和回归测试，写出验证报告' ]
  ] as [string, string, string][],
  stages: [
    {
      name: '讨论',
      ai: '先问你的方向，查清现状与组件对应，确认取舍与回归范围',
      you: '方向、范围、重要取舍与验收标准',
      leaves: [ 'decisions.md', 'ADR', 'research/' ],
      file: 'issues/供应商档案优化/adr/001-历史数据读时兼容.md',
      doc: [
        [ 'h', '# 001：历史数据采用读时兼容' ],
        [ 'm', '状态：接受（用户，2026-10-08）' ],
        [ 'm', '影响模块：历史数据处理、报表接入；不能破坏：旧格式导出不能报错' ],
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
      ai: '同会话写出并独立审阅技术方案与测试方案；评审批准后，合并拆出 task.md',
      you: '评审并批准两份方案',
      leaves: [ 'plan.md', 'test-plan.md', 'task.md' ],
      file: 'issues/供应商档案优化/plan.md · test-plan.md · task.md',
      doc: [
        [ 'h', '## 1. 技术方案（plan.md）' ],
        [ '', '字段与表单共用 schema；样板 FormKit；历史走读时兼容（独立审阅通过）' ],
        [ 'h', '## 2. 测试方案（test-plan.md）' ],
        [ '', '按模块编排 18 条分层用例 + 旧导出回归范围（独立审阅通过）' ],
        [ '', '' ],
        [ 'r', '✓ 两份方案批准定稿 → 同会话拆出任务清单 task.md' ],
        [ '', 'T1–T2 基建连续自动推进 · T3 档案页设人工验收并引用 TC-01..06' ]
      ]
    },
    {
      name: '实施',
      ai: '先跑自动验证 → 独立审阅 → 关键节点请人验收；最后跑回归并出验证报告',
      you: '关键节点验收与最终验收',
      leaves: [ '代码与测试', 'reviews/', 'evidence/test-report.md' ],
      file: 'issues/供应商档案优化/task.md → evidence/test-report.md',
      doc: [
        [ 'h', '### 任务实施 · T1–T2 自动通过 · T3 人工验收' ],
        [ '', '用 TC-01..06 驱动实现，先过单测与构建 → 独立审阅通过 → T3 完成人工验收。' ],
        [ 'h', '### 最终验证 · evidence/test-report.md  [通过]' ],
        [ 'm', '全量自动测试：静态检查 + 单测集成全绿 · 端到端回归：主干冒烟与旧导出 4/4 通过' ],
        [ 'q', '代码与覆盖复核：复用 FormKit 无多余抽象；引用用例全部真实落地' ],
        [ 'm', '未覆盖风险：百万级历史附件导出在测试库抽样 2000 条（见 evidence/t3/）' ]
      ]
    },
    {
      name: '知识',
      ai: '验收后对照最新代码与验证报告，把机制与回归范围合进系统域 Wiki 并归档',
      you: '无需决定',
      leaves: [ 'knowledge/', 'archived/' ],
      file: 'knowledge/supplier-archive.md',
      doc: [
        [ 'h', '# 供应商档案域' ],
        [ 'm', '适用范围：supplier-service · supplier-web · vms-report' ],
        [ 'k', '核心机制与数据落点' ],
        [ '', '字段由 schema 驱动，档案页与表单共用；FormKit 统一承载录入控件。' ],
        [ 'k', '变更与运维（含回归范围）' ],
        [ '', '改字段 schema 必跑旧格式导出与 null-array 适配器回归测试（TC-02）。' ],
        [ 'k', '演进来源' ],
        [ 'm', '#供应商档案优化（2026-10-16）：archived/供应商档案优化 · ADR-001' ],
        [ 'r', '→ 需求已合并进系统域 Wiki 并归档' ]
      ]
    }
  ],
  stTitle: '带着目标和你自己的想法开始。',
  stInstall: '安装',
  stTry: '这样开口',
  stEnv: '模型分工遵循你的偏好和项目约定；默认按任务分次由主会话实施，独立审阅与批量重构再交给子代理。画图工具、写作风格、构建测试命令，以及外部测试平台（如果项目接入了）的同步规则，写在目标项目的 AGENTS.md 或 CLAUDE.md 里，Rivo 不做绑定。',
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
  tagMethod: '方法技能（脱离 Rivo 可单用）',
  prompts: [
    '用 Rivo 完成供应商档案优化。本期包括字段配置、档案页展示、表单物料、历史数据处理和报表接入。我倾向字段与表单共用一套 schema，先核对我的拆解、现状与组件对应关系，再讨论需要决定的问题和不能改坏的老功能。',
    '用 test-design 对照这份 PRD 和接口方案写出分层测试方案，按模块编号方便导出测试平台。',
    '用 code-review 独立审阅这次分支改动，核实代码质量、需求落地和测试覆盖是否真实，不接受过度设计。',
    '用 verifying 先跑编译、单测和集成测试，再按改动影响面做回归测试，写出验证报告。'
  ],
  copy: '复制',
  copied: '已复制',
  footLine: '下一次修改时，理由、设计脉络和回归范围都还在。',
  footCta: '在 GitHub 上获取 Rivo',
  skip: '跳到正文',
  meta: {
    htmlLang: 'zh-CN',
    title: 'Rivo — 设计由你主导',
    description: '面向 Claude Code、Codex、Antigravity 与 Gemini CLI 的软件交付技能。你主导方向与取舍，AI 查清现状、写清技术方案与测试方案、先自动验证再独立审阅，交付验证报告并把系统机制与回归范围留进项目 Wiki。'
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
  heroSub: 'AI made writing code cheap, not owning a codebase. Rivo keeps design calls with you while AI investigates, drafts peer plans, verifies before review, delivers a test report, and leaves live project memory in the repo.',
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
        prompt: 'Use Rivo on supplier profiles: share one schema across fields, profile page, form assets, legacy data & reporting. Check the code first, then align trade-offs and regression scope.',
        lines: [
          [ 'direction', 'single-schema confirmed; 5 modules match and legacy exports stay intact' ],
          [ 'current', '3 direct reads of legacy fields returning null on empty arrays' ],
          [ 'UI & scope', 'base inputs reuse FormKit; fallbacks & regression scope saved in decisions.md' ]
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
        prompt: 'Direction is set. Draft and independently review both the technical plan and gray-box test plan; once approved, split downstream task.md in this session.',
        lines: [
          [ 'technical (plan.md)', 'boundaries, FormKit exemplar & read-compat contract — review passed' ],
          [ 'test (test-plan.md)', '18 layered cases by module + legacy export regression — platform-ready' ],
          [ 'joint task.md', 'T1–2 infra run headless · T3 sets human walkthrough with TC refs' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: 'DUAL PLANS APPROVED · SPLIT TASK.MD',
        cardStep: '5 tasks',
        cardTitle: 'plan.md + test-plan.md v1.0 → task.md',
        opt1: [ 'plan.md', 'How to build', 'Single schema architecture, FormKit exemplar & compat contract' ] as [string, string, string],
        opt2: [ 'test-plan.md', 'How to verify', '18 equivalence/boundary/state cases & legacy regression scope' ] as [string, string, string],
        stamp: 'APPROVED',
        stampDate: 'DUAL v1.0',
        wrote: 'Written to plan.md, test-plan.md & joint downstream task.md'
      },
      {
        tab: 'Build',
        skill: 'implementing-plans',
        prompt: 'Both plans and task.md are approved. Build step by step: pass compile, unit & integration checks before review, pause for walkthroughs where marked, then close cleanly.',
        lines: [
          [ 'auto checks first', 'driven by TC-01..08; lint, UT & light IT green before code review' ],
          [ 'review & UAT', 'independent check passed (bloat rejected); T3 signed off in human UAT' ],
          [ 'targeted regression', 'full auto suites green + cross-task smoke & export regression clean' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: 'ALL TASKS DONE · READY TO ACCEPT',
        cardStep: '5 / 5',
        cardTitle: 'Deliver code, evidence & test-report.md',
        opt1: [ 'Quality Gate', 'Code & real coverage', 'Reused FormKit exemplars; mounted TCs tested without fake mocks' ] as [string, string, string],
        opt2: [ 'Test Report', 'evidence/test-report.md', 'Layered pass summary, regression results & honest coverage gaps' ] as [string, string, string],
        stamp: 'ACCEPTED',
        stampDate: 'ALL PASS',
        wrote: 'Changes, task.md notes & evidence/test-report.md ready for acceptance'
      },
      {
        tab: 'Wiki',
        skill: 'knowledge-management',
        prompt: 'Acceptance is done. Verify against latest code and test-report.md, merge live mechanisms and regression scope into the domain Wiki, and archive.',
        lines: [
          [ 'verified truth', 'checked latest code & test-report.md for live contracts' ],
          [ 'domain Wiki', 'merged into supplier-archive.md with regression & test-data notes' ],
          [ 'archived', 'moved issue folder to .rivo/archived/supplier-profile/' ]
        ],
        cardMode: 'pair' as 'choice' | 'pair',
        cardHead: 'DOMAIN WIKI UPDATED',
        cardStep: 'Wiki',
        cardTitle: 'knowledge/supplier-archive.md',
        opt1: [ 'Mechanisms', 'Contracts & regression', 'Schema flow, FormKit reuse & mandatory legacy export checks' ] as [string, string, string],
        opt2: [ 'History', 'Pitfalls & provenance', 'Points to archive folder, ADR-001 & test-data setup' ] as [string, string, string],
        stamp: 'ARCHIVED',
        stampDate: 'WIKI SYNC',
        wrote: 'Next session opens README.md with live system rules & regression scope'
      }
    ]
  },
  whyT1: 'The code runs.',
  whyT2: 'The team can’t own it — or trust the next change.',
  whyLa: 'The problem',
  whyLb: 'What Rivo does',
  whyP1: 'One-shot AI coding leaves sprawling lines nobody understands, alongside self-written Happy Path tests that share the code’s blind spots and miss what breaks elsewhere. Splitting AI into fake “Dev vs QA” personas just revives waterfall handoffs and wasted tokens.',
  whyP2: 'Rivo keeps design authority with humans and builds verification directly into engineering. You set direction, trade-offs, and regression scope; AI drafts a technical plan and a test plan in the same session, runs fast automated checks before isolated reviews, pauses for walkthroughs only where interactive judgment matters, and folds live facts back into a domain Wiki.',
  howTitle: 'Four stages. You steer the key gates; evidence in the repo carries the rest.',
  howSub: 'Discussion, dual plans & task split, build & acceptance, and knowledge consolidation. Local mismatches trigger a layered fix via revising; if core models fail late, wrap up and open a dedicated refactor issue.',
  colAi: 'AI does',
  colYou: 'You decide',
  colLeave: 'Leaves behind',
  colSkill: 'Skill',
  seqLabel: 'Collaboration',
  seqTitle: 'You steer and accept. AI builds and verifies. Fresh eyes catch blind spots.',
  seqSub: 'You never micromanage code or surrender architecture. You step in at trade-offs, dual-plan approval, marked walkthroughs, and final acceptance while investigation, testing, and isolated critique close loops in the background.',
  lanes: [ 'You', 'Main session', 'Build & verify', 'Fresh eyes' ],
  seqGroups: [
    'Discuss & plan · inspect the repo, lock how to build and how to verify',
    'Execute · fast automated checks before fresh-eyes review; pause only at marked gates',
    'Close & retain · run layered regression into test-report.md and update Wiki'
  ],
  seq: [
    'Share goals, initial direction, and key constraints',
    'Inspect current code, UI mapping, and affected flows',
    'Independently stress-test technical & gray-box test plans',
    'Review trade-offs & plans; split task.md',
    'Build from exemplars; pass lint, UT & IT',
    'Check quality & TCs; reject extra bloat',
    'Pause for UAT at marked gates only',
    'Run auto & smoke suites into test-report.md',
    'Deliver code, test report & release check',
    'Confirm signoff; update Wiki & archive'
  ],
  planLabel: 'Artifacts',
  planTitle: 'One place per artifact. What matters stays alive in the repo.',
  planSub: 'plan.md captures how to build, test-plan.md locks how to verify and what could break, both feed task.md, and accepted knowledge/ Wiki stays live across future changes.',
  tocSwitchLabel: 'Switch core artifact outline',
  tocCap: 'Technical plan · reading line',
  chapters: [
    [ 'Background & scope', 'Why, what is in scope, and what is explicitly out' ],
    [ 'Overview', 'Modules in scope, deliverables, and affected systems' ],
    [ 'Overall design', 'How parts fit together, reference exemplars & component reuse' ],
    [ 'Key design & contracts', 'Data models, state transitions, boundaries and interfaces' ],
    [ 'Assumptions & risks', 'Core assumptions (and impact if wrong) plus rollout risks' ],
    [ 'Release plan', 'Deploy order, config steps, verification and rollback' ]
  ],
  testTocCap: 'Gray-box test plan · modules & regression',
  testChapters: [
    [ 'Setup & data preconditions', 'Test accounts, mock boundaries, and required fixtures' ],
    [ 'Test layering & platform sync', 'UT/IT/E2E split plus external platform export rules' ],
    [ 'Functional test matrix', 'Equivalence, boundary & state TC-xx cases by module' ],
    [ 'Regression & blast radius', 'Existing flows affected by shared code or schema changes' ],
    [ 'Out-of-scope & limits', 'Excluded scenarios and environment constraints' ]
  ],
  wikiTocCap: 'Domain Wiki · evolves per system area',
  wikiChapters: [
    [ 'Core mechanisms & data flow', 'How the module works today across entry points and stores' ],
    [ 'Constraints & rationale', 'Must-keep contracts and why key trade-offs were chosen' ],
    [ 'Operations & regression scope', 'Where to edit, rollout steps, smoke scope & open gaps' ],
    [ 'Evolution history', 'Links back to archived issue folders and ADRs when needed' ]
  ],
  treeCap: 'File layout',
  treeNote: 'Locations set by you or the project take precedence; keep only these entries in the issue root.',
  tree: [
    '',
    'scope, decisions, regression scope, open items',
    'key trade-offs and reasons',
    'topic-based investigation notes',
    'lean technical plan',
    'plan attachments & large tables',
    'gray-box test matrix & regression scope',
    'joint tasks, mounted TCs & walkthrough gates',
    'task logs, screenshots & test-report.md',
    'plan, test-plan & code review reports',
    'domain-organized project Wiki',
    'accepted & archived'
  ],
  issue: '<issue>',
  prinTitle: 'Four principles — stay in control without extra ceremony.',
  prinMore: 'The reasoning behind each lives in CONTRIBUTING.md',
  principles: [
    [ 'Keep design authority human', 'Ask if the user already has a direction before proposing one. AI verifies codebase facts itself and brings architectural trade-offs and regression scope to you as a decision tree.' ],
    [ 'Build quality in, reject role-play', 'Never split Dev vs QA personas. Lock gray-box TC-xx and regression domains before coding, pass compile/unit checks before review, pause only at key UAT gates, and deliver test-report.md.' ],
    [ 'Fresh eyes without speculative bloat', 'Technical plans, test plans, and diffs are reviewed in isolated contexts—paired with explicit receiving-review guards that reject premature abstractions and redundant defensive checks.' ],
    [ 'Live project docs, tool-agnostic', 'Keep technical plans readable in ten minutes without copying PRD rules. Fold verified mechanisms and regression scope into a domain Wiki, and honor repo AGENTS.md for diagrams and test platforms.' ]
  ],
  skTitle: 'One delivery flow. Eight standalone engineering methods.',
  skSub: 'Run the five flow skills when shipping major work; invoke any of the eight Build × Test method skills on its own in any repository with zero .rivo/ coupling.',
  skEntry: 'Entry · triggers, delivery order & built-in quality rules',
  skMethods: 'Methods (Build × Test symmetry)',
  skMethodsSub: 'Standalone outside Rivo — one skill, one job',
  stageSkills: [
    [ 'converging', 'Discuss', 'Ask direction, check code & UI mapping, align decisions, acceptance criteria, and regression scope', [ 'Decisions', 'ADR' ] ],
    [ 'writing-plans', 'Plan', 'Draft and review peer plan.md & test-plan.md sequentially; split task.md on approval', [ 'plan.md', 'test-plan.md', 'task.md' ] ],
    [ 'implementing-plans', 'Build', 'Run fast checks before independent review, marked walkthroughs, layered regression & release check', [ 'Layered checks', 'Test report', 'Release check' ] ],
    [ 'knowledge-management', 'Knowledge', 'Merge verified mechanisms and regression scope into the domain Wiki & archive', [ 'Knowledge Wiki' ] ]
  ],
  revising: [ 'Revise', 'When confirmed decisions, dual plans or tasks need local changes, update from the highest affected layer down to code; if core models break, open a dedicated refactor issue.', 'decisions → plan & test-plan → task → code' ],
  methodSkills: [
    [ 'investigating', 'Base · Research', 'Investigate code mechanisms, protocols or UI component mappings and keep topic notes' ],
    [ 'system-design', 'Design · Build', 'Write a lean 10-min technical plan with paired independent review & anti-bloat triage' ],
    [ 'test-driven-development', 'Code · Build', 'Drive behaviour with failing tests (from existing TC lists first, honoring scope limits)' ],
    [ 'code-review', 'Gate · Build', 'Review quality & real test coverage independently, rejecting speculative bloat' ],
    [ 'dispatching-subagents', 'Base · Delegate', 'Delegate read-only research, independent reviews, or batch edits once exemplars lock' ],
    [ 'test-design', 'Design · Test', 'Gray-box analysis & layered TC matrix ready for review and test platforms' ],
    [ 'systematic-debugging', 'Debug · Test', 'Reproduce failures, test root-cause hypotheses and verify fixes with evidence' ],
    [ 'verifying', 'Gate · Test', 'Execute checks fast-to-slow, run impact-scoped regression & write test-report.md' ]
  ] as [string, string, string][],
  stages: [
    {
      name: 'Discuss',
      ai: 'Asks direction, checks code & UI mapping, aligns trade-offs & regression scope',
      you: 'Direction, scope, trade-offs & criteria',
      leaves: [ 'decisions.md', 'ADR', 'research/' ],
      file: 'issues/supplier-profile/adr/001-read-time-compat.md',
      doc: [
        [ 'h', '# 001: Legacy data uses read-time compat' ],
        [ 'm', 'Status: accepted (user, 2026-10-08)' ],
        [ 'm', 'Modules: legacy data, reporting · Must keep: old export intact' ],
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
      ai: 'Drafts & reviews peer plan.md + test-plan.md; splits joint task.md on approval',
      you: 'Review & approve dual plans',
      leaves: [ 'plan.md', 'test-plan.md', 'task.md' ],
      file: 'issues/supplier-profile/plan.md · test-plan.md · task.md',
      doc: [
        [ 'h', '## 1. Technical plan (plan.md)' ],
        [ '', 'Single schema across fields & page; FormKit exemplar; read-compat contract (0 P0)' ],
        [ 'h', '## 2. Gray-box test plan (test-plan.md)' ],
        [ '', '18 layered TC-xx cases by module (UT/IT/E2E) + legacy export regression (0 P0)' ],
        [ '', '' ],
        [ 'r', '✓ Dual plans approved (v1.0) → split joint downstream task.md immediately' ],
        [ '', 'T1–T2 infra run headless · T3 profile page sets walkthrough gate + TC-01..06' ]
      ]
    },
    {
      name: 'Build',
      ai: 'Fast auto checks → fresh-eyes review → marked walkthroughs; layered regression & test-report.md',
      you: 'Key walkthrough & final acceptance',
      leaves: [ 'code & tests', 'reviews/', 'evidence/test-report.md' ],
      file: 'issues/supplier-profile/task.md → evidence/test-report.md',
      doc: [
        [ 'h', '### Task execution · T1–T2 auto-passed · T3 human UAT' ],
        [ '', 'TDD from TC-01..06 cleared lint/UT/build before review (0 P0) → T3 UAT passed.' ],
        [ 'h', '### Signoff regression · evidence/test-report.md  [PASS]' ],
        [ 'm', 'Full auto: static + UT/IT green · Targeted: cross-task smoke & legacy export 4/4' ],
        [ 'q', 'Code & coverage check: reused FormKit with zero bloat; all mounted TCs tested' ],
        [ 'm', 'Uncovered risk: million-row legacy export sampled at 2,000 rows (see evidence/t3/)' ]
      ]
    },
    {
      name: 'Knowledge',
      ai: 'Merges verified mechanisms & regression scope into Wiki after acceptance',
      you: 'Nothing to decide',
      leaves: [ 'knowledge/', 'archived/' ],
      file: 'knowledge/supplier-archive.md',
      doc: [
        [ 'h', '# Supplier archive domain' ],
        [ 'm', 'Scope: supplier-service · supplier-web · vms-report' ],
        [ 'k', 'Core mechanisms & data flow' ],
        [ '', 'Fields are schema-driven across page & form; FormKit backs inputs.' ],
        [ 'k', 'Operations & regression scope' ],
        [ '', 'Schema edits must pass legacy export & null-array adapter regression (TC-02).' ],
        [ 'k', 'History' ],
        [ 'm', '#supplier-profile (2026-10-16): archived/supplier-profile · ADR-001' ],
        [ 'r', '→ Merged into domain Wiki and issue archived' ]
      ]
    }
  ],
  stTitle: 'Start with a goal — and your own direction.',
  stInstall: 'Install',
  stTry: 'Say it like this',
  stEnv: 'Model choices follow your preferences and repo conventions. By default the main session builds incrementally while independent subagents handle investigation, review, or post-exemplar batch edits. Put diagram tools, writing style, build/test commands, and external test platform sync rules (if your project uses one) in your repo’s AGENTS.md or CLAUDE.md.',
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
  tagMethod: 'standalone method skill',
  prompts: [
    'Use Rivo to improve supplier profiles: field config, profile page, form assets, legacy data and reporting. I want fields and forms to share one schema — check my breakdown, current code, UI mapping, and regression scope.',
    'Use test-design on this PRD and API design to build a layered gray-box test matrix ready for test platform import.',
    'Use code-review to independently check quality, requirement fit, and real test coverage on this branch while rejecting speculative bloat.',
    'Use verifying to run compile, unit, and integration checks first, execute impact-scoped regression, and write test-report.md.'
  ],
  copy: 'copy',
  copied: 'copied',
  footLine: 'At the next change, the reasons, design map, and regression scope are still there.',
  footCta: 'Get Rivo on GitHub',
  skip: 'Skip to content',
  meta: {
    htmlLang: 'en',
    title: 'Rivo — Design stays with you',
    description: 'Software delivery skills for Claude Code, Codex, Antigravity & Gemini CLI. You set direction and trade-offs; AI drafts peer technical and gray-box test plans, verifies fast-to-slow with isolated critique, delivers test-report.md, and maintains a domain Wiki.'
  }
}

export const site: Record<Locale, typeof zh> = { zh, en }
