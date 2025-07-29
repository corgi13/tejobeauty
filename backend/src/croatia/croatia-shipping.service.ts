import { Injectable } from '@nestjs/common';

export interface CroatianShippingZone {
  id: string;
  name: string;
  counties: string[];
  cities: string[];
  standardCost: number;
  expressCost: number;
  freeShippingThreshold: number;
  estimatedDays: {
    standard: string;
    express: string;
  };
}

export interface ShippingCalculation {
  zone: CroatianShippingZone;
  method: 'standard' | 'express';
  cost: number;
  estimatedDelivery: string;
  isFree: boolean;
  carrier: string;
}

export interface CroatianHoliday {
  date: string;
  name: string;
  type: 'national' | 'religious' | 'regional';
  affectsShipping: boolean;
}

@Injectable()
export class CroatiaShippingService {
  private readonly shippingZones: CroatianShippingZone[] = [
    {
      id: 'zagreb-metro',
      name: 'Zagreb i okolica',
      counties: ['Zagrebačka županija', 'Grad Zagreb'],
      cities: ['Zagreb', 'Velika Gorica', 'Zaprešić', 'Samobor', 'Dugo Selo'],
      standardCost: 25.00,
      expressCost: 45.00,
      freeShippingThreshold: 200.00,
      estimatedDays: {
        standard: '1-2 radna dana',
        express: 'isti dan'
      }
    },
    {
      id: 'coastal-north',
      name: 'Sjeverna obala',
      counties: ['Primorsko-goranska županija', 'Istarska županija'],
      cities: ['Rijeka', 'Pula', 'Opatija', 'Rovinj', 'Poreč', 'Krk', 'Crikvenica'],
      standardCost: 35.00,
      expressCost: 55.00,
      freeShippingThreshold: 250.00,
      estimatedDays: {
        standard: '2-3 radna dana',
        express: '1-2 radna dana'
      }
    },
    {
      id: 'coastal-central',
      name: 'Srednja Dalmacija',
      counties: ['Splitsko-dalmatinska županija', 'Šibensko-kninska županija'],
      cities: ['Split', 'Šibenik', 'Trogir', 'Kaštela', 'Solin', 'Omiš', 'Makarska'],
      standardCost: 40.00,
      expressCost: 60.00,
      freeShippingThreshold: 250.00,
      estimatedDays: {
        standard: '2-4 radna dana',
        express: '1-2 radna dana'
      }
    },
    {
      id: 'coastal-south',
      name: 'Južna Dalmacija',
      counties: ['Dubrovačko-neretvanska županija'],
      cities: ['Dubrovnik', 'Korčula', 'Ploče', 'Metković', 'Opuzen'],
      standardCost: 45.00,
      expressCost: 70.00,
      freeShippingThreshold: 300.00,
      estimatedDays: {
        standard: '3-5 radnih dana',
        express: '2-3 radna dana'
      }
    },
    {
      id: 'continental-north',
      name: 'Sjeverna kontinentalna Hrvatska',
      counties: ['Varaždinska županija', 'Međimurska županija', 'Krapinsko-zagorska županija'],
      cities: ['Varaždin', 'Čakovec', 'Krapina', 'Ivanec', 'Prelog'],
      standardCost: 30.00,
      expressCost: 50.00,
      freeShippingThreshold: 200.00,
      estimatedDays: {
        standard: '2-3 radna dana',
        express: '1-2 radna dana'
      }
    },
    {
      id: 'continental-east',
      name: 'Istočna Hrvatska',
      counties: ['Osječko-baranjska županija', 'Vukovarsko-srijemska županija', 'Brodsko-posavska županija'],
      cities: ['Osijek', 'Vukovar', 'Slavonski Brod', 'Vinkovci', 'Đakovo'],
      standardCost: 35.00,
      expressCost: 55.00,
      freeShippingThreshold: 250.00,
      estimatedDays: {
        standard: '2-4 radna dana',
        express: '1-3 radna dana'
      }
    },
    {
      id: 'continental-central',
      name: 'Središnja Hrvatska',
      counties: ['Karlovačka županija', 'Sisačko-moslavačka županija', 'Bjelovarsko-bilogorska županija'],
      cities: ['Karlovac', 'Sisak', 'Bjelovar', 'Ogulin', 'Petrinja'],
      standardCost: 30.00,
      expressCost: 50.00,
      freeShippingThreshold: 200.00,
      estimatedDays: {
        standard: '2-3 radna dana',
        express: '1-2 radna dana'
      }
    }
  ];

