import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  beforeAfterServices,
  businessConfig,
  customerReviews,
  formSettings,
  heroTrustIndicators,
  offerPackages,
  propertyDetailOptions,
  reviewConfig,
  teamMembers,
  trustItems,
} from './data/landingPage'
import {
  captureAttributionParams,
  initAnalytics,
  trackEvent,
  trackLandingView,
} from './utils/analytics'
import { setupAddressAutocomplete } from './utils/googlePlaces'

function getMinimumPreferredDateTime() {
  const date = new Date()
  date.setHours(date.getHours() + 2)
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0)

  const timezoneOffset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function Logo() {
  return (
    <a className="logo-lockup" href="#top" aria-label="Zeal Power Washing home">
      {businessConfig.logoSrc ? (
        <img src={businessConfig.logoSrc} alt={businessConfig.companyName} />
      ) : (
        <>
          <span className="logo-mark">Z</span>
          <span>
            <strong>Zeal</strong>
            <small>Power Washing LLC</small>
          </span>
        </>
      )}
    </a>
  )
}

function HeroVideo() {
  return (
    <div className="video-panel" aria-label="Zeal Power Washing video">
      {/* Add a self-hosted campaign video URL in businessConfig.videoSrc. */}
      {businessConfig.videoSrc ? (
        <video
          controls
          playsInline
          preload="metadata"
          poster={businessConfig.videoPosterSrc || undefined}
          src={businessConfig.videoSrc}
        />
      ) : (
        <button className="video-play-card" type="button" aria-label="Play Zeal Power Washing video">
          <span className="play-button" aria-hidden="true"></span>
          <span className="video-brand">Zeal Power Washing</span>
          <strong>Watch this before you book</strong>
        </button>
      )}
    </div>
  )
}

function TransformationVisual() {
  const featuredTransformation =
    beforeAfterServices.find((service) => service.name === 'Driveway') ?? beforeAfterServices[0]
  const animationFrameRef = useRef(null)
  const isDraggingRef = useRef(false)
  const positionRef = useRef(50)
  const sliderRef = useRef(null)

  function setVisualSliderPosition(position) {
    positionRef.current = position

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      sliderRef.current?.style.setProperty('--hero-slider-position', `${position}%`)
    })
  }

  function getPointerPosition(event) {
    const slider = sliderRef.current

    if (!slider) {
      return positionRef.current
    }

    const sliderBounds = slider.getBoundingClientRect()
    const nextPosition = ((event.clientX - sliderBounds.left) / sliderBounds.width) * 100

    return Math.min(95, Math.max(5, nextPosition))
  }

  function handlePointerDown(event) {
    isDraggingRef.current = true
    setVisualSliderPosition(getPointerPosition(event))
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  function handlePointerMove(event) {
    if (!isDraggingRef.current) {
      return
    }

    setVisualSliderPosition(getPointerPosition(event))
  }

  function handlePointerUp(event) {
    isDraggingRef.current = false

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <aside className="hero-transformation" aria-label="Before and after transformation example">
      <div className="transformation-header">
        <span>Before</span>
        <span>After</span>
      </div>
      <div
        className="transformation-image"
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          className="transformation-photo transformation-photo-before"
          src={featuredTransformation.beforeSrc}
          alt={`${featuredTransformation.name} before Zeal Power Washing service`}
          width="512"
          height="780"
        />
        <div className="transformation-after-mask" aria-hidden="true">
          <img
            className="transformation-photo transformation-photo-after"
            src={featuredTransformation.afterSrc}
            alt=""
            width="512"
            height="780"
          />
        </div>
        <div className="transformation-divider" aria-hidden="true">
          <img src={businessConfig.logoSrc} alt="" />
        </div>
      </div>
      <div className="transformation-caption">
        <strong>Curb appeal comes back fast.</strong>
        <span>Driveways, walkways, house fronts, patios, roofs, and more.</span>
      </div>
    </aside>
  )
}

function HeroTrustIndicators() {
  return (
    <div className="hero-trust-strip" aria-label="Trust indicators">
      {heroTrustIndicators.map((item) => (
        <div className="hero-trust-item" key={item}>
          <span aria-hidden="true">✓</span>
          {item}
        </div>
      ))}
    </div>
  )
}

