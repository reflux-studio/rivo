import { Fragment, useRef, useState } from 'react'
import type { site } from '../i18n/site'

type T = typeof site.zh

const CMD = {
  cc: ['/plugin marketplace add reflux-studio/rivo', '/plugin install rivo@rivo'],
  codex: ['codex plugin marketplace add reflux-studio/rivo', 'codex plugin add rivo@rivo']
}

// 安装步骤（Claude Code / Codex 切换）与可复制的开口示例
export default function Start({ t }: { t: T }) {
  const [inst, setInst] = useState<'cc' | 'codex'>('cc')
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const copy = (key: string, text: string) => {
    const done = () => {
      setCopied(key)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), 1600)
    }
    navigator.clipboard?.writeText(text).then(done, done) ?? done()
  }
  const label = (k: string) => (copied === k ? t.copied : t.copy)
  const steps = inst === 'cc' ? t.cc : t.cx

  return (
    <div className="start">
      <div data-reveal>
        <div className="sh">
          <b>{t.stInstall}</b>
          <div className="seg dark" role="group">
            <button type="button" aria-pressed={inst === 'cc'} onClick={() => setInst('cc')}>Claude Code</button>
            <button type="button" aria-pressed={inst === 'codex'} onClick={() => setInst('codex')}>Codex</button>
          </div>
        </div>
        {steps.map((x, i) => (
          <Fragment key={`${inst}-${i}`}>
            <div className="step">
              <i>0{i + 1}</i>
              <span>{x}</span>
            </div>
            {CMD[inst][i] && (
              <div className="cmd">
                <i>{inst === 'cc' ? '>' : '$'}</i>
                <code>{CMD[inst][i]}</code>
                <button type="button" aria-label={`${t.copy}: ${CMD[inst][i]}`} onClick={() => copy(`${inst}-${i}`, CMD[inst][i])}>{label(`${inst}-${i}`)}</button>
              </div>
            )}
          </Fragment>
        ))}
        <p className="env">{t.stEnv}</p>
      </div>
      <div>
        <div className="sh" data-reveal>
          <b>{t.stTry}</b>
        </div>
        {t.prompts.map((p, i) => (
          <div className={`pq${i ? '' : ' main'}`} key={p} data-reveal>
            <div>
              <small>{i ? t.tagMethod : t.tagDelivery}</small>
              <span>{p}</span>
            </div>
            <button type="button" aria-label={t.copy} onClick={() => copy(`p${i}`, p)}>{label(`p${i}`)}</button>
          </div>
        ))}
        <p className="note2" data-reveal>{t.stNote}</p>
      </div>
    </div>
  )
}
