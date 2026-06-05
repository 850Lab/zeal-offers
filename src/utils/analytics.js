const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const ATTRIBUTION_STORAGE_KEY = 'zeal_landing_attribution'
const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'neighborhood',
  'offer',
]

let isInitialized = false
let hasTrackedLandingView = false

function isDevelopment() {
  return import.meta.env.DEV
}

function safeWindow() {
  return typeof window === 'undefined' ? null : window
}

function logAnalyticsEvent(eventName, params = {}) {
  if (isDevelopment()) {
    console.log('[analytics]', eventName, params)
  }
}

function readStoredAttribution() {
  const browserWindow = safeWindow()

  if (!browserWindow?.localStorage) {
    return {}
  }

  try {
    const storedValue = browserWindow.localStorage.getItem(ATTRIBUTION_STORAGE_KEY)

    return storedValue ? JSON.parse(storedValue) : {}
  } catch (error) {
    if (isDevelopment()) {
      console.warn('[analytics] Unable to read attribution data', error)
    }

    return {}
  }
}

function writeStoredAttribution(attribution) {
  const browserWindow = safeWindow()

  if (!browserWindow?.localStorage) {
    return
  }

  try {
    browserWindow.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution))
  } catch (error) {
    if (isDevelopment()) {
      console.warn('[analytics] Unable to store attribution data', error)
    }
  }
}

export function captureAttributionParams() {
  const browserWindow = safeWindow()

  if (!browserWindow) {
    return {}
  }

  const params = new URLSearchParams(browserWindow.location.search)
  const currentAttribution = {}

  ATTRIBUTION_PARAMS.forEach((paramName) => {
    const paramValue = params.get(paramName)

    if (paramValue) {
      currentAttribution[paramName] = paramValue
    }
  })

  const mergedAttribution = {
    ...readStoredAttribution(),
    ...currentAttribution,
  }

  if (Object.keys(currentAttribution).length > 0) {
    writeStoredAttribution(mergedAttribution)
  }

  return mergedAttribution
}

export function getStoredAttribution() {
  return readStoredAttribution()
}

export function initAnalytics() {
  const browserWindow = safeWindow()

  if (!browserWindow || isInitialized) {
    return
  }

  captureAttributionParams()

  if (!GA_MEASUREMENT_ID) {
    logAnalyticsEvent('ga_unavailable', {
      reason: 'Missing VITE_GA_MEASUREMENT_ID',
    })
    isInitialized = true
    return
  }

  browserWindow.dataLayer = browserWindow.dataLayer || []
  browserWindow.gtag =
    browserWindow.gtag ||
    function gtag() {
      browserWindow.dataLayer.push(arguments)
    }

  browserWindow.gtag('js', new Date())
  browserWindow.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Add Google Tag Manager container bootstrapping here later if needed.
  // Add Meta Pixel base code here later if needed.
  isInitialized = true
}

export function trackEvent(eventName, params = {}) {
  const browserWindow = safeWindow()
  const eventParams = {
    ...getStoredAttribution(),
    ...params,
  }

  logAnalyticsEvent(eventName, eventParams)

  try {
    if (browserWindow?.gtag && GA_MEASUREMENT_ID) {
      browserWindow.gtag('event', eventName, eventParams)
    }
  } catch (error) {
    if (isDevelopment()) {
      console.warn('[analytics] Unable to send event', eventName, error)
    }
  }
}

export function trackLandingView() {
  if (hasTrackedLandingView) {
    return
  }

  hasTrackedLandingView = true
  trackEvent('qr_landing_view', {
    landing_page: 'launch_offer',
  })
}
