// UserBehaviorTrackingService.ts - Service for tracking and analyzing user behavior
import { UserRepository } from "./UserRepository";

export interface UserEvent {
  userId: string;
  sessionId: string;
  eventType: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  page?: string;
  referrer?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserJourney {
  userId: string;
  sessionId: string;
  steps: UserEvent[];
  startTime: Date;
  endTime?: Date;
  conversionAchieved: boolean;
  conversionType?: string;
  conversionValue?: number;
}

export interface FunnelStep {
  name: string;
  eventCategory: string;
  eventAction: string;
  count: number;
  dropoffRate: number;
}

export interface ConversionFunnel {
  name: string;
  steps: FunnelStep[];
  conversionRate: number;
  averageTimeToConversion: number; // in seconds
  startDate: Date;
  endDate: Date;
}

export interface UserBehaviorMetrics {
  totalSessions: number;
  averageSessionDuration: number; // in seconds
  bounceRate: number;
  pageViewsPerSession: number;
  topEntryPages: { page: string; count: number; percentage: number }[];
  topExitPages: { page: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  newVsReturning: {
    type: "new" | "returning";
    count: number;
    percentage: number;
  }[];
}

export class UserBehaviorTrackingService {
  private db: any;
  private userRepository: UserRepository;
  private readonly CONVERSION_EVENTS = [
    "purchase_completed",
    "signup_completed",
    "professional_registration_completed",
  ];

  constructor(db: any, userRepository: UserRepository) {
    this.db = db;
    this.userRepository = userRepository;
  }

  /**
   * Track a user event
   */
  async trackEvent(event: Omit<UserEvent, "timestamp">): Promise<void> {
    const userEvent: UserEvent = {
      ...event,
      timestamp: new Date(),
    };

    // In a real implementation, this would save to the database
    console.log("Tracking event:", userEvent);

    // Check if this event completes a journey/conversion
    if (this.CONVERSION_EVENTS.includes(event.eventAction)) {
      await this.completeUserJourney(
        event.userId,
        event.sessionId,
        event.eventAction,
        event.eventValue,
      );
    }
  }

  /**
   * Start tracking a user journey
   */
  async startUserJourney(userId: string, sessionId: string): Promise<void> {
    const journey: Partial<UserJourney> = {
      userId,
      sessionId,
      steps: [],
      startTime: new Date(),
      conversionAchieved: false,
    };

    // In a real implementation, this would save to the database
    console.log("Starting user journey:", journey);
  }

  /**
   * Complete a user journey with conversion information
   */
  async completeUserJourney(
    userId: string,
    sessionId: string,
    conversionType: string,
    conversionValue?: number,
  ): Promise<void> {
    // In a real implementation, this would update the journey in the database
    console.log("Completing user journey:", {
      userId,
      sessionId,
      conversionAchieved: true,
      conversionType,
      conversionValue,
      endTime: new Date(),
    });
  }

