import { useEffect, useRef } from 'react'
import { LANE, SEQ } from '../lib/data'
import { clamp, onScroll } from '../lib/scroll'
import type { site } from '../i18n/site'

type T = typeof site.zh

// 实施中的往来：箭头随滚动逐步画出（往回滚会收回），生命线随进度向下延伸
export default function Sequence({ t }: { t: T }) {
  const seq = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = seq.current
    if (!el) return
    const rows = Array.from(el.querySelectorAll<HTMLElement>('.r'))
    return onScroll(() => {
      const line = innerHeight * 0.74 // 阅读线：行的顶部越过它就开始画
      let last = 0
      rows.forEach((r, i) => {
        const p = clamp((line - r.getBoundingClientRect().top) / 72)
        r.style.setProperty('--p', p.toFixed(3))
        if (p > 0) last = i + p
      })
      el.style.setProperty('--lp', clamp(last / rows.length).toFixed(3))
    })
  }, [])

  return (
    <>
      <div className="sec">
        <div className="lab" data-reveal><b>§ 03</b><span>{t.seqLabel}</span></div>
        <div className="hd2" data-reveal>
          <h2>{t.seqTitle}</h2>
          <p className="lead">{t.seqSub}</p>
        </div>
      </div>
      <div className="seqwrap" data-reveal>
        <div className="seq" ref={seq}>
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
              <div key={i} className={`r${human ? ' h' : ''} ${b > a ? 'rt' : 'lf'}`}>
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
