import { Injectable } from '@nestjs/common';

export interface CroatianBusinessInfo {
  oib: string;
  businessName: string;
  businessType: 'obrt' | 'doo' | 'jdoo' | 'ad' | 'individual';
  activityCode: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    county: string;
  };
  isActive: boolean;
  registrationDate: Date;
}

export interface CroatianCounty {
  code: string;
  name: string;
  cities: string[];
}

@Injectable()
export class CroatiaBusinessService {
  private readonly croatianCounties: CroatianCounty[] = [
    {
      code: 'ZG',
      name: 'Zagrebačka županija',
      cities: ['Zagreb', 'Velika Gorica', 'Zaprešić', 'Samobor', 'Dugo Selo']
    },
    {
      code: 'ST',
      name: 'Splitsko-dalmatinska županija', 
      cities: ['Split', 'Kaštela', 'Solin', 'Trogir', 'Omiš', 'Makarska', 'Imotski']
    },
    {
      code: 'RI',
      name: 'Primorsko-goranska županija',
      cities: ['Rijeka', 'Pula', 'Opatija', 'Krk', 'Crikvenica', 'Delnice']
    },
    {
      code: 'OS',
      name: 'Osječko-baranjska županija',
      cities: ['Osijek', 'Slavonski Brod', 'Đakovo', 'Vukovar', 'Vinkovci']
    },
    {
      code: 'ZD',
      name: 'Zadarska županija',
      cities: ['Zadar', 'Biograd na Moru', 'Nin', 'Pag', 'Benkovac']
    },
    {
      code: 'SB',
      name: 'Šibensko-kninska županija',
      cities: ['Šibenik', 'Knin', 'Drniš', 'Skradin', 'Vodice']
    },
    {
      code: 'VŽ',
      name: 'Varaždinska županija',
      cities: ['Varaždin', 'Čakovec', 'Ivanec', 'Ludbreg', 'Novi Marof']
    },
    {
      code: 'KA',
      name: 'Karlovačka županija',
      cities: ['Karlovac', 'Ogulin', 'Duga Resa', 'Ozalj', 'Slunj']
    }
  ];

  private readonly beautyIndustryActivityCodes = [
    { code: '96.02', description: 'Frizerske i druge kozmetičke usluge' },
    { code: '47.75', description: 'Trgovina na malo kozmetičkim i toaletnim artiklima' },
    { code: '96.04', description: 'Usluge fizičke njege tijela' },
    { code: '85.32', description: 'Tehničko i strukovno obrazovanje' }, // Beauty schools
  ];