  /**
   * Get user journeys for a specific user
   */
  async getUserJourneys(
    userId: string,
    limit: number = 10,
  ): Promise<UserJourney[]> {
    // In a real implementation, this would query the database
    // For now, return mock data
    return this.generateMockUserJourneys(userId, limit);
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(
    funnelName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ConversionFunnel> {
    // In a real implementation, this would analyze events in the database
    // For now, return mock data based on the funnel name
    return this.generateMockConversionFunnel(funnelName, startDate, endDate);
  }

  /**
   * Get user behavior metrics
   */
  async getUserBehaviorMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<UserBehaviorMetrics> {
    // In a real implementation, this would analyze events in the database
    // For now, return mock data
    return this.generateMockUserBehaviorMetrics(startDate, endDate);
  }

  /**
   * Get popular user paths through the site
   */
  async getPopularPaths(
    startDate: Date,
    endDate: Date,
    limit: number = 5,
  ): Promise<{ path: string[]; count: number; conversionRate: number }[]> {
    // In a real implementation, this would analyze events in the database
    // For now, return mock data
    return [
      {
        path: [
          "home",
          "category_nail_polish",
          "product_detail",
          "add_to_cart",
          "checkout",
          "purchase_completed",
        ],
        count: 245,
        conversionRate: 3.2,
      },
      {
        path: [
          "home",
          "search",
          "product_detail",
          "add_to_cart",
          "checkout",
          "purchase_completed",
        ],
        count: 187,
        conversionRate: 2.8,
      },
      {
        path: [
          "home",
          "featured_products",
          "product_detail",
          "add_to_cart",
          "checkout",
          "purchase_completed",
        ],
        count: 156,
        conversionRate: 2.4,
      },
      {
        path: [
          "home",
          "category_tools",
          "product_detail",
          "add_to_cart",
          "checkout",
          "purchase_completed",
        ],
        count: 132,
        conversionRate: 2.1,
      },
      {
        path: [
          "home",
          "promotions",
          "product_detail",
          "add_to_cart",
          "checkout",
          "purchase_completed",
        ],
        count: 98,
        conversionRate: 1.9,
      },
    ];
  }

  // Helper methods to generate mock data

  private generateMockUserJourneys(
    userId: string,
    limit: number,
  ): UserJourney[] {
    const journeys: UserJourney[] = [];

    for (let i = 0; i < limit; i++) {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - Math.floor(Math.random() * 30));

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + Math.floor(Math.random() * 60));

      const conversionAchieved = Math.random() > 0.5;
      const conversionType = conversionAchieved
        ? this.CONVERSION_EVENTS[
            Math.floor(Math.random() * this.CONVERSION_EVENTS.length)
          ]
        : undefined;

      const steps: UserEvent[] = [];
      const stepCount = Math.floor(Math.random() * 10) + 2;

      for (let j = 0; j < stepCount; j++) {
        const eventTime = new Date(startTime);
        eventTime.setMinutes(
          eventTime.getMinutes() + j * Math.floor(Math.random() * 5),
        );

        steps.push({
          userId,
          sessionId: `session-${i}`,
          eventType: "page_view",
          eventCategory: "navigation",
          eventAction: j === 0 ? "page_load" : "page_navigate",
          eventLabel: `page-${j}`,
          page: `/page-${j}`,
          referrer: j === 0 ? "https://google.com" : `/page-${j - 1}`,
          timestamp: eventTime,
          metadata: {},
        });
      }

      if (conversionAchieved) {
        const eventTime = new Date(endTime);
        eventTime.setMinutes(eventTime.getMinutes() - 1);

        steps.push({
          userId,
          sessionId: `session-${i}`,
          eventType: "conversion",
          eventCategory: "checkout",
          eventAction: conversionType!,
          eventValue: Math.floor(Math.random() * 200) + 50,
          page: "/checkout/confirmation",
          timestamp: eventTime,
          metadata: {},
        });
      }

      journeys.push({
        userId,
        sessionId: `session-${i}`,
        steps,
        startTime,
        endTime,
        conversionAchieved,
        conversionType,
        conversionValue: conversionAchieved
          ? Math.floor(Math.random() * 200) + 50
          : undefined,
      });
    }

    return journeys;
  }

