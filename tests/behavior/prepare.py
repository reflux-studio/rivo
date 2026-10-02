"""Materialize a model trial outside the repository; never executes a model."""
import argparse
import json
from pathlib import Path


def prepare(case_name, destination):
    cases = json.loads(Path(__file__).with_name("cases.json").read_text())
    case = cases[case_name]
    destination = Path(destination).resolve()
    repository = Path(__file__).resolve().parents[2]
    if destination == repository or repository in destination.parents:
        raise ValueError("Use an isolated directory outside the repository")
    if destination.exists() and any(destination.iterdir()):
        raise ValueError("Destination must be empty")
    for name in case["files"]:
        target = (destination / name).resolve()
        if destination not in target.parents:
            raise ValueError("Case path escapes destination")
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in case["files"].items():
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
    (destination / "request.txt").write_text(case["prompt"] + "\n", encoding="utf-8")
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case")
    parser.add_argument("destination")
    args = parser.parse_args()
    try:
        print(prepare(args.case, args.destination))
    except (ValueError, KeyError) as exc:
        parser.error(str(exc))
