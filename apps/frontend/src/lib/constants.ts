export const ROUTES = {
  home: '/',
  indicators: '/indicators',
  indicator: (id: string) => `/indicators/${id}`,
  dataSources: '/data-sources',
  dataSource: (id: string) => `/data-sources/${id}`,
  proposals: '/proposals',
  proposal: (id: string) => `/proposals/${id}`,
  newProposal: '/proposals/new',
  correlations: '/correlations',
  correlation: (id: string) => `/correlations/${id}`,
  news: '/news',
  login: '/login',
  register: '/register',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminEtl: '/admin/etl',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
