import { useState, type CSSProperties } from 'react'
import type { site } from '../i18n/site'

type T = typeof site.zh
type DocTab = 'plan' | 'test' | 'wiki'

// 产物章节浏览：在技术方案 plan.md、灰盒测试方案 test-plan.md 与知识库 Wiki 之间切换
export default function ArtifactsToc({ t }: { t: T }) {
  const [doc, setDoc] = useState<DocTab>('plan')
  const items = doc === 'plan' ? t.chapters : doc === 'test' ? t.testChapters : t.wikiChapters
  const cap = doc === 'plan' ? t.tocCap : doc === 'test' ? t.testTocCap : t.wikiTocCap

  return (
    <>
      <div className="cap">
        <div className="seg" role="tablist" aria-label={t.tocSwitchLabel}>
          <button type="button" role="tab" aria-selected={doc === 'plan'} onClick={() => setDoc('plan')}>plan.md</button>
          <button type="button" role="tab" aria-selected={doc === 'test'} onClick={() => setDoc('test')}>test-plan.md</button>
          <button type="button" role="tab" aria-selected={doc === 'wiki'} onClick={() => setDoc('wiki')}>knowledge/</button>
        </div>
        <span>{cap}</span>
      </div>
      {items.map(([title, desc], i) => (
        <div className="ch" key={`${doc}-${title}`} style={{ '--i': i } as CSSProperties}>
          <i>{i + 1}</i>
          <b>{title}</b>
          <u aria-hidden="true" />
          <span>{desc}</span>
        </div>
      ))}
    </>
  )
}
