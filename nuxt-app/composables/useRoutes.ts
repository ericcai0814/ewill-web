// Route configuration mapping URL slugs to content slugs and product names

export interface RouteConfig {
  urlSlug: string
  contentSlug: string
  productName: string
}

// Security Solutions products
export const securitySolutionsRoutes: Record<string, RouteConfig> = {
  'palo-alto-networks': {
    urlSlug: 'palo-alto-networks',
    contentSlug: 'palo_alto',
    productName: 'Palo Alto Networks'
  },
  'fortinet': {
    urlSlug: 'fortinet',
    contentSlug: 'fortinet',
    productName: 'Fortinet'
  },
  'acunetix': {
    urlSlug: 'acunetix',
    contentSlug: 'acunetix',
    productName: 'Acunetix'
  },
  'security-scorecard': {
    urlSlug: 'security-scorecard',
    contentSlug: 'security_scorecard',
    productName: 'SecurityScorecard'
  },
  'vicarius-vrx': {
    urlSlug: 'vicarius-vrx',
    contentSlug: 'vicarius_vrx',
    productName: 'Vicarius vRX'
  },
  'array-networks': {
    urlSlug: 'array-networks',
    contentSlug: 'array',
    productName: 'Array Networks'
  },
  'logsec': {
    urlSlug: 'logsec',
    contentSlug: 'logsec',
    productName: 'LOGSEC'
  },
  'endpoint-security': {
    urlSlug: 'endpoint-security',
    contentSlug: 'ist',
    productName: 'IST 端點安全'
  }
}

// Smart Manufacturing products
export const smartManufacturingRoutes: Record<string, RouteConfig> = {
  'mes': {
    urlSlug: 'mes',
    contentSlug: 'mes',
    productName: 'MES 製造執行系統'
  },
  'wms': {
    urlSlug: 'wms',
    contentSlug: 'wms',
    productName: 'WMS 智慧倉儲'
  },
  'scm': {
    urlSlug: 'scm',
    contentSlug: 'scm',
    productName: 'SCM 智慧供應鏈'
  },
  'data-platform': {
    urlSlug: 'data-platform',
    contentSlug: 'data_middleware',
    productName: '數據中台'
  }
}

// Infrastructure products
export const infrastructureRoutes: Record<string, RouteConfig> = {
  'vmware': {
    urlSlug: 'vmware',
    contentSlug: 'vmware',
    productName: 'VMware'
  }
}

// Events
export const eventsRoutes: Record<string, RouteConfig> = {
  'smart-manufacturing-webinar-2025': {
    urlSlug: 'smart-manufacturing-webinar-2025',
    contentSlug: 'event_20251118',
    productName: '智慧製造研討會'
  },
  'passwordless-identity-protection': {
    urlSlug: 'passwordless-identity-protection',
    contentSlug: 'event_20251124',
    productName: '無密碼身分防護'
  }
}