function HeroSection() {
  return (
    <header className="hero-section section-pad" id="top">
      <nav className="site-nav" aria-label="Primary navigation">
        <Logo />
        <a
          className="nav-call"
          href={businessConfig.phoneHref}
          id="cta-header-call-text"
          onClick={() => trackEvent('click_call_button', { cta_location: 'header' })}
        >
          Call/Text {businessConfig.displayPhone}
        </a>
      </nav>

      <div className="hero-layout">
        <div className="hero-content">
          <div className="eyebrow">Grand opening specials for Southeast Texas</div>
          <h1>Restore. Refresh. Enjoy.</h1>
          <p className="hero-subtitle">We Bring Your Outdoors Back To Life.</p>

          <HeroVideo />

          <div className="hero-actions">
            <a
              className="button button-primary"
              href="#quote"
              id="cta-hero-free-quote"
              onClick={() => trackEvent('click_quote_button', { cta_location: 'hero' })}
            >
              Get My Free Quote
            </a>
            <a
              className="button button-secondary"
              href={businessConfig.phoneHref}
              id="cta-hero-call"
              onClick={() => trackEvent('click_call_button', { cta_location: 'hero' })}
            >
              Call {businessConfig.displayPhone}
            </a>
            <a
              className="button button-secondary"
              href={businessConfig.textHref}
              id="cta-hero-text"
              onClick={() => trackEvent('click_text_button', { cta_location: 'hero' })}
            >
              Text {businessConfig.displayPhone}
            </a>
          </div>
        </div>

        <TransformationVisual />
      </div>

      <HeroTrustIndicators />
    </header>
  )
}

