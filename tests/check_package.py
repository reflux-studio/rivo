"""Offline package checks; this does not run a model or validate its decisions."""
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


def check():
    for path in ROOT.rglob("*.json"):
        if ".git" not in path.parts:
            json.loads(path.read_text(encoding="utf-8"))
    for path in (ROOT / "docs/assets").glob("*.svg"):
        ET.parse(path)
    manifests = [json.loads((ROOT / host / "plugin.json").read_text())
                 for host in (".claude-plugin", ".codex-plugin")]
    for field in ("name", "version", "description", "skills", "interface"):
        assert manifests[0][field] == manifests[1][field], field
    assert f'version-{manifests[0]["version"]}-' in (ROOT / "README.md").read_text()

    # Check navigation, not example links inside Markdown code blocks.
    links = 0
    for path in [ROOT / "README.md", *ROOT.glob("skills/**/*.md")]:
        fence = None
        for line in path.read_text().splitlines():
            marker = re.match(r"^\s*(`{3,}|~{3,})", line)
            if marker:
                token = marker.group(1)
                if fence is None:
                    fence = token
                elif token[0] == fence[0] and len(token) >= len(fence):
                    fence = None
                continue
            if fence:
                continue
            line = re.sub(r"`[^`]*`", "", line)
            for target in re.findall(r"\]\(([^)]+)\)", line):
                if re.match(r"\w+://|#", target):
                    continue
                target = target.split("#")[0]
                assert (path.parent / target).exists(), (path, target)
                links += 1

    script = ROOT / "hooks/session-start"
    subprocess.run(["bash", "-n", str(script)], check=True)
    subprocess.run(["bash", "-n", str(ROOT / "hooks/run-hook.cmd")], check=True)
    with tempfile.TemporaryDirectory(prefix="rivo-check-") as directory:
        project = Path(directory) / 'project with "quotes"'
        project.mkdir()
        for rivo in (False, True):
            if rivo:
                (project / ".rivo").mkdir()
            for host in ("claude", "cursor", "generic"):
                env = {k: v for k, v in os.environ.items()
                       if k not in ("CLAUDE_PLUGIN_ROOT", "CURSOR_PLUGIN_ROOT", "COPILOT_CLI")}
                env["CLAUDE_PROJECT_DIR"] = str(project)
                if host != "generic":
                    env[f"{host.upper()}_PLUGIN_ROOT"] = str(ROOT)
                result = json.loads(subprocess.check_output(["bash", str(script)], env=env))
                assert len(result) == 1
                content = (result["hookSpecificOutput"]["additionalContext"] if host == "claude"
                           else result["additional_context" if host == "cursor" else "additionalContext"])
                assert ((ROOT / "skills/using-rivo/SKILL.md").read_text().strip() in content) == rivo

        spec = importlib.util.spec_from_file_location("prepare", ROOT / "tests/behavior/prepare.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        cases = json.loads((ROOT / "tests/behavior/cases.json").read_text())
        for name, case in cases.items():
            destination = Path(directory) / name
            module.prepare(name, destination)
            for filename, content in case["files"].items():
                assert (destination / filename).read_text() == content
                if filename.endswith(".py"):
                    compile(content, filename, "exec")
            assert (destination / "request.txt").read_text().strip() == case["prompt"]
        for destination in (ROOT, Path(directory) / next(iter(cases))):
            try:
                module.prepare(next(iter(cases)), destination)
            except ValueError:
                pass
            else:
                raise AssertionError("Unsafe destination accepted")
    print(f"PASS: package, {links} local links, 6 simulated hook paths, {len(cases)} fixture copies and destination guards")


if __name__ == "__main__":
    check()
