/**
 * User Behavior Tracking Client
 *
 * This module provides functions for tracking user behavior on the frontend.
 * It sends events to the backend API for analysis and visualization.
 */

// Types
export interface TrackingEvent {
  eventType: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  page?: string;
  metadata?: Record<string, any>;
}

// Session management
let sessionId = "";
let userId = "";
let currentPage = "";
let sessionStartTime = 0;
let initialized = false;

/**
 * Initialize the tracking client
 */
export function initializeTracking(currentUserId?: string): void {
  if (initialized) return;

  // Generate a session ID
  sessionId = generateSessionId();

  // Set user ID if provided, otherwise use anonymous ID
  userId = currentUserId || `anon_${generateRandomId()}`;

  // Record session start time
  sessionStartTime = Date.now();

  // Set current page
  currentPage = window.location.pathname;

  // Track page view
  trackPageView(currentPage);

  // Add event listeners
  addEventListeners();

  initialized = true;

  console.log("User behavior tracking initialized", { sessionId, userId });
}

/**
 * Track a page view
 */
export function trackPageView(page: string, referrer?: string): void {
  if (!initialized) {
    console.warn("Tracking not initialized. Call initializeTracking() first.");
    return;
  }

  const previousPage = currentPage;
  currentPage = page;

  sendEvent({
    eventType: "page_view",
    eventCategory: "navigation",
    eventAction: "page_view",
    eventLabel: page,
    page,
    metadata: {
      referrer: referrer || previousPage,
      title: document.title,
    },
  });
}

/**
 * Track a user interaction
 */
export function trackInteraction(
  category: string,
  action: string,
  label?: string,
  value?: number,
  metadata?: Record<string, any>,
): void {
  if (!initialized) {
    console.warn("Tracking not initialized. Call initializeTracking() first.");
    return;
  }

  sendEvent({
    eventType: "interaction",
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value,
    page: currentPage,
    metadata,
  });
}

/**
 * Track a conversion event
 */
export function trackConversion(
  conversionType: string,
  value?: number,
  metadata?: Record<string, any>,
): void {
  if (!initialized) {
    console.warn("Tracking not initialized. Call initializeTracking() first.");
    return;
  }

  sendEvent({
    eventType: "conversion",
    eventCategory: "conversion",
    eventAction: conversionType,
    eventValue: value,
    page: currentPage,
    metadata,
  });
}

/**
 * Track an ecommerce event
 */
export function trackEcommerce(
  action:
    | "view_item"
    | "add_to_cart"
    | "remove_from_cart"
    | "begin_checkout"
    | "purchase",
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
    category?: string;
  }>,
  metadata?: Record<string, any>,
): void {
  if (!initialized) {
    console.warn("Tracking not initialized. Call initializeTracking() first.");
    return;
  }

  sendEvent({
    eventType: "ecommerce",
    eventCategory: "ecommerce",
    eventAction: action,
    page: currentPage,
    metadata: {
      ...metadata,
      products,
    },
  });

  // If this is a purchase, also track it as a conversion
  if (action === "purchase") {
    const totalValue = products.reduce((sum, product) => {
      return sum + product.price * (product.quantity || 1);
    }, 0);

    trackConversion("purchase_completed", totalValue, { products });
  }
}

// Private helper functions

function sendEvent(event: TrackingEvent): void {
  const fullEvent = {
    ...event,
    sessionId,
    userId,
    timestamp: new Date().toISOString(),
  };

  // In development, log the event
  if (process.env.NODE_ENV === "development") {
    console.log("Tracking event:", fullEvent);
  }

  // Send the event to the backend API
  fetch("/api/tracking/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullEvent),
    // Use keepalive to ensure the request completes even if the page is unloading
    keepalive: true,
  }).catch((error) => {
    console.error("Failed to send tracking event:", error);
  });
}

function addEventListeners(): void {
  // Track page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      sendEvent({
        eventType: "visibility",
        eventCategory: "engagement",
        eventAction: "page_hide",
        page: currentPage,
      });
    } else {
      sendEvent({
        eventType: "visibility",
        eventCategory: "engagement",
        eventAction: "page_show",
        page: currentPage,
      });
    }
  });

  // Track page unload
  window.addEventListener("beforeunload", () => {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

    sendEvent({
      eventType: "session",
      eventCategory: "engagement",
      eventAction: "session_end",
      eventValue: sessionDuration,
      page: currentPage,
      metadata: {
        sessionDuration,
      },
    });
  });
}

function generateSessionId(): string {
  return `${Date.now()}_${generateRandomId()}`;
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
