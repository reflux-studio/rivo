import { useEffect, useRef, useState } from 'react'
import { DEMO_STEPS } from '../lib/data'
import type { site } from '../i18n/site'

type T = typeof site.zh

// 首屏演示：打字 → 逐条核对 → 弹出决定卡 → 盖章 → 写入 ADR，循环播放
export default function HeroDemo({ t }: { t: T }) {
  const [hc, setHc] = useState(0)
  const [hs, setHs] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHc(t.prompt.length)
      setHs(DEMO_STEPS)
      return
    }
    let c = 0
    let s = 0
    const tick = () => {
      if (c < t.prompt.length) {
        c += 2
        setHc(c)
        timer.current = setTimeout(tick, 26)
      } else if (s < DEMO_STEPS) {
        const d = s === 0 ? 500 : s === 4 ? 1100 : s === 5 ? 1200 : s === 6 ? 700 : 650
        timer.current = setTimeout(() => {
          setHs(++s)
          tick()
        }, d)
      } else {
        timer.current = setTimeout(() => {
          c = 0
          s = 0
          setHc(0)
          setHs(0)
          tick()
        }, 4200)
      }
    }
    tick()
    return () => clearTimeout(timer.current)
  }, [t])

  const done = hc >= t.prompt.length
  return (
    <div className="demo" aria-hidden="true">
      <div className="back" />
      <div className="win">
        <div className="bar">
          <i />
          <span>{t.demoTitle}</span>
          <span style={{ flex: 'none' }}>rivo:converging</span>
        </div>
        <div className="body">
          <div className="you">
            <b>{t.you}</b>
            <span>
              <span>{t.prompt.slice(0, hc)}</span>
              <i className="caret" style={{ opacity: done && hs > 0 ? 0 : 1 }} />
            </span>
          </div>
          <div className="found">
            {t.lines.map(([k, v], i) => (
              <div key={k} className={hs >= i + 2 ? 'on' : ''}>
                <em>✓</em>
                <span>
                  <small>{k}</small>　{v}
                </span>
              </div>
            ))}
          </div>
          <div className={`dcard${hs >= 5 ? ' on' : ''}${hs >= 6 ? ' pick' : ''}${hs >= 7 ? ' stamped' : ''}${hs >= 8 ? ' done' : ''}`}>
            <div className="hd">
              <span>{t.dNeed}</span>
              <span>1 / 2</span>
            </div>
            <div className="q">{t.dQ}</div>
            <div className="opts">
              <div className="opt">
                <b>
                  <i>A</i>
                  {t.dA}
                </b>
                <span>{t.dAd}</span>
              </div>
              <div className="opt">
                <b>
                  <i>B</i>
                  {t.dB}
                </b>
                <span>{t.dBd}</span>
              </div>
            </div>
            <div className="stamp">
              <b>{t.stamp}</b>
              <small>2026·10·08</small>
            </div>
          </div>
          <div className={`wrote${hs >= 8 ? ' on' : ''}`}>
            <i>→</i>
            <span>{t.dWritten}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
