// 在 rAF 里合并 scroll / resize 回调；返回取消函数
export function onScroll(cb: () => void) {
  let raf = 0
  const run = () => {
    raf = 0
    cb()
  }
  const h = () => {
    if (!raf) raf = requestAnimationFrame(run)
  }
  addEventListener('scroll', h, { passive: true })
  addEventListener('resize', h)
  cb()
  return () => {
    removeEventListener('scroll', h)
    removeEventListener('resize', h)
    cancelAnimationFrame(raf)
  }
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
