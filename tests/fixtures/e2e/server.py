#!/usr/bin/env python3
"""Isolated browser fixture; state and fault switches live outside the repository."""
import argparse
import json
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PAGE = '''<!doctype html><html lang="zh"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>走访记录测试夹具</title><style>
body{font:16px system-ui;background:#f5f3ef;color:#242424;margin:0}
main{max-width:720px;margin:40px auto;padding:24px;background:white;border-radius:12px}
label{display:block;margin:16px 0}input,textarea{box-sizing:border-box;width:100%;padding:10px;font:inherit}
button{font:inherit;padding:9px 16px;cursor:pointer}article{border-top:1px solid #ccc;margin-top:24px;padding:16px 0}
.detail{padding:12px;background:#f5f3ef}#message{min-height:24px}h1{font-size:26px}
</style><main><h1>走访记录</h1><form id="form">
<label>供应商名称<input id="supplier" required></label>
<label>主访意见<textarea id="main-note" required></textarea></label>
<label>陪同意见<textarea id="companion-note" required></textarea></label>
<button>保存记录</button></form><p id="message" role="status"></p>
<button id="refresh">刷新记录</button><section id="records" aria-label="已保存记录"></section></main>
<script>
async function load(){
 const response=await fetch('/api/visits'); const rows=await response.json();
 const target=document.querySelector('#records');target.replaceChildren();
 for(const row of rows){const article=document.createElement('article');
 const title=document.createElement('h2');title.textContent=row.supplier;article.append(title);
 const detail=document.createElement('div');detail.className='detail';detail.hidden=true;
 const a=document.createElement('p');a.textContent='主访意见：'+row.main;
 const b=document.createElement('p');b.textContent='陪同意见：'+(row.companion??'');detail.append(a,b);
 if(!new URLSearchParams(location.search).has('hide_details')){
 const button=document.createElement('button');button.textContent='展开详情';
 button.onclick=()=>{detail.hidden=!detail.hidden;button.textContent=detail.hidden?'展开详情':'收起详情'};article.append(button);}
 article.append(detail);target.append(article);}
}
document.querySelector('#form').onsubmit=async event=>{event.preventDefault();
 const response=await fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({supplier:document.querySelector('#supplier').value,
 main:document.querySelector('#main-note').value,companion:document.querySelector('#companion-note').value})});
 document.querySelector('#message').textContent=response.ok?'保存成功':'保存失败';await load();};
document.querySelector('#refresh').onclick=load;load();
</script></html>'''


def serve(state_dir, port):
    state_dir.mkdir(parents=True, exist_ok=True)
    database = state_dir / 'records.sqlite'
    with sqlite3.connect(database) as db:
        db.execute('CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY, payload TEXT)')

    class Handler(BaseHTTPRequestHandler):
        def send(self, status, body, content_type='application/json; charset=utf-8'):
            data = body.encode() if isinstance(body, str) else json.dumps(body, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            if self.path.split('?')[0] == '/api/visits':
                with sqlite3.connect(database) as db:
                    rows = [json.loads(row[0]) for row in db.execute('SELECT payload FROM visits ORDER BY id')]
                self.send(200, rows)
            elif self.path.split('?')[0] == '/':
                self.send(200, PAGE, 'text/html; charset=utf-8')
            else:
                self.send(404, {'error': 'not found'})

        def do_POST(self):
            if self.path != '/api/visits':
                return self.send(404, {'error': 'not found'})
            try:
                row = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
            except (ValueError, TypeError):
                return self.send(400, {'error': 'invalid json'})
            if not isinstance(row, dict) or not all(isinstance(row.get(key), str) and row[key].strip() for key in ('supplier', 'main', 'companion')):
                return self.send(400, {'error': 'all fields required'})
            switches = state_dir / 'faults.json'
            if switches.exists() and json.loads(switches.read_text()).get('drop_companion'):
                row.pop('companion')
            with sqlite3.connect(database) as db:
                db.execute('INSERT INTO visits(payload) VALUES (?)', (json.dumps(row, ensure_ascii=False),))
            self.send(201, {'saved': True})

        def do_DELETE(self):
            if self.path != '/api/visits':
                return self.send(404, {'error': 'not found'})
            with sqlite3.connect(database) as db:
                db.execute('DELETE FROM visits')
            self.send(200, {'cleared': True})

    print(f'Fixture listening http://127.0.0.1:{port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--state-dir', type=Path, required=True)
    parser.add_argument('--port', type=int, default=4319)
    args = parser.parse_args()
    serve(args.state_dir, args.port)