function OfferCard({ offer }) {
  return (
    <article className={`offer-card offer-${offer.tone}`}>
      <div className="offer-price">{offer.price}</div>
      <h3>{offer.title}</h3>
      <ul>
        {offer.options.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>
      <a
        className="button offer-button"
        href="#quote"
        id={`cta-offer-${offer.id}`}
        onClick={() =>
          trackEvent(`click_offer_${offer.id}`, {
            offer_amount: offer.price,
            offer_title: offer.title,
          })
        }
      >
        Choose This Package
      </a>
    </article>
  )
}

function OffersSection() {
  return (
    <section className="offers-section section-pad" id="specials">
      <div className="section-heading">
        <span className="eyebrow">Direct mail launch offer</span>
        <h2>First 25 Homes Only</h2>
        <p>
          Pick the package that matches what you want cleaned. We will confirm
          the right service and timing before we start.
        </p>
      </div>
      <div className="offer-grid">
        {offerPackages.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  )
}

function BeforeAfterCard({ service }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const animationFrameRef = useRef(null)
  const isDraggingRef = useRef(false)
  const positionRef = useRef(50)
  const sliderRef = useRef(null)

  function setVisualSliderPosition(position) {
    positionRef.current = position

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      sliderRef.current?.style.setProperty('--slider-position', `${position}%`)
    })
  }

  function getPointerPosition(event) {
    const slider = sliderRef.current

    if (!slider) {
      return sliderPosition
    }

    const sliderBounds = slider.getBoundingClientRect()
    const nextPosition = ((event.clientX - sliderBounds.left) / sliderBounds.width) * 100

    return Math.min(95, Math.max(5, nextPosition))
  }

  function handlePointerDown(event) {
    isDraggingRef.current = true
    setVisualSliderPosition(getPointerPosition(event))
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  function handlePointerMove(event) {
    if (!isDraggingRef.current) {
      return
    }

    setVisualSliderPosition(getPointerPosition(event))
  }

  function handlePointerUp(event) {
    isDraggingRef.current = false
    setSliderPosition(positionRef.current)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <article className="before-after-card" style={{ '--slider-position': `${sliderPosition}%` }}>
      <div
        className="comparison-slider"
        ref={sliderRef}
        aria-label={`${service.name} before and after comparison`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          className="comparison-img comparison-img-before"
          src={service.beforeSrc}
          alt={`${service.name} before Zeal Power Washing service`}
          width="720"
          height="520"
          loading="lazy"
        />
        <div className="comparison-after-mask" aria-hidden="true">
          <img
            className="comparison-img comparison-img-after"
            src={service.afterSrc}
            alt=""
            width="720"
            height="520"
            loading="lazy"
          />
        </div>
        <span className="comparison-label comparison-label-before">Before</span>
        <span className="comparison-label comparison-label-after">After</span>
        <span className="comparison-handle" aria-hidden="true">
          <img src={businessConfig.logoSrc} alt="" />
        </span>
        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          step="0.1"
          aria-label={`Compare ${service.name} before and after`}
          onChange={(event) => {
            const nextPosition = Number(event.target.value)

            setSliderPosition(nextPosition)
            setVisualSliderPosition(nextPosition)
          }}
        />
      </div>

      <div className="comparison-stack" aria-label={`${service.name} before and after photos`}>
        <figure>
          <img
            src={service.beforeSrc}
            alt={`${service.name} before Zeal Power Washing service`}
            width="720"
            height="520"
            loading="lazy"
          />
          <figcaption>Before</figcaption>
        </figure>
        <figure>
          <img
            src={service.afterSrc}
            alt={`${service.name} after Zeal Power Washing service`}
            width="720"
            height="520"
            loading="lazy"
          />
          <figcaption>After</figcaption>
        </figure>
      </div>

      <h3>{service.name}</h3>
      <p>{service.description}</p>
    </article>
  )
}

function BeforeAfterSection() {
  return (
    <section className="before-after-section section-pad" id="before-after">
      <div className="section-heading">
        <span className="eyebrow">See the difference</span>
        <h2>Outdoor Spaces That Look Fresh Again</h2>
        <p>
          Clean concrete, siding, roofs, decks, and fence lines can change how
          your whole property feels.
        </p>
      </div>
      <div className="before-after-grid">
        {beforeAfterServices.map((service) => (
          <BeforeAfterCard key={service.name} service={service} />
        ))}
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section className="trust-section section-pad" id="why-zeal">
      <div className="section-heading">
        <span className="eyebrow">Why homeowners book Zeal</span>
        <h2>Fast, Clean, Local Service</h2>
      </div>
      <div className="trust-grid">
        {trustItems.map((item) => (
          <article className="trust-card" key={item.title}>
            <span className="trust-icon" aria-hidden="true">
              {item.icon}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function TeamSection() {
  return (
    <section className="team-section section-pad" id="team">
      <div className="section-heading team-heading">
        <span className="eyebrow">Owner operated</span>
        <h2>Meet The Zeal Power Washing Family</h2>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <article className="team-card" key={member.name}>
            <img
              className="team-photo"
              src={member.imageSrc}
              alt={member.name}
              width="256"
              height="256"
              loading="lazy"
            />
            <h3>{member.name}</h3>
            <span>{member.role}</span>
            <p>{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ReviewsSection() {
  return (
    <section className="reviews-section section-pad" id="reviews">
      <div className="section-heading reviews-heading">
        <span className="eyebrow">Real local feedback</span>
        <h2>Homeowners Recommend Zeal</h2>
        <p>
          People choose Zeal for fast response, clean work, and outdoor spaces
          that look refreshed again.
        </p>
      </div>

      <div className="reviews-summary-card">
        <div>
          <span className="reviews-stars" aria-label="5 star review rating">
            ★★★★★
          </span>
          <h3>Read the latest Zeal Power Washing reviews on Google.</h3>
          <p>
            See current customer feedback, photos, and local recommendations
            before you book your launch special.
          </p>
        </div>
        <a
          className="button button-primary"
          href={reviewConfig.googleReviewsUrl}
          id="cta-reviews-google"
          target="_blank"
          rel="noreferrer"
        >
          Read Our Google Reviews
        </a>
      </div>

      <div className="reviews-grid">
        {customerReviews.map((review) => (
          <article className="review-card" key={`${review.author}-${review.detail}`}>
            <span className="reviews-stars" aria-hidden="true">
              ★★★★★
            </span>
            <blockquote>“{review.quote}”</blockquote>
            <div className="review-meta">
              <strong>{review.author}</strong>
              <span>{review.detail}</span>
              <small>{review.source}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function QuoteFormSection() {
  const addressInputRef = useRef(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [addressAutocompleteStatus, setAddressAutocompleteStatus] = useState('loading')
  const [selectedAddress, setSelectedAddress] = useState({
    formattedAddress: '',
    placeId: '',
  })

  useEffect(() => {
    let cleanupAutocomplete
    let isMounted = true

    setupAddressAutocomplete(addressInputRef.current, (address) => {
      if (!isMounted) {
        return
      }

      setSelectedAddress({
        formattedAddress: address.formattedAddress,
        placeId: address.placeId,
      })
    }, setAddressAutocompleteStatus).then((cleanup) => {
      cleanupAutocomplete = cleanup
    })

    return () => {
      isMounted = false
      cleanupAutocomplete?.()
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const serviceSelected = formData.get('serviceNeeded') || 'not_selected'
    const propertyDetails = formData.getAll('propertyDetails')
    const preferredDateTime = formData.get('preferredDateTime') || 'not_selected'

    trackEvent('submit_quote_form', {
      service_selected: serviceSelected,
      preferred_datetime: preferredDateTime,
      property_details: propertyDetails.join(', ') || 'none_selected',
      address_autocomplete_used: selectedAddress.placeId ? 'yes' : 'no',
      lead_source: formSettings.leadSource,
      landing_page: formSettings.landingPage,
    })

    // Add form webhook, CRM, Meta Pixel, and Google Tag Manager conversion
    // tracking here. formSettings.webhookUrl is ready for later use.
    setIsSubmitted(true)
  }

  return (
    <section className="quote-section section-pad" id="quote">
      <div className="quote-card">
        <div className="quote-intro">
          <span className="eyebrow">Launch special quote</span>
          <h2>Get Your Launch Special Quote</h2>
          <p>
            Tell us what you want cleaned and when works best. Jaylan will
            follow up soon with a clear next step.
          </p>
          <div className="quote-callout">
            Prefer fast contact? Call or text{' '}
            <a
              href={businessConfig.phoneHref}
              onClick={() => trackEvent('click_call_button', { cta_location: 'quote_callout' })}
            >
              {businessConfig.displayPhone}
            </a>.
          </div>
        </div>

        <form className="quote-form" onSubmit={handleSubmit} data-form-destination={formSettings.webhookUrl}>
          <input type="hidden" name="lead_source" value={formSettings.leadSource} />
          <input type="hidden" name="landing_page" value={formSettings.landingPage} />
          <input type="hidden" name="selected_formatted_address" value={selectedAddress.formattedAddress} />
          <input type="hidden" name="selected_address_place_id" value={selectedAddress.placeId} />
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" autoComplete="tel" required />
          </label>
          <label>
            Address
            <input
              ref={addressInputRef}
              name="address"
              type="text"
              autoComplete="street-address"
              placeholder="Start typing your home address"
              onChange={() => {
                if (selectedAddress.placeId) {
                  setSelectedAddress({ formattedAddress: '', placeId: '' })
                }
              }}
              required
            />
            <small className={`form-helper form-helper-${addressAutocompleteStatus}`}>
              {addressAutocompleteStatus === 'ready' && 'Start typing, then choose your address from the list.'}
              {addressAutocompleteStatus === 'loading' && 'Loading address suggestions...'}
              {addressAutocompleteStatus === 'missing_key' &&
                'Address suggestions are not connected yet. You can still type your address.'}
              {addressAutocompleteStatus === 'unavailable' &&
                'Address suggestions are unavailable right now. You can still type your address.'}
            </small>
          </label>
          <label>
            Service Needed
            <select name="serviceNeeded" defaultValue="" required>
              <option value="" disabled>
                Select a service
              </option>
              {offerPackages.map((offer) => (
                <option key={offer.id} value={offer.title}>
                  {offer.price} - {offer.title}
                </option>
              ))}
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </label>
          <label>
            Preferred date and time
            <input name="preferredDateTime" type="datetime-local" min={getMinimumPreferredDateTime()} required />
          </label>
          <fieldset className="form-options-group">
            <legend>Property details</legend>
            <p>Select anything that helps us quote faster.</p>
            <div className="form-checkbox-grid">
              {propertyDetailOptions.map((option) => (
                <label className="checkbox-card" key={option}>
                  <input type="checkbox" name="propertyDetails" value={option} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            Anything else we should know?
            <textarea
              name="additionalDetails"
              rows="3"
              placeholder="Example: gate code, best place to park, problem spots, or best contact window."
            />
          </label>
          <button className="button button-primary form-button" type="submit" id="cta-form-request-quote">
            Request My Quote
          </button>
          {isSubmitted && (
            <p className="success-message" role="status">
              Thanks! We received your request. Jaylan with Zeal Power Washing
              will follow up soon.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

function StickyMobileCta() {
  return (
    <div className="sticky-mobile-cta" aria-label="Quick contact actions">
      <a
        href={businessConfig.phoneHref}
        id="cta-sticky-call"
        onClick={() => trackEvent('click_call_button', { cta_location: 'sticky_mobile' })}
      >
        Call
      </a>
      <a
        href={businessConfig.textHref}
        id="cta-sticky-text"
        onClick={() => trackEvent('click_text_button', { cta_location: 'sticky_mobile' })}
      >
        Text
      </a>
      <a
        href="#quote"
        id="cta-sticky-get-quote"
        onClick={() => trackEvent('click_quote_button', { cta_location: 'sticky_mobile' })}
      >
        Get Quote
      </a>
    </div>
  )
}

function App() {
  useEffect(() => {
    captureAttributionParams()
    initAnalytics()
    trackLandingView()
  }, [])

  return (
    <>
      {/* Add Meta Pixel or Google Tag Manager event mirroring here later if needed. */}
      <HeroSection />
      <main>
        <OffersSection />
        <BeforeAfterSection />
        <TrustSection />
        <TeamSection />
        <ReviewsSection />
        <QuoteFormSection />
      </main>
      <footer className="site-footer">
        <Logo />
        <p>
          {businessConfig.companyName} - serving homeowners within 5 miles of
          your neighborhood.
        </p>
      </footer>
      <StickyMobileCta />
    </>
  )
}

export default App