  private readonly croatianHolidays2025: CroatianHoliday[] = [
    { date: '2025-01-01', name: 'Nova godina', type: 'national', affectsShipping: true },
    { date: '2025-01-06', name: 'Bogojavljenje', type: 'religious', affectsShipping: true },
    { date: '2025-04-20', name: 'Uskrs', type: 'religious', affectsShipping: true },
    { date: '2025-04-21', name: 'Uskrsni ponedjeljak', type: 'religious', affectsShipping: true },
    { date: '2025-05-01', name: 'Praznik rada', type: 'national', affectsShipping: true },
    { date: '2025-06-08', name: 'Tijelovo', type: 'religious', affectsShipping: true },
    { date: '2025-06-22', name: 'Dan antifašističke borbe', type: 'national', affectsShipping: true },
    { date: '2025-06-25', name: 'Dan državnosti', type: 'national', affectsShipping: true },
    { date: '2025-08-05', name: 'Dan pobjede i domovinske zahvalnosti', type: 'national', affectsShipping: true },
    { date: '2025-08-15', name: 'Velika Gospa', type: 'religious', affectsShipping: true },
    { date: '2025-11-01', name: 'Dan svih svetih', type: 'religious', affectsShipping: true },
    { date: '2025-12-25', name: 'Božić', type: 'religious', affectsShipping: true },
    { date: '2025-12-26', name: 'Sveti Stjepan', type: 'religious', affectsShipping: true }
  ];

  /**
   * Calculate shipping cost for Croatian address
   */
  calculateShipping(
    city: string,
    orderValue: number,
    method: 'standard' | 'express' = 'standard'
  ): ShippingCalculation | null {
    const zone = this.getShippingZone(city);
    if (!zone) {
      return null;
    }

    const baseCost = method === 'express' ? zone.expressCost : zone.standardCost;
    const isFree = orderValue >= zone.freeShippingThreshold;
    const cost = isFree ? 0 : baseCost;

    return {
      zone,
      method,
      cost,
      estimatedDelivery: zone.estimatedDays[method],
      isFree,
      carrier: this.getRecommendedCarrier(zone.id, method)
    };
  }

  /**
   * Get shipping zone by city
   */
  getShippingZone(city: string): CroatianShippingZone | null {
    return this.shippingZones.find(zone => 
      zone.cities.some(zoneCity => 
        zoneCity.toLowerCase() === city.toLowerCase()
      )
    ) || null;
  }

  /**
   * Get all shipping zones
   */
  getAllShippingZones(): CroatianShippingZone[] {
    return this.shippingZones;
  }

  /**
   * Get recommended carrier for zone and method
   */
  private getRecommendedCarrier(zoneId: string, method: 'standard' | 'express'): string {
    if (method === 'express') {
      return 'DPD Express';
    }

    switch (zoneId) {
      case 'zagreb-metro':
        return 'Hrvatska pošta - Zagreb';
      case 'coastal-north':
      case 'coastal-central':
      case 'coastal-south':
        return 'Overseas Express';
      default:
        return 'Hrvatska pošta';
    }
  }

  /**
   * Check if date is Croatian holiday
   */
  isHoliday(date: string): CroatianHoliday | null {
    return this.croatianHolidays2025.find(holiday => holiday.date === date) || null;
  }

  /**
   * Get Croatian holidays for the year
   */
  getCroatianHolidays(): CroatianHoliday[] {
    return this.croatianHolidays2025;
  }

  /**
   * Calculate estimated delivery date considering holidays
   */
  calculateDeliveryDate(
    shippingDate: Date,
    estimatedDays: string,
    method: 'standard' | 'express'
  ): Date {
    const days = this.parseEstimatedDays(estimatedDays, method);
    let deliveryDate = new Date(shippingDate);
    let addedDays = 0;

    while (addedDays < days) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      
      // Skip weekends
      if (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
        continue;
      }

      // Skip holidays
      const dateString = deliveryDate.toISOString().split('T')[0];
      const holiday = this.isHoliday(dateString);
      if (holiday && holiday.affectsShipping) {
        continue;
      }

      addedDays++;
    }

    return deliveryDate;
  }

  /**
   * Parse estimated days string to number
   */
  private parseEstimatedDays(estimatedDays: string, method: 'standard' | 'express'): number {
    if (estimatedDays.includes('isti dan')) {
      return 0;
    }
    
    // Extract first number from string like "2-3 radna dana"
    const match = estimatedDays.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    
    // Default fallback
    return method === 'express' ? 1 : 3;
  }

  /**
   * Get shipping options for city
   */
  getShippingOptions(city: string, orderValue: number): {
    standard: ShippingCalculation | null;
    express: ShippingCalculation | null;
  } {
    return {
      standard: this.calculateShipping(city, orderValue, 'standard'),
      express: this.calculateShipping(city, orderValue, 'express')
    };
  }

  /**
   * Check if same-day delivery is available
   */
  isSameDayDeliveryAvailable(city: string): boolean {
    const zone = this.getShippingZone(city);
    return zone?.id === 'zagreb-metro' && zone.estimatedDays.express === 'isti dan';
  }

  /**
   * Get free shipping threshold for city
   */
  getFreeShippingThreshold(city: string): number | null {
    const zone = this.getShippingZone(city);
    return zone ? zone.freeShippingThreshold : null;
  }
}
