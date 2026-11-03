#!/usr/bin/env python3
"""Append one request index row on a local filesystem supporting O_APPEND."""
import argparse
from datetime import datetime
import json
import os
from pathlib import Path


def append(issue, sender, recipient, record, at):
    issue = Path(issue).resolve(strict=True)
    detail = (issue.parent / record).resolve(strict=True)
    detail.relative_to(issue.parent)
    if not detail.is_file():
        raise ValueError('request detail is not a file')
    for value in (sender, recipient, record, at):
        if any(c in value for c in '\n\r|[]()'):
            raise ValueError('index values contain unsafe Markdown characters')
    if datetime.fromisoformat(at).utcoffset() is None:
        raise ValueError('request time must include a timezone')
    original = issue.read_text()
    if not original.endswith('\n'):
        raise ValueError('issue index must end with a newline before concurrent append')
    if '| 协作记录 |' not in original:
        raise ValueError('issue must end with the shared collaboration index table')
    if f']({record})' in original:
        return {'appended': False, 'reason': 'record already indexed'}
    row = f'| {at} | {sender} | {recipient} | [{detail.stem}]({record}) |\n'.encode()
    fd = os.open(issue, os.O_WRONLY | os.O_APPEND)
    try:
        written = os.write(fd, row)
        if written != len(row):
            raise OSError('partial append; inspect index before any retry')
    finally:
        os.close(fd)
    if f']({record})' not in issue.read_text():
        raise OSError('appended record cannot be verified')
    return {'appended': True, 'record': record}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('issue')
    parser.add_argument('--sender', required=True)
    parser.add_argument('--recipient', required=True)
    parser.add_argument('--record', required=True)
    parser.add_argument('--at', required=True, help='ISO time with timezone supplied by caller')
    args = parser.parse_args()
    print(json.dumps(append(args.issue, args.sender, args.recipient, args.record, args.at), ensure_ascii=False))
