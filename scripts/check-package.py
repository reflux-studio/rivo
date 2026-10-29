#!/usr/bin/env python3
"""Check the Rivo marketplace, isolated plugin files and actual hook output."""
import argparse
import ast
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET


def check(root):
    errors, inventory = [], {}
    try:
        marketplace = json.loads((root / '.claude-plugin/marketplace.json').read_text())
    except (OSError, ValueError) as exc:
        return [f'marketplace: {exc}'], {}
    entries = marketplace.get('plugins', [])
    expected_skills = {
        'rivo': {'using-rivo','collaborating','resume','writing-clearly','investigating','dispatching-subagents','revising','knowledge-management'},
        'rivo-product': {'discovering-products','market-research','competitive-analysis','user-research','writing-prds','designing-products','reviewing-metrics'},
        'rivo-development': {'converging','writing-plans','implementing-plans','systematic-debugging','test-driven-development'},
        'rivo-testing': {'designing-tests','testing','reporting-defects'},
    }
    expected = set(expected_skills)
    if {e.get('name') for e in entries} != expected or len(entries) != 4:
        errors.append('marketplace must discover four distinct plugins')
    for entry in entries:
        plugin = (root / entry['source']).resolve()
        try:
            plugin.relative_to(root.resolve())
        except ValueError:
            errors.append('marketplace source escapes repository')
            continue
        name = entry['name']
        manifests = []
        for kind in ('.claude-plugin', '.codex-plugin'):
            try:
                value = json.loads((plugin / kind / 'plugin.json').read_text())
                manifests.append(value)
                if value.get('name') != name or value.get('skills') != './skills/':
                    errors.append(f'{name}: invalid manifest name or skill root')
                for image in (value.get('icon'), *[value.get('interface', {}).get(k) for k in ('composerIcon','logo')]):
                    if image and not (plugin / image).is_file(): errors.append(f'{name}: missing icon {image}')
            except (OSError,ValueError) as exc:
                errors.append(f'{name}/{kind}: {exc}')
        if len(manifests)==2 and manifests[0]['version'] != manifests[1]['version']:
            errors.append(f'{name}: host versions differ')
        skills = sorted((plugin / 'skills').glob('*/SKILL.md'))
        inventory[name] = [p.parent.name for p in skills]
        if set(inventory[name]) != expected_skills.get(name, set()):errors.append(f'{name}: skill inventory differs from agreed scope')
        try:
            hook_config = json.loads((plugin/'hooks/hooks.json').read_text())
            configured = hook_config['hooks']['SessionStart'][0]['hooks'][0]
            if configured.get('command') != '"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd" session-start' or configured.get('type') != 'command':
                errors.append(f'{name}: hook manifest does not execute packaged wrapper')
        except (OSError, ValueError, KeyError, IndexError, TypeError) as exc:
            errors.append(f'{name}: invalid hook manifest: {exc}')
        if not skills: errors.append(f'{name}: no skills')
        for path in skills:
            match = re.match(r'\A---\n(.*?)\n---(?:\n|$)',path.read_text(),re.S)
            if not match:
                errors.append(f'{name}/{path.parent.name}: missing frontmatter');continue
            fields = match[1]
            if not re.search(r'^name: '+re.escape(path.parent.name)+r'\s*$', fields,re.M):
                errors.append(f'{name}/{path.parent.name}: wrong name')
            if not re.search(r'^description:\s*\S',fields,re.M): errors.append(f'{name}/{path.parent.name}: missing description')
        for path in (plugin / 'skills').rglob('*.md'):
            if name!='rivo':
                text=path.read_text()
                if re.search(r'\.rivo/issues|(?:product|development|testing)/(?:research|prd|plan|cases|runs|decisions|task)|(?:^|[\s`])(?:product|development|testing)/(?=[\s`]|$)|^#{1,6}[^\n]*(?:默认产物位置|默认目录|目录约定|目录树)',text,re.M):
                    errors.append(f'{name}: duplicate domain directory convention {path.relative_to(plugin)}')
                for target in re.findall(r'rivo:([a-z][a-z0-9-]+)',text):
                    if target not in expected_skills['rivo']:
                        errors.append(f'{name}: wrong public skill namespace rivo:{target}')
            for link in re.findall(r'\]\(([^)]+)\)',path.read_text()):
                target = link.split('#',1)[0]
                if not target or '://' in target or target.startswith(('mailto:','<')):continue
                resolved=(path.parent/target).resolve()
                try: resolved.relative_to(plugin)
                except ValueError: errors.append(f'{name}: reference escapes package {path.relative_to(plugin)}:{target}')
                if not resolved.exists():errors.append(f'{name}: missing reference {target}')
        for path in (plugin/'assets').glob('*.svg'):
            try:ET.parse(path)
            except (OSError,ET.ParseError) as exc:errors.append(f'{name}: invalid SVG {exc}')
        if name!='rivo' and any(p.parent.name.startswith('using-') for p in skills):errors.append(f'{name}: duplicate domain entry')
        with tempfile.TemporaryDirectory(prefix='rivo hook ') as tmp:
            for enabled in (False,True):
                if enabled:(Path(tmp)/'.rivo').mkdir()
                for host,var,field in [('claude','CLAUDE_PLUGIN_ROOT','hookSpecificOutput'),('cursor','CURSOR_PLUGIN_ROOT','additional_context'),('default',None,'additionalContext')]:
                    env=os.environ.copy()
                    for key in ('CLAUDE_PLUGIN_ROOT','CURSOR_PLUGIN_ROOT','COPILOT_CLI'):env.pop(key,None)
                    env['CLAUDE_PROJECT_DIR']=tmp
                    if var:env[var]=str(plugin)
                    try:
                        run=subprocess.run(['bash',str(plugin/'hooks/run-hook.cmd'),'session-start'],env=env,capture_output=True,text=True,timeout=10)
                        if run.returncode:raise ValueError(run.stderr)
                        result=json.loads(run.stdout);content=result[field]
                        if host=='claude':content=content['additionalContext']
                        if not isinstance(content,str) or not content or len(content)>1200:raise ValueError('missing/oversized hook context')
                        if name=='rivo' and str(plugin/'skills/using-rivo/SKILL.md') not in content:raise ValueError('wrong public entry')
                        if name!='rivo' and ('using-rivo' not in content or name not in content):raise ValueError('missing shared-entry dependency')
                        if '# 使用 Rivo' in content:raise ValueError('hook injects entire workflow')
                    except (OSError,ValueError,KeyError,TypeError,subprocess.TimeoutExpired) as exc:errors.append(f'{name} hook {host}/{enabled}: {exc}')
    core=set(inventory.get('rivo',[]))
    if core != {'using-rivo','collaborating','resume','writing-clearly','investigating','dispatching-subagents','revising','knowledge-management'}:
        errors.append('public skill inventory differs from agreed scope')
    for old in ('implementing-designs','design-fidelity','running-e2e'):
        if any(old in names for names in inventory.values()):errors.append(f'obsolete skill: {old}')
    for domain in ('product','development','testing'):
        if not (root/f'skills/using-rivo/references/{domain}.md').is_file():errors.append(f'missing central domain {domain}')
    if not {'test-driven-development','systematic-debugging'} <= set(inventory.get('rivo-development',[])):errors.append('developer methods absent')
    for name in ('investigating','revising','resume','knowledge-management','dispatching-subagents'):
        for path in (root/'skills'/name).rglob('*.md'):
            if re.search(r'\b(?:plan|task)\.md\b|\.rivo/issues|技术方案 →',path.read_text()):errors.append(f'public method retains fixed developer artifact: {path}')
    for path in [root/'README.md',root/'CONTRIBUTING.md']:
        for target in re.findall(r'\]\(([^)]+)\)',path.read_text()):
            target=target.split('#',1)[0]
            if target and '://' not in target and not target.startswith('<') and not (path.parent/target).exists():errors.append(f'{path.name}: missing {target}')
    for path in list((root/'scripts').glob('*.py'))+list((root/'skills').rglob('*.py')):
        try:ast.parse(path.read_text())
        except SyntaxError as exc:errors.append(f'Python syntax {path}: {exc}')
    return errors,inventory


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    args=parser.parse_args();errors,plugins=check(args.root.resolve())
    print(json.dumps({'plugins':plugins,'skills':sum(map(len,plugins.values())),'errors':errors},ensure_ascii=False,indent=2))
    raise SystemExit(bool(errors))