  /**
   * Validate Croatian OIB using the official algorithm
   */
  validateOIB(oib: string): { valid: boolean; formatted?: string; error?: string } {
    // Remove any spaces, dashes, or other characters
    const cleanOIB = oib.replace(/[^\d]/g, '');
    
    // Check length
    if (cleanOIB.length !== 11) {
      return { valid: false, error: 'OIB mora imati točno 11 znamenki' };
    }

    // Check if all digits are the same (invalid)
    if (/^(\d)\1{10}$/.test(cleanOIB)) {
      return { valid: false, error: 'OIB ne može se sastojati od istih znamenki' };
    }

    // Calculate control digit
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanOIB[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const controlDigit = remainder < 2 ? remainder : 11 - remainder;
    
    if (controlDigit !== parseInt(cleanOIB[10])) {
      return { valid: false, error: 'Neispravna kontrolna znamenka' };
    }

    return { 
      valid: true, 
      formatted: this.formatOIB(cleanOIB)
    };
  }

  /**
   * Format OIB for display (XX-XXX-XXX-XX)
   */
  formatOIB(oib: string): string {
    const cleanOIB = oib.replace(/[^\d]/g, '');
    if (cleanOIB.length === 11) {
      return `${cleanOIB.slice(0, 2)}-${cleanOIB.slice(2, 5)}-${cleanOIB.slice(5, 8)}-${cleanOIB.slice(8)}`;
    }
    return oib;
  }

  /**
   * Get Croatian counties and cities
   */
  getCroatianCounties(): CroatianCounty[] {
    return this.croatianCounties;
  }

  /**
   * Get cities by county
   */
  getCitiesByCounty(countyCode: string): string[] {
    const county = this.croatianCounties.find(c => c.code === countyCode);
    return county ? county.cities : [];
  }

  /**
   * Get beauty industry activity codes
   */
  getBeautyIndustryActivityCodes() {
    return this.beautyIndustryActivityCodes;
  }

  /**
   * Validate Croatian business registration requirements
   */
  validateBusinessRegistration(businessData: {
    oib: string;
    businessName: string;
    businessType: string;
    activityCode: string;
    address: any;
  }): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate OIB
    const oibValidation = this.validateOIB(businessData.oib);
    if (!oibValidation.valid) {
      errors.push(`OIB: ${oibValidation.error}`);
    }

    // Validate business name
    if (!businessData.businessName || businessData.businessName.length < 3) {
      errors.push('Naziv tvrtke mora imati najmanje 3 znakova');
    }

    // Validate business type
    const validBusinessTypes = ['obrt', 'doo', 'jdoo', 'ad', 'individual'];
    if (!validBusinessTypes.includes(businessData.businessType)) {
      errors.push('Neispravna vrsta poslovnog subjekta');
    }

    // Validate activity code
    if (!businessData.activityCode || !/^\d{2}\.\d{2}$/.test(businessData.activityCode)) {
      errors.push('Neispravna šifra djelatnosti (format: XX.XX)');
    }

    // Check if activity code is beauty-related
    const isBeautyIndustry = this.beautyIndustryActivityCodes.some(
      code => code.code === businessData.activityCode
    );
    if (!isBeautyIndustry) {
      warnings.push('Šifra djelatnosti nije povezana s kozmetičkom industrijom');
    }

    // Validate address
    if (!businessData.address?.city || !businessData.address?.postalCode) {
      errors.push('Adresa mora sadržavati grad i poštanski broj');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get business registration requirements by type
   */
  getRegistrationRequirements(businessType: string): {
    documents: string[];
    fees: { name: string; amount: number; currency: string }[];
    timeframe: string;
    authority: string;
  } {
    const baseRequirements = {
      documents: [
        'Zahtjev za upis u registar',
        'Osobna iskaznica vlasnika',
        'Potvrda o prebivalištu',
        'Dokaz o plaćanju pristojbe'
      ],
      fees: [],
      timeframe: '',
      authority: ''
    };

    switch (businessType) {
      case 'obrt':
        return {
          ...baseRequirements,
          documents: [
            ...baseRequirements.documents,
            'Dokaz o stručnoj osposobljenosti',
            'Potvrda o nekaznjavanju'
          ],
          fees: [
            { name: 'Pristojba za upis', amount: 200, currency: 'HRK' },
            { name: 'Objava u Narodnim novinama', amount: 150, currency: 'HRK' }
          ],
          timeframe: '8-15 radnih dana',
          authority: 'Hrvatska obrtnička komora'
        };

      case 'doo':
        return {
          ...baseRequirements,
          documents: [
            ...baseRequirements.documents,
            'Društveni ugovor',
            'Dokaz o uplaćenom temeljnom kapitalu (20.000 HRK)',
            'Odluka o imenovanju direktora'
          ],
          fees: [
            { name: 'Pristojba za upis', amount: 500, currency: 'HRK' },
            { name: 'Objava u Narodnim novinama', amount: 250, currency: 'HRK' }
          ],
          timeframe: '15-30 radnih dana',
          authority: 'Trgovački sud'
        };

      default:
        return baseRequirements;
    }
  }

  /**
   * Check professional licensing requirements for beauty industry
   */
  getBeautyLicenseRequirements(): {
    required: boolean;
    licenses: Array<{
      name: string;
      authority: string;
      duration: string;
      requirements: string[];
    }>;
  } {
    return {
      required: true,
      licenses: [
        {
          name: 'Licenca za kozmetičke usluge',
          authority: 'Ministarstvo zdravstva',
          duration: '5 godina',
          requirements: [
            'Završena srednja kozmetička škola ili tečaj',
            'Potvrda o zdravstvenoj sposobnosti',
            'Dokaz o poznavanju hrvatskog jezika',
            'Plaćena pristojba'
          ]
        },
        {
          name: 'Sanitarna dozvola',
          authority: 'Hrvatski zavod za javno zdravstvo',
          duration: '1 godina',
          requirements: [
            'Inspekcijski pregled prostora',
            'Dokaz o higijeni prostora',
            'Plan dezinfekcije i sterilizacije',
            'Evidencija o održavanju higijene'
          ]
        }
      ]
    };
  }
}
