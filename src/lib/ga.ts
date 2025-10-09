const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let isInitialized = false

type DataLayerItem = unknown[] | Record<string, unknown> | IArguments

declare global {
  interface Window {
    dataLayer: DataLayerItem[]
    gtag?: (...args: unknown[]) => void
  }
}

export const initGoogleAnalytics = () => {
  if (isInitialized || typeof window === 'undefined' || !GA_ID) {
    return
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"]`,
  )

  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_ID)

  isInitialized = true
}

export const googleAnalyticsId = GA_ID
