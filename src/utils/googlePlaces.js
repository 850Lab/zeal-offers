const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

let googlePlacesPromise

function isDevelopment() {
  return import.meta.env.DEV
}

function getBrowserWindow() {
  return typeof window === 'undefined' ? null : window
}

function loadGooglePlacesScript() {
  const browserWindow = getBrowserWindow()

  if (!browserWindow || !GOOGLE_MAPS_API_KEY) {
    if (isDevelopment() && !GOOGLE_MAPS_API_KEY) {
      console.info('[places] Missing VITE_GOOGLE_MAPS_API_KEY; address autocomplete disabled.')
    }

    return Promise.resolve(null)
  }

  if (browserWindow.google?.maps?.places) {
    return Promise.resolve(browserWindow.google)
  }

  if (googlePlacesPromise) {
    return googlePlacesPromise
  }

  googlePlacesPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[data-google-places="true"]')

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(browserWindow.google ?? null), { once: true })
      existingScript.addEventListener('error', () => resolve(null), { once: true })
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.dataset.googlePlaces = 'true'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.addEventListener('load', () => resolve(browserWindow.google ?? null), { once: true })
    script.addEventListener('error', () => {
      if (isDevelopment()) {
        console.warn('[places] Google Places failed to load.')
      }

      resolve(null)
    }, { once: true })

    document.head.appendChild(script)
  })

  return googlePlacesPromise
}

export async function setupAddressAutocomplete(inputElement, onAddressSelect) {
  if (!inputElement) {
    return undefined
  }

  const google = await loadGooglePlacesScript()

  if (!google?.maps?.places) {
    return undefined
  }

  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    componentRestrictions: { country: 'us' },
    fields: ['formatted_address', 'name', 'place_id'],
    types: ['address'],
  })

  const listener = autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()

    onAddressSelect({
      formattedAddress: place.formatted_address || inputElement.value,
      name: place.name || '',
      placeId: place.place_id || '',
    })
  })

  return () => listener.remove()
}
