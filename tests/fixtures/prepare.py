#!/usr/bin/env python3
"""Prepare disposable raw workspaces for independent skill forward tests."""
import argparse
import json
from pathlib import Path
import subprocess


def write(root, name, text):
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')


def issue(root, plan, task='', decisions='用户已确认本期范围。'):
    write(root, '.rivo/issues/demo/decisions.md', '# 决定\n\n' + decisions + '\n')
    write(root, '.rivo/issues/demo/plan.md', plan)
    if task:
        write(root, '.rivo/issues/demo/task.md', task)


def prepare(output):
    if output.exists():
        raise ValueError('output must be a new directory')
    output.mkdir(parents=True)
    base = output / 'test-design'
    write(base, 'request.md', '实现走访：两类角色为负责人和只读用户。负责人可创建、取消，只读用户不能变更。分差大于等于20触发校准。取消后不能提交，重复取消不产生额外通知。旧活动继续可读。\n')
    issue(base, '# 走访技术方案\n状态：草稿\n\n负责人可创建、取消，只读用户只读。分差大于20时触发校准。取消后禁止提交，旧活动保持可读。\n', decisions='本期按 request.md，用户尚未批准方案或授权实施。')
    write(base, 'app.py', 'def calibration_required(delta):\n    raise NotImplementedError\n')

    for variant in ('catalog', 'flow', 'local'):
        root = output / ('architecture-' + variant)
        write(root, 'AGENTS.md', '字段和OA别名由schema维护，业务线差异采用规则扩展；汇总主流程统一。本地可修改与验证，不提交推送。\n')
        issue(root, '# 评分扩展\n状态：定稿 v1.0\n\n将现有评分能力扩展到四个模板，保持字段定义来源与统一汇总流程。\n', '# 任务\nT1 当前负责人：本会话；将专业模板候选扩展至采购、内控、财务，先完成代表路径。\n', '用户批准方案并授权本地实施。重要工程选择需用户确认。')
        write(root, 'schema.json', json.dumps({'score': {'oaMenuKey': 'oa_score', 'type': 'number'}}, indent=2))
        for template in ('professional', 'procurement', 'control', 'finance'):
            write(root, f'templates/{template}.py', 'def calculate(score):\n    return score\n')
        if variant == 'catalog':
            write(root, 'catalog.py', 'FIELDS = {"score": {"oa_alias": "oa_score", "weight": 0.3}}\n')
            write(root, 'templates/professional.py', 'from catalog import FIELDS\ndef calculate(score):\n    return score * FIELDS["score"]["weight"]\n')
        if variant == 'flow':
            write(root, 'extensions.py', 'def independent_main_tasks(business_line):\n    return business_line == "APC"\n')
            write(root, 'templates/professional.py', 'from extensions import independent_main_tasks\ndef submit(business_line):\n    if independent_main_tasks(business_line):\n        return "apc_pipeline"\n    return "legacy_pipeline"\n')
        if variant == 'local':
            write(root, 'helpers.py', 'def double(v):\n    return v * 2\n')

    for variant in ('stale', 'busy', 'legacy', 'unaccepted'):
        root = output / ('resume-' + variant)
        issue(root, '# 记录管理\n状态：定稿 v1.0\n\n保存记录并可刷新读取完整内容。\n', '# 当前任务\n协调者：本会话\nT1 已完成，验证见 evidence/run-a/report.md。\n授权：本地实施，不提交推送。\n', '用户批准方案并授权本地实施；未授权发布，尚未验收。')
        write(root, 'app.py', 'def total(value):\n    return value\n')
        subprocess.run(['git', 'init', '-q', str(root)], check=True)
        for args in (['config', 'user.name', 'Rivo Fixture'], ['config', 'user.email', 'fixture@example.invalid'], ['add', '.'], ['commit', '-qm', 'fixture baseline']):
            subprocess.run(['git', '-C', str(root), *args], check=True)
        revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
        write(root, '.rivo/issues/demo/evidence/run-a/report.md', f'# 历史验证\n代码版本：{revision}\n本地total(3)=3，通过。\n')
        if variant == 'stale':
            write(root, 'app.py', 'def total(value):\n    return value * 2\n')
            subprocess.run(['git', '-C', str(root), 'add', 'app.py'], check=True)
            subprocess.run(['git', '-C', str(root), 'commit', '-qm', 'new behavior'], check=True)
            write(root, 'app.py', 'def total(value):\n    return value * 3\n')
        elif variant == 'busy':
            write(root, '.rivo/issues/demo/task.md', '# 当前任务\n协调者：other-session\nT1 实施中，负责人：other-session，工作区：当前目录；下一步修复app.py。\n授权：本地实施，无消息发送或发布授权。\n')
        elif variant == 'legacy':
            write(root, '.rivo/issues/demo/assets/refactor-plan.md', '# 重构方案\n方案已确认，改为全部记录只展示第一条。版本来源和确认人缺失。\n')
            write(root, '.rivo/issues/demo/research/notes.md', '# 调查\n待确定：是否展示全部记录。\n')
        elif variant == 'unaccepted':
            write(root, '.rivo/issues/demo/evidence/run-a/report.md', '# 验证\n代码审阅通过；真实E2E因依赖断开受阻。用户尚未验收。\n')
    root = output / 'revision'
    issue(root, '# 表单汇总\n状态：定稿 v1.0\n\n多人意见取最后一份非空值。\n', '# 任务\nT1 已完成，按plan.md实现汇总。\n', '用户原先批准最后非空合并；最新决定：按走访人完整保留每份业务对象，允许同步修订文档，不修改业务代码。')
    write(root, '.rivo/issues/demo/tests/cases.md', '# 用例\nTC01 两人填写不同内容，预期只保留最后一份。\n')
    write(root, '.rivo/issues/demo/evidence/run-a/report.md', '# 历史执行\n方案v1.0：两人填写后仅最后一份，旧规则通过。\n')

    for variant in ('missing', 'export', 'backend'):
        root = output / ('design-' + variant)
        if variant == 'export':
            write(root, 'confirmed-design.md', '# 已确认设计导出\n版本2026-10-28。表单包含名称、备注；记录可以展开和收起。原在线链接已不可用，用户确认以本导出为准。\n')
        write(root, 'task.md', '仅服务端接口开发，不含界面。\n' if variant == 'backend' else '需要按设计完成记录页面。原始链接 http://127.0.0.1:1/design 。\n')

    root = output / 'ambiguous'
    for name in ('orders', 'vendors'):
        write(root, f'.rivo/issues/{name}/decisions.md', '# 范围\n本需求尚在讨论。\n')

    root = output / 'authorized-local'
    issue(root, '# 数值转换\n状态：定稿 v1.0\n\nnormalize(value)将负数转为0，非负数保留。\n', '# 任务\n协调者：本会话\nT1 待实施，无其他负责人。允许本地实现并验证，不提交推送。\n', '方案和tests/cases.md已获用户批准，并明确授权本地实施。')
    write(root, '.rivo/issues/demo/tests/cases.md', '# 已确认用例\nTC01 normalize(-2)=0，normalize(0)=0，normalize(3)=3。\n')
    write(root, 'app.py', 'def normalize(value):\n    return value\n')
    return {p.name: str(p) for p in output.iterdir() if p.is_dir()}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(prepare(args.output), ensure_ascii=False, indent=2))
