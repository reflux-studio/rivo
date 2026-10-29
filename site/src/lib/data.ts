export const REPO = 'https://github.com/reflux-studio/rivo'
export const GH = `${REPO}/blob/main/skills/`
const domains: Record<string, string> = {
  'discovering-products': 'product', 'market-research': 'product', 'competitive-analysis': 'product', 'user-research': 'product', 'writing-prds': 'product', 'designing-products': 'product', 'reviewing-metrics': 'product',
  'converging': 'development', 'writing-plans': 'development', 'implementing-plans': 'development', 'systematic-debugging': 'development', 'test-driven-development': 'development',
  'designing-tests': 'testing', 'testing': 'testing', 'reporting-defects': 'testing'
}
export const skillUrl = (name: string) => domains[name] ? `${REPO}/blob/main/plugins/rivo-${domains[name]}/skills/${name}/SKILL.md` : `${GH}${name}/SKILL.md`
