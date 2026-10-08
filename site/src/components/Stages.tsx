import { useEffect, useState } from 'react'
import { GH, STAGE_SKILLS } from '../lib/data'
import type { site } from '../i18n/site'

type T = typeof site.zh

// 四阶段切换：每 6.5s 自动轮播，用户点击后停止自动播放
export default function Stages({ t }: { t: T }) {
  const [stage, setStage] = useState(0)
  const [auto, setAuto] = useState(true)
  const [fade, setFade] = useState(false)
  const [reduced, setReduced] = useState(true)

  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])

  const go = (i: number, byAuto = false) => {
    if (!byAuto) setAuto(false)
    if (i === stage) return
    setFade(true)
    setTimeout(() => {
      setStage(i)
      setFade(false)
    }, 180)
  }

  useEffect(() => {
    if (!auto || reduced) return
    const id = setTimeout(() => go((stage + 1) % t.stages.length, true), 6500)
    return () => clearTimeout(id)
  })

  const c = t.stages[stage]
  const skill = STAGE_SKILLS[stage]
  return (
    <>
      <div className="track" data-reveal>
        <div className="dash" aria-hidden="true" />
        <div className="g" role="tablist">
          {t.stages.map((s, i) => (
            <button key={s.name} type="button" className="st" role="tab" aria-selected={i === stage} onClick={() => go(i)}>
              <span className="n">0{i + 1}</span>
              <span className="nm">{s.name}</span>
              <span className="pg">
                <i key={`${i}-${auto}`} className={auto && !reduced ? 'run' : ''} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className={`panel${fade ? ' fade' : ''}`} role="tabpanel" data-reveal>
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
    </>
  )
}
