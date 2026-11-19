import { useEffect, useRef, useState } from 'react'
import { DEMO_STEPS } from '../lib/data'
import type { site } from '../i18n/site'

type T = typeof site.zh

// 首屏演示：按 讨论 → 方案 → 实施 → 知识 自动依次演进，也支持点击顶部标签直接查看对应阶段
export default function HeroDemo({ t }: { t: T }) {
  const stages = t.heroDemo.stages
  const [stage, setStage] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hc, setHc] = useState(0)
  const [hs, setHs] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const scene = stages[stage]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !auto) {
      setHc(scene.prompt.length)
      setHs(DEMO_STEPS)
      return
    }

    let c = 0
    let s = 0
    setHc(0)
    setHs(0)
    const charStep = Math.max(3, Math.ceil(scene.prompt.length / 26))

    const tick = () => {
      if (c < scene.prompt.length) {
        c = Math.min(scene.prompt.length, c + charStep)
        setHc(c)
        timer.current = setTimeout(tick, 22)
      } else if (s < DEMO_STEPS) {
        const d = s === 0 ? 350 : s === 4 ? 580 : s === 5 ? 720 : s === 6 ? 520 : 400
        timer.current = setTimeout(() => {
          setHs(++s)
          tick()
        }, d)
      } else {
        timer.current = setTimeout(() => {
          setStage((prev) => (prev + 1) % stages.length)
        }, 2400)
      }
    }

    tick()
    return () => clearTimeout(timer.current)
  }, [stages, stage, auto])

  const scene = stages[stage]
  const done = hc >= scene.prompt.length
  const cardCls = [
    'dcard',
    hs >= 5 ? 'on' : '',
    hs >= 6 ? (scene.cardMode === 'choice' ? 'pick' : 'both') : '',
    hs >= 7 ? 'stamped' : '',
    hs >= 8 ? 'done' : ''
  ].filter(Boolean).join(' ')

  const selectStage = (i: number) => {
    clearTimeout(timer.current)
    setAuto(false)
    setStage(i)
    setHc(stages[i].prompt.length)
    setHs(DEMO_STEPS)
  }

  const resumeAuto = () => {
    clearTimeout(timer.current)
    setAuto(true)
    setStage((prev) => (prev + 1) % stages.length)
  }

  return (
    <div className="demo">
      <div className="back" aria-hidden="true" />
      <div className="win">
        <div className="bar">
          <i aria-hidden="true" />
          <span>{t.heroDemo.title}</span>
          {!auto && (
            <button type="button" className="demo-play" onClick={resumeAuto}>
              {t.heroDemo.replay}
            </button>
          )}
          <span className="demo-sk">rivo:{scene.skill}</span>
        </div>
        <div className="tabs" role="tablist" aria-label={t.heroDemo.tabsLabel}>
          {stages.map((st, i) => (
            <button
              key={st.skill}
              type="button"
              role="tab"
              aria-selected={i === stage}
              onClick={() => selectStage(i)}
            >
              <b>0{i + 1}</b>
              <span>{st.tab}</span>
            </button>
          ))}
        </div>
        <div className="body" role="tabpanel">
          <div className="you">
            <b>{t.you}</b>
            <span>
              <span>{scene.prompt.slice(0, hc)}</span>
              {(!done || hs === 0) && <i className="caret" aria-hidden="true" />}
            </span>
          </div>
          <div className="found">
            {scene.lines.map(([k, v], i) => (
              <div key={`${stage}-${k}`} className={hs >= i + 2 ? 'on' : ''}>
                <em>✓</em>
                <span>
                  <small>{k}</small>　{v}
                </span>
              </div>
            ))}
          </div>
          <div className={cardCls}>
            <div className="hd">
              <span>{scene.cardHead}</span>
              <span>{scene.cardStep}</span>
            </div>
            <div className="q">{scene.cardTitle}</div>
            <div className="opts">
              <div className="opt">
                <b>
                  <i>{scene.opt1[0]}</i>
                  {scene.opt1[1]}
                </b>
                <span>{scene.opt1[2]}</span>
              </div>
              <div className="opt">
                <b>
                  <i>{scene.opt2[0]}</i>
                  {scene.opt2[1]}
                </b>
                <span>{scene.opt2[2]}</span>
              </div>
            </div>
            <div className="stamp" aria-hidden="true">
              <b>{scene.stamp}</b>
              <small>{scene.stampDate}</small>
            </div>
          </div>
          <div className={`wrote${hs >= 8 ? ' on' : ''}`}>
            <i>→</i>
            <span>{scene.wrote}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
