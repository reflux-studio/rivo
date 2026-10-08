import { useEffect, useRef, useState } from 'react'
import { LANE, SEQ } from '../lib/data'
import type { site } from '../i18n/site'

type T = typeof site.zh

// 实施中的往来：进入视口后逐步画出箭头，可重放
export default function Sequence({ t }: { t: T }) {
  const [step, setStep] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)

  const play = () => {
    clearInterval(timer.current)
    setStep(0)
    let n = 0
    timer.current = setInterval(() => {
      setStep(++n)
      if (n >= SEQ.length) clearInterval(timer.current)
    }, 520)
  }

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setStep(SEQ.length)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play()
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearInterval(timer.current)
    }
  }, [])

  return (
    <>
      <div className="sec">
        <div className="lab" data-reveal><b>§ 03</b><span>{t.seqLabel}</span></div>
        <div className="hd2" data-reveal style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ flex: '1 1 440px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2>{t.seqTitle}</h2>
            <p className="lead">{t.seqSub}</p>
          </div>
          <button type="button" className="replay" onClick={play}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>{t.replay}</span>
          </button>
        </div>
      </div>
      <div className="seqwrap" ref={wrap} data-reveal>
        <div className="seq">
          <div className="cols" aria-hidden="true">
            <div /><div /><div /><div />
          </div>
          <div className="lanes">
            {t.lanes.map((n) => (
              <div key={n}>
                <span>{n}</span>
              </div>
            ))}
          </div>
          {SEQ.map(([f, to], i) => {
            const a = LANE[f]
            const b = LANE[to]
            const lo = Math.min(a, b)
            const hi = Math.max(a, b)
            const span = hi - lo + 1
            const human = f === 'you' || to === 'you'
            return (
              <div key={i} className={`r${human ? ' h' : ''} ${b > a ? 'rt' : 'lf'}${step > i ? ' on' : ''}`}>
                <div style={{ gridColumn: `${lo + 1} / ${hi + 2}`, padding: `0 ${(100 / (2 * span)).toFixed(2)}%` }}>
                  <span className="t">
                    <i>{String(i + 1).padStart(2, '0')}</i>
                    {t.seq[i]}
                  </span>
                  <div className="ar"><b /><u /><s /></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
