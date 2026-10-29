#!/usr/bin/env python3
"""Exercise isolated plugin payloads, negative package controls and concurrent append."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]

def module(path,name):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m


def run():
    check=module(ROOT/'scripts/check-package.py','rivo_package_check').check
    reports={}
    with tempfile.TemporaryDirectory(prefix='rivo-distribution-') as tmp:
        tmp=Path(tmp);base=tmp/'all'
        for rel in ['.claude-plugin','.codex-plugin','skills','hooks','assets','plugins','scripts']:
            shutil.copytree(ROOT/rel,base/rel,ignore=shutil.ignore_patterns('.DS_Store','__pycache__'))
        for rel in ['README.md','CONTRIBUTING.md','CHANGELOG.md']:shutil.copy2(ROOT/rel,base/rel)
        errors,inventory=check(base);assert not errors,errors
        reports['positive_skills']=sum(map(len,inventory.values()))
        # Copy only actual plugin payloads, not sibling plugins. Verify the declared skill roots.
        reports['isolated']={}
        for domain in [None,'product','development','testing','all']:
            install=tmp/('isolated-'+str(domain));install.mkdir()
            names=['rivo']+(['rivo-'+d for d in ['product','development','testing']] if domain=='all' else ['rivo-'+domain] if domain else [])
            found={}
            for name in names:
                source=ROOT if name=='rivo' else ROOT/'plugins'/name
                target=install/name;target.mkdir()
                for rel in ['.claude-plugin','.codex-plugin','skills','hooks','assets']:
                    shutil.copytree(source/rel,target/rel,ignore=shutil.ignore_patterns('.DS_Store','__pycache__'))
                manifest=json.loads((target/'.codex-plugin/plugin.json').read_text())
                found[name]=sorted(p.parent.name for p in (target/manifest['skills']).glob('*/SKILL.md'))
                for path in (target/'skills').rglob('*.md'):
                    import re
                    for link in re.findall(r'\]\(([^)]+)\)',path.read_text()):
                        link=link.split('#',1)[0]
                        if link and '://' not in link and not link.startswith('<'):
                            resolved=(path.parent/link).resolve();resolved.relative_to(target.resolve());assert resolved.exists(),(name,path,link)
            assert set(found)==set(names)
            reports['isolated'][str(domain)]=found
        # Each control checks its intended diagnostic, not merely any unrelated failure.
        mutations=[
            ('missing-domain-skill',lambda p:shutil.rmtree(p/'plugins/rivo-product/skills/market-research'),'rivo-product: skill inventory'),
            ('bad-manifest',lambda p:(p/'plugins/rivo-testing/.codex-plugin/plugin.json').write_text('{'),'rivo-testing/.codex-plugin'),
            ('escaping-reference',lambda p:(p/'plugins/rivo-testing/skills/testing/SKILL.md').open('a').write('\n[escape](../../../../README.md)\n'),'reference escapes package'),
            ('wrong-hook-command',lambda p:(p/'hooks/hooks.json').write_text('{"hooks":{"SessionStart":[{"hooks":[{"type":"command","command":"true"}]}]}}'),'hook manifest does not execute'),
            ('old-namespace',lambda p:(p/'plugins/rivo-testing/skills/testing/SKILL.md').open('a').write('\n加载 rivo:reporting-defects\n'),'wrong public skill namespace'),
            ('duplicate-directory',lambda p:(p/'plugins/rivo-testing/skills/testing/SKILL.md').open('a').write('\n## 默认目录\n- testing/cases.md\n'),'duplicate domain directory'),
            ('private-directory-map',lambda p:(p/'plugins/rivo-testing/skills/testing/references/private.md').write_text('# 默认产物位置\nproduct/ development/ testing/\n'),'duplicate domain directory'),
            ('developer-assumption',lambda p:(p/'skills/revising/SKILL.md').open('a').write('\n先读取 plan.md\n'),'public method retains fixed developer artifact'),
            ('wrong-entry-hook',lambda p:(p/'hooks/session-start').write_text('#!/bin/sh\nprintf \'{"additionalContext":"old"}\\n\'\n'),'wrong public entry'),
        ]
        reports['negative_controls']={}
        for name,mutate,expected in mutations:
            altered=tmp/name;shutil.copytree(base,altered);mutate(altered);errors,_=check(altered)
            assert any(expected in e for e in errors),(name,errors)
            reports['negative_controls'][name]=errors
        # Real local process interleaving. Every writer starts from the same prepared file.
        case=tmp/'append';(case/'collaboration').mkdir(parents=True)
        issue=case/'issue.md';issue.write_text('# Fixture\n\n| 时间 | 发起方 | 接收方 | 协作记录 |\n| --- | --- | --- | --- |\n')
        script=ROOT/'skills/collaborating/scripts/append-request.py'
        processes=[]
        for index in range(24):
            rel=f'collaboration/request-{index}.md';(case/rel).write_text(f'request {index}')
            processes.append(subprocess.Popen([sys.executable,str(script),str(issue),'--sender',f'A{index}','--recipient','D','--record',rel,'--at','2026-10-29T12:00:00+08:00'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True))
        for process in processes:
            out,err=process.communicate(timeout=15);assert process.returncode==0,(out,err)
        text=issue.read_text()
        assert all(text.count(f'](collaboration/request-{n}.md)')==1 for n in range(24))
        append=module(script,'rivo_append').append
        again=append(issue,'A0','D','collaboration/request-0.md','2026-10-29T12:00:00+08:00');assert not again['appended']
        reports['concurrent_append']={'writers':24,'retained':24,'sequential_duplicate_skipped':True,'scope':'local filesystem; no online conditional-update claim'}
    return reports

if __name__=='__main__':
    parser=__import__('argparse').ArgumentParser(description=__doc__);parser.add_argument('--output',type=Path)
    args=parser.parse_args();result=run()
    content=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if args.output:args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(content)
    print(json.dumps({'isolated_combinations':len(result['isolated']),'negative_controls':len(result['negative_controls']),'concurrent_append':result['concurrent_append'],'skills':result['positive_skills']},ensure_ascii=False))
