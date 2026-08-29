---
name: using-rivo
description: 用 rivo 跑一次交付流程,或配置 rivo 的参与者、流程与平台接入。当被唤起去某个节点工作、需要表态推进或打回、或需要初次配置 rivo 时使用。
---

# 使用 rivo

先确认 CLI 可用:`rivo --version`。没装的话见 [references/setup.md](references/setup.md) 的安装说明。

配置相关的操作(声明参与者、接入平台、建流程)也见 [references/setup.md](references/setup.md)。

## 你被唤起时

1. `rivo issue show <slug> --json` 看当前节点(`node`)、节点说明(`instruction`)和产物目录(`issueDir`)
2. `rivo flow show <flow> --node <node>` 看这个节点要你做什么
3. 干活。产出写进 `issue_dir`,文件名按你的角色技能来
4. 表态

## 表态

```bash
rivo issue approve <slug> --as <你的角色名> --reason "简要说明现状和产物位置"
rivo issue reject  <slug> --as <你的角色名> --reason "为什么退回" [--to <节点>]
```

身份也可以用环境变量 `RIVO_AGENT` 声明,不必每次都带 `--as`。rivo 不做身份校验,谁自称是谁就是谁。

`--reason` 是强制的。**同意和反对一样需要理由**——approve 的 reason 就是给下游的交接说明,写清你产出了什么、放在哪。

流转是自动的:所有 assignee 表态齐了,rivo 自己判断前进还是打回,并唤起下一批人。**你不需要通知任何人。**

## 人类拍板

`mode` 为 `manual` 时(`rivo issue show` 输出里能看到),**自审通过后必须得到用户明确许可才能 approve**。评审意见你可以采纳,但采纳前要让用户知道你改了什么——用户必须感知方案的演化,而不只是结果。

`mode` 为 `auto` 时可以自主推进,用户只参与最终验收。

## 打回与回收

- **`reject`** 是你在当前节点投的一票,参与阈值计算。你是 assignee 时用它。
- **`recall`** 是无条件强制回退,不参与计数。你不是当前节点的 assignee、但需要把流程拉回去时用它:

  ```bash
  rivo issue recall <slug> --to <节点> --reason "为什么" [--as <who>]
  ```

  只能往回,不能往前跳。

**rivo 无法中止已经在跑的任务。** recall 之后对方可能还在执行,rivo 只会触发通知脚本。要真正终止,取决于你的平台脚本怎么写。

## 收尾:close

`rivo issue show` 打出 `全部节点已通过,可以 rivo issue close` 时,交付走完了最后一个节点,但**还没结束**——rivo 不会自己关闭交付,关闭是显式动作。

```bash
rivo issue close <slug> --reason "为什么结束" [--as <who>]
```

什么时候用它:

- 最后一个节点通过、产物已经落地 → 正常收尾。
- 需求撤了、方案作废 → 也是 close,rivo 没有单独的"取消"。
- 首节点被打回时报错会点名它:第一个节点没有上游,想终止只能 close。

**close 不可逆。** log 是追加式的,没有 reopen;关闭之后不能再表态,也不能再 recall。所以正常收尾之前,先确认没有节点还在等人。

## 看原始记录:log

```bash
rivo issue log <slug>
```

一行一个事件,按时间顺序。`show` 给的是折叠之后的结论,`log` 给的是过程——排查"为什么它停在这个节点""谁在什么时候表了什么态""这一步是 reject 还是 recall 带回来的"时看它。

`show` 里出现 `有 N 条陈旧事件被忽略` 或 `有 N 行 log 无法解析` 时,先看 `log`,再跑 `rivo doctor`。

## 没有人被唤起时

`rivo issue approve` 之后如果没人被唤起,原因有三种,不要混为一谈:

- 根本没配 `scripts`——手工模式,预期如此。
- 下个节点的 assignee 声明时没绑 `--ref`——设计如此,这个节点本来就该由人接手,rivo 不会调用脚本。
- 下个节点的 assignee 压根没声明——是错误,rivo 会打印 `console.warn` 点名是谁、在哪个节点。

不管是哪一种,**把下一步是谁告诉用户**,由人去开对应的会话或去声明缺失的 agent。

## 流程设计原则

写 `flow.yaml` 时:**节点按角色切,不按任务切。不发生交接,就不切节点。**

切新节点只有三种理由:换角色了、需要别人表态、需要停下来等人。技术方案如果不拉别人评审,它就该待在编码节点里面,不该独立成节点。
