import { Injectable } from '@nestjs/common';

export interface CroatianTaxCalculation {
  subtotal: number;
  pdvRate: number;
  pdvAmount: number;
  total: number;
  taxBreakdown: {
    base: number;
    pdv: number;
  };
}

export interface CroatianTaxRates {
  standard: number; // 25%
  reduced: number;  // 13%
  super_reduced: number; // 5%
}

@Injectable()
export class CroatiaTaxService {
  private readonly taxRates: CroatianTaxRates = {
    standard: 0.25,      // 25% - Standard rate for most goods
    reduced: 0.13,       // 13% - Reduced rate for certain goods
    super_reduced: 0.05, // 5% - Super reduced rate for essential goods
  };

  /**
   * Calculate Croatian PDV (VAT) for nail care products
   * Most cosmetic products fall under standard 25% rate
   */
  calculatePDV(
    subtotal: number,
    productCategory: 'cosmetic' | 'tool' | 'essential' = 'cosmetic'
  ): CroatianTaxCalculation {
    let pdvRate: number;

    switch (productCategory) {
      case 'essential':
        pdvRate = this.taxRates.super_reduced; // 5% for essential items
        break;
      case 'tool':
        pdvRate = this.taxRates.reduced; // 13% for tools
        break;
      case 'cosmetic':
      default:
        pdvRate = this.taxRates.standard; // 25% for cosmetics
        break;
    }

    const pdvAmount = subtotal * pdvRate;
    const total = subtotal + pdvAmount;

    return {
      subtotal,
      pdvRate,
      pdvAmount: Math.round(pdvAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      taxBreakdown: {
        base: subtotal,
        pdv: Math.round(pdvAmount * 100) / 100,
      },
    };
  }

  /**
   * Calculate PDV for multiple items with different categories
   */
  calculateMultiItemPDV(
    items: Array<{
      price: number;
      quantity: number;
      category: 'cosmetic' | 'tool' | 'essential';
    }>
  ): CroatianTaxCalculation {
    let totalSubtotal = 0;
    let totalPDV = 0;

    items.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      const itemTax = this.calculatePDV(itemSubtotal, item.category);
      
      totalSubtotal += itemSubtotal;
      totalPDV += itemTax.pdvAmount;
    });

    return {
      subtotal: Math.round(totalSubtotal * 100) / 100,
      pdvRate: totalPDV / totalSubtotal, // Average rate
      pdvAmount: Math.round(totalPDV * 100) / 100,
      total: Math.round((totalSubtotal + totalPDV) * 100) / 100,
      taxBreakdown: {
        base: Math.round(totalSubtotal * 100) / 100,
        pdv: Math.round(totalPDV * 100) / 100,
      },
    };
  }

  /**
   * Get current Croatian tax rates
   */
  getTaxRates(): CroatianTaxRates {
    return this.taxRates;
  }

  /**
   * Format PDV for Croatian invoice display
   */
  formatPDVForInvoice(calculation: CroatianTaxCalculation): string {
    return `
Osnovica: ${calculation.subtotal.toFixed(2)} EUR
PDV (${(calculation.pdvRate * 100).toFixed(0)}%): ${calculation.pdvAmount.toFixed(2)} EUR
Ukupno: ${calculation.total.toFixed(2)} EUR
    `.trim();
  }

  /**
   * Validate Croatian OIB (Personal Identification Number)
   */
  validateOIB(oib: string): boolean {
    // Remove any spaces or dashes
    const cleanOIB = oib.replace(/[\s-]/g, '');
    
    // Check if it's exactly 11 digits
    if (!/^\d{11}$/.test(cleanOIB)) {
      return false;
    }

    // Calculate control digit using Croatian algorithm
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanOIB[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const controlDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return controlDigit === parseInt(cleanOIB[10]);
  }

  /**
   * Format OIB for display
   */
  formatOIB(oib: string): string {
    const cleanOIB = oib.replace(/[\s-]/g, '');
    if (cleanOIB.length === 11) {
      return `${cleanOIB.slice(0, 2)}-${cleanOIB.slice(2, 5)}-${cleanOIB.slice(5, 8)}-${cleanOIB.slice(8)}`;
    }
    return oib;
  }

  /**
   * Check if business is eligible for Croatian tax benefits
   */
  checkTaxBenefits(
    businessType: 'salon' | 'spa' | 'individual' | 'retail',
    annualRevenue: number
  ): {
    eligible: boolean;
    benefits: string[];
    requirements: string[];
  } {
    const benefits: string[] = [];
    const requirements: string[] = [];
    let eligible = false;

    // Small business benefits (up to 300,000 EUR annually)
    if (annualRevenue <= 300000) {
      eligible = true;
      benefits.push('Paušalni obrt - simplified tax calculation');
      benefits.push('Reduced administrative burden');
      requirements.push('Annual revenue must not exceed 300,000 EUR');
      requirements.push('Must maintain proper business records');
    }

    // Beauty industry specific benefits
    if (businessType === 'salon' || businessType === 'spa') {
      benefits.push('Professional equipment tax deduction');
      benefits.push('Training and certification expense deduction');
      requirements.push('Must have valid beauty industry license');
      requirements.push('Must comply with health and safety regulations');
    }

    return {
      eligible,
      benefits,
      requirements,
    };
  }
}
