import { useState } from 'react'
import type { site } from '../i18n/site'

export default function Collaboration({ t }: { t: typeof site.zh }) {
  const [selected, setSelected] = useState(0)
  const scenario = t.scenarios[selected]
  return <div className="collaboration">
    <div className="scenario-switch" role="group" aria-label={t.scenarioLabel}>
      {t.scenarios.map((item, index) => <button type="button" key={item.tab} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.tab}<span aria-hidden="true">↗</span></button>)}
    </div>
    <div className="scenario" aria-live="polite" aria-atomic="true">
      <div className="request-head"><span>{t.request}</span><span>{scenario.from}<i aria-hidden="true"> → </i>{scenario.to}</span></div>
      <blockquote>{scenario.question}</blockquote>
      <p className="scenario-basis">{scenario.basis}</p>
      <div className="response"><span className="tiny-label">{t.response}</span><p>{scenario.action}</p><div className="artifact-actions">{scenario.artifacts.map(item => <span key={item}>{item}</span>)}</div></div>
    </div>
  </div>
}
