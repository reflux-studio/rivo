import { useEffect, useRef, useState } from 'react'
import { GH, STAGE_SKILLS } from '../lib/data'
import { clamp, onScroll } from '../lib/scroll'
import type { site } from '../i18n/site'

type T = typeof site.zh

const NAV = 60 // 顶部导航高度，与 .stick 的 top 一致

// 四阶段：宽屏时固定在屏幕上，随滚动推进 01 → 04；窄屏或矮屏退回手动切换
export default function Stages({ t }: { t: T }) {
  const n = t.stages.length
  const [stage, setStage] = useState(0)
  const [pinned, setPinned] = useState(false)
  const outer = useRef<HTMLDivElement>(null)
  const stick = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  // 整块（标题 + 标签 + 面板）放得进视口才固定，否则按普通文档流排版
  useEffect(() => {
    const sync = () => setPinned(innerWidth >= 900 && !!inner.current && inner.current.offsetHeight + 40 <= innerHeight - NAV)
    sync()
    addEventListener('resize', sync)
    return () => removeEventListener('resize', sync)
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
      const x = clamp((NAV - o.getBoundingClientRect().top) / (o.offsetHeight - s.offsetHeight)) * n
      const i = Math.min(n - 1, Math.floor(x))
      s.style.setProperty('--w', (x - i).toFixed(3))
      setStage(i)
    })
  }, [pinned, n])

  const go = (i: number) => {
    const o = outer.current
    const s = stick.current
    if (!pinned || !o || !s) return setStage(i)
    const range = o.offsetHeight - s.offsetHeight
    scrollTo({ top: o.getBoundingClientRect().top + scrollY - NAV + ((i + 0.5) / n) * range, behavior: 'smooth' })
  }

  const c = t.stages[stage]
  const skill = STAGE_SKILLS[stage]
  return (
    <div className="pin" ref={outer} style={pinned ? { height: `calc(100vh - ${NAV}px + ${n * 45}vh)` } : undefined}>
      <div className={pinned ? 'stick' : undefined} ref={stick}>
        <div className="stick-in" ref={inner}>
        <div className="sec">
          <div className="lab"><b>§ 02</b><span>{t.navHow}</span></div>
          <div className="hd2">
            <h2>{t.howTitle}</h2>
            <p className="lead">{t.howSub}</p>
          </div>
        </div>
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
    </div>
  )
}
