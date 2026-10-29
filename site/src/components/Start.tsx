import { useEffect, useRef, useState } from 'react'
import type { site } from '../i18n/site'

type T = typeof site.zh
const CMD = {
  cc: ['/plugin marketplace add reflux-studio/rivo', '/plugin install rivo@rivo'],
  codex: ['codex plugin marketplace add reflux-studio/rivo', 'codex plugin add rivo@rivo']
}
export default function Start({ t }: { t: T }) {
  const [host, setHost] = useState<'cc' | 'codex'>('cc')
  const [role, setRole] = useState(1)
  const [feedback, setFeedback] = useState<{ key: string; ok: boolean } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const domain = t.roles[role].package
  const commands = [...CMD[host], host === 'cc' ? `/plugin install ${domain}@rivo` : `codex plugin add ${domain}@rivo`]
  const steps = host === 'cc' ? t.cc : t.cx
  async function copy(key: string, text: string) {
    let ok = false
    try { await navigator.clipboard.writeText(text); ok = true } catch { /* Show an honest failure state. */ }
    setFeedback({ key, ok }); clearTimeout(timer.current)
    timer.current = setTimeout(() => setFeedback(null), 2000)
  }
  const label = (key: string) => feedback?.key === key ? (feedback.ok ? t.copied : t.copyFailed) : t.copy
  return <div className="install-grid">
    <div className="install-console">
      <div className="console-head"><span>{t.stInstall}</span><div className="host-switch" role="group" aria-label="Coding agent">{(['cc', 'codex'] as const).map(id => <button type="button" key={id} aria-pressed={host === id} onClick={() => { setHost(id); setFeedback(null) }}>{id === 'cc' ? 'Claude Code' : 'Codex'}</button>)}</div></div>
      <div className="install-role"><span className="tiny-label">{t.stDomain}</span><div role="group" aria-label={t.stDomain}>{t.roles.map((r, index) => <button type="button" key={r.id} aria-pressed={index === role} onClick={() => { setRole(index); setFeedback(null) }}>{r.name}</button>)}</div></div>
      <ol className="install-steps">{commands.map((cmd, i) => {
        const key = `${host}-${domain}-${i}`
        return <li key={i}><span className="step-title">{steps[i]}</span><div className="command"><code>{cmd}</code><button type="button" aria-label={`${t.copy}: ${cmd}`} onClick={() => copy(key, cmd)}>{label(key)}</button></div></li>
      })}</ol>
      <p className="install-note">{t.stEnv}</p>
    </div>
    <div className="prompt-panel"><span className="tiny-label">{t.stTry} / {t.roles[role].name}</span><p>{steps[3]}</p><div className="prompt-example"><span aria-hidden="true">↳</span><blockquote>{t.prompts[role]}</blockquote><button type="button" onClick={() => copy(`prompt-${role}`, t.prompts[role])}>{label(`prompt-${role}`)}</button></div><p className="muted">{t.stNote}</p><div role="status" className="copy-status">{feedback ? feedback.ok ? t.copied : t.copyFailed : ''}</div></div>
  </div>
}
