import { useEffect, useRef, useState } from 'react'
import { GH, STAGE_SKILLS } from '../lib/data'
import { clamp, onScroll } from '../lib/scroll'
import type { site } from '../i18n/site'

type T = typeof site.zh

// 四阶段：宽屏时固定在屏幕上，随滚动推进 01 → 04；窄屏或矮屏退回手动切换
export default function Stages({ t }: { t: T }) {
  const n = t.stages.length
  const [stage, setStage] = useState(0)
  const [pinned, setPinned] = useState(false)
  const outer = useRef<HTMLDivElement>(null)
  const stick = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = matchMedia('(min-width: 900px) and (min-height: 720px)')
    const sync = () => setPinned(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // 滚动进度 → 当前阶段与阶段内进度（驱动进度条）
  useEffect(() => {
    const s = stick.current
    if (!pinned || !s) {
      s?.style.removeProperty('--w')
      return
    }
    return onScroll(() => {
      const o = outer.current
      if (!o) return
      const top = parseFloat(getComputedStyle(s).top) || 0
      const x = clamp((top - o.getBoundingClientRect().top) / (o.offsetHeight - s.offsetHeight)) * n
      const i = Math.min(n - 1, Math.floor(x))
      s.style.setProperty('--w', (x - i).toFixed(3))
      setStage(i)
    })
  }, [pinned, n])

  const go = (i: number) => {
    const o = outer.current
    const s = stick.current
    if (!pinned || !o || !s) return setStage(i)
    const top = parseFloat(getComputedStyle(s).top) || 0
    const range = o.offsetHeight - s.offsetHeight
    scrollTo({ top: o.getBoundingClientRect().top + scrollY - top + ((i + 0.5) / n) * range, behavior: 'smooth' })
  }

  const c = t.stages[stage]
  const skill = STAGE_SKILLS[stage]
  return (
    <div className="pin" ref={outer} data-reveal style={pinned ? { height: `${n * 45 + 40}vh` } : undefined}>
      <div className={pinned ? 'stick' : 'stage-flow'} ref={stick}>
        <div className="track">
          <div className="dash" aria-hidden="true" />
          <div className="g" role="tablist">
            {t.stages.map((s, i) => (
              <button key={s.name} type="button" className="st" role="tab" aria-selected={i === stage} onClick={() => go(i)}>
                <span className="n">0{i + 1}</span>
                <span className="nm">{s.name}</span>
                <span className="pg">
                  <i />
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="panel" key={stage} role="tabpanel">
          <div className="rows">
            <div className="row">
              <span>{t.colAi}</span>
              <span className="ai">{c.ai}</span>
            </div>
            <div className="row you">
              <span>{t.colYou}</span>
              <span className="yo">{c.you}</span>
            </div>
            <div className="row">
              <span style={{ paddingTop: 6 }}>{t.colLeave}</span>
              <div className="chips">
                {c.leaves.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>
            <div className="row">
              <span>{t.colSkill}</span>
              <a href={`${GH}${skill}/SKILL.md`} target="_blank" rel="noopener">
                rivo:{skill} ↗
              </a>
            </div>
          </div>
          <div className="file">
            <div className="hd">
              <span>{c.file}</span>
              <span>.rivo/</span>
            </div>
            <div className="doc">
              {c.doc.map(([k, x], i) => (
                <div key={i} className={k}>
                  {x || ' '}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
