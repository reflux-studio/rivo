import { useRef, useState } from 'react'
import type { site } from '../i18n/site'

export default function Collaboration({ t }: { t: typeof site.zh }) {
  const [selected, setSelected] = useState(0)
  const stageButtons = useRef<Array<HTMLButtonElement | null>>([])
  const step = t.deliverySteps[selected]
  const returnTo = step.returnTo

  function revisit(index: number) {
    setSelected(index)
    stageButtons.current[index]?.focus()
  }

  return <div className="delivery-journey">
    <div className="journey-stages" role="group" aria-label={t.stageLabel}>
      {t.deliverySteps.map((item, index) => <button
        type="button" key={item.phase} aria-pressed={selected === index}
        ref={element => { stageButtons.current[index] = element }}
        aria-controls="delivery-detail" onClick={() => setSelected(index)}
      >
        <span className="journey-number">0{index + 1}</span>
        <span><strong>{item.phase}</strong><small>{item.caption}</small></span>
      </button>)}
    </div>
    <div className="journey-paper" id="delivery-detail" aria-live="polite" aria-atomic="true">
      <div className="request-head"><span>{t.example}</span><span>0{selected + 1} / {step.actor}</span></div>
      <h3>{step.title}</h3>
      <p className="journey-body">{step.body}</p>
      <dl className="journey-work">
        <div><dt>{step.workLabel}</dt><dd>{step.ai}</dd></div>
        <div><dt>{t.humanWork}</dt><dd>{step.human}</dd></div>
        <div><dt>{t.results}</dt><dd>{step.result}</dd></div>
      </dl>
      <div className="journey-feedback">
        <span className="tiny-label">↳ {t.feedbackLabel}</span>
        <p>{step.feedback}</p>
        {returnTo !== null && <button type="button" onClick={() => revisit(returnTo)}>{step.returnLabel} <span aria-hidden="true">↶</span></button>}
      </div>
    </div>
  </div>
}