  private generateMockConversionFunnel(
    funnelName: string,
    startDate: Date,
    endDate: Date,
  ): ConversionFunnel {
    let steps: FunnelStep[] = [];
    let conversionRate = 0;

    switch (funnelName) {
      case "purchase":
        steps = [
          {
            name: "Product View",
            eventCategory: "product",
            eventAction: "view",
            count: 10000,
            dropoffRate: 0,
          },
          {
            name: "Add to Cart",
            eventCategory: "cart",
            eventAction: "add",
            count: 3000,
            dropoffRate: 70,
          },
          {
            name: "Begin Checkout",
            eventCategory: "checkout",
            eventAction: "begin",
            count: 1500,
            dropoffRate: 50,
          },
          {
            name: "Add Payment Info",
            eventCategory: "checkout",
            eventAction: "payment",
            count: 1200,
            dropoffRate: 20,
          },
          {
            name: "Purchase",
            eventCategory: "checkout",
            eventAction: "purchase_completed",
            count: 1000,
            dropoffRate: 16.7,
          },
        ];
        conversionRate = 10;
        break;

      case "signup":
        steps = [
          {
            name: "View Registration",
            eventCategory: "registration",
            eventAction: "view",
            count: 5000,
            dropoffRate: 0,
          },
          {
            name: "Begin Registration",
            eventCategory: "registration",
            eventAction: "begin",
            count: 2000,
            dropoffRate: 60,
          },
          {
            name: "Submit Form",
            eventCategory: "registration",
            eventAction: "submit",
            count: 1200,
            dropoffRate: 40,
          },
          {
            name: "Verify Email",
            eventCategory: "registration",
            eventAction: "verify",
            count: 800,
            dropoffRate: 33.3,
          },
          {
            name: "Complete Registration",
            eventCategory: "registration",
            eventAction: "signup_completed",
            count: 700,
            dropoffRate: 12.5,
          },
        ];
        conversionRate = 14;
        break;

      case "professional_registration":
        steps = [
          {
            name: "View Pro Registration",
            eventCategory: "pro_registration",
            eventAction: "view",
            count: 2000,
            dropoffRate: 0,
          },
          {
            name: "Begin Pro Registration",
            eventCategory: "pro_registration",
            eventAction: "begin",
            count: 800,
            dropoffRate: 60,
          },
          {
            name: "Submit Business Info",
            eventCategory: "pro_registration",
            eventAction: "submit_business",
            count: 500,
            dropoffRate: 37.5,
          },
          {
            name: "Upload Documents",
            eventCategory: "pro_registration",
            eventAction: "upload_docs",
            count: 400,
            dropoffRate: 20,
          },
          {
            name: "Complete Registration",
            eventCategory: "pro_registration",
            eventAction: "professional_registration_completed",
            count: 350,
            dropoffRate: 12.5,
          },
        ];
        conversionRate = 17.5;
        break;

      default:
        steps = [
          {
            name: "Step 1",
            eventCategory: "generic",
            eventAction: "step1",
            count: 1000,
            dropoffRate: 0,
          },
          {
            name: "Step 2",
            eventCategory: "generic",
            eventAction: "step2",
            count: 750,
            dropoffRate: 25,
          },
          {
            name: "Step 3",
            eventCategory: "generic",
            eventAction: "step3",
            count: 500,
            dropoffRate: 33.3,
          },
          {
            name: "Conversion",
            eventCategory: "generic",
            eventAction: "conversion",
            count: 250,
            dropoffRate: 50,
          },
        ];
        conversionRate = 25;
    }

    return {
      name: funnelName,
      steps,
      conversionRate,
      averageTimeToConversion: 300, // 5 minutes in seconds
      startDate,
      endDate,
    };
  }

  private generateMockUserBehaviorMetrics(
    startDate: Date,
    endDate: Date,
  ): UserBehaviorMetrics {
    return {
      totalSessions: 15000,
      averageSessionDuration: 240, // 4 minutes in seconds
      bounceRate: 35.2,
      pageViewsPerSession: 4.5,
      topEntryPages: [
        { page: "Home", count: 8500, percentage: 56.7 },
        { page: "Products", count: 2250, percentage: 15.0 },
        { page: "Search Results", count: 1500, percentage: 10.0 },
        { page: "Blog", count: 1125, percentage: 7.5 },
        { page: "Promotions", count: 1625, percentage: 10.8 },
      ],
      topExitPages: [
        { page: "Home", count: 3000, percentage: 20.0 },
        { page: "Product Detail", count: 3750, percentage: 25.0 },
        { page: "Cart", count: 2250, percentage: 15.0 },
        { page: "Checkout Confirmation", count: 4500, percentage: 30.0 },
        { page: "Contact", count: 1500, percentage: 10.0 },
      ],
      deviceBreakdown: [
        { device: "Desktop", count: 7500, percentage: 50.0 },
        { device: "Mobile", count: 6000, percentage: 40.0 },
        { device: "Tablet", count: 1500, percentage: 10.0 },
      ],
      newVsReturning: [
        { type: "new", count: 9000, percentage: 60.0 },
        { type: "returning", count: 6000, percentage: 40.0 },
      ],
    };
  }
}
