import { useEffect, useRef, useState } from 'react'
import { LANE, SEQ, SEQ_GROUPS } from '../lib/data'
import { clamp, onScroll } from '../lib/scroll'
import type { site } from '../i18n/site'

type T = typeof site.zh

const NAV = 60 // 顶部导航高度，与 .stick 的 top 一致
const STEP_VH = 22 // 固定时每一步占用的滚动距离

// 实施中的往来：各步按滚动进度依次生长，箭头头部始终在最前端；往回滚会收回。
// 整块放得进视口时固定并居中，随滚动逐步画完；放不下时把进度分摊到整张图滚过的全程
export default function Sequence({ t }: { t: T }) {
  const [pinned, setPinned] = useState(false)
  const outer = useRef<HTMLDivElement>(null)
  const stick = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const seq = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => setPinned(innerWidth >= 900 && !!inner.current && inner.current.offsetHeight + 40 <= innerHeight - NAV)
    sync()
    addEventListener('resize', sync)
    return () => removeEventListener('resize', sync)
  }, [])

  useEffect(() => {
    const el = seq.current
    const o = outer.current
    const s = stick.current
    if (!el || !o || !s) return
    const rows = Array.from(el.querySelectorAll<HTMLElement>('.r'))
    return onScroll(() => {
      let g: number
      if (pinned) {
        g = clamp((NAV - o.getBoundingClientRect().top) / (o.offsetHeight - s.offsetHeight))
      } else {
        // 顶部到 85% 处开始，底部到 55% 处画完
        const r = el.getBoundingClientRect()
        g = clamp((innerHeight * 0.85 - r.top) / (innerHeight * 0.3 + r.height))
      }
      rows.forEach((row, i) => row.style.setProperty('--p', clamp(g * rows.length - i).toFixed(3)))
      el.style.setProperty('--lp', g.toFixed(3))
    })
  }, [pinned])

  return (
    <div className="pin" ref={outer} style={pinned ? { height: `calc(100vh - ${NAV}px + ${SEQ.length * STEP_VH}vh)` } : undefined}>
      <div className={pinned ? 'stick' : undefined} ref={stick}>
        <div className="stick-in" ref={inner}>
          <div className="sec">
            <div className="lab"><b>§ 03</b><span>{t.seqLabel}</span></div>
            <div className="hd2">
              <h2>{t.seqTitle}</h2>
              <p className="lead">{t.seqSub}</p>
            </div>
          </div>
          <div className="seqwrap">
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
              {SEQ_GROUPS.map((group, groupIndex) => (
                <div key={group.start} className={`seq-block${groupIndex === 0 ? ' intro' : ''}${groupIndex === 2 || groupIndex === 3 ? ' conditional' : ''}`}>
                  {groupIndex > 0 && <div className="seq-group-title">{t.seqGroups[groupIndex - 1]}</div>}
                  {SEQ.slice(group.start, group.end).map(([f, to], offset) => {
                    const i = group.start + offset
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
                            {t.seq[i]}
                          </span>
                          <div className="ar"><b /><u /><s /></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
