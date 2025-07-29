import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CroatiaTaxService } from './croatia-tax.service';
import { CroatiaBusinessService } from './croatia-business.service';
import { CroatiaShippingService } from './croatia-shipping.service';

@ApiTags('Croatia')
@Controller('croatia')
export class CroatiaController {
  constructor(
    private readonly taxService: CroatiaTaxService,
    private readonly businessService: CroatiaBusinessService,
    private readonly shippingService: CroatiaShippingService,
  ) {}

  @Get('tax/rates')
  @ApiOperation({ summary: 'Get Croatian tax rates (PDV)' })
  @ApiResponse({ status: 200, description: 'Croatian tax rates' })
  getTaxRates() {
    return {
      success: true,
      data: this.taxService.getTaxRates(),
      description: 'Croatian PDV (VAT) rates for different product categories'
    };
  }

  @Post('tax/calculate')
  @ApiOperation({ summary: 'Calculate Croatian PDV for order' })
  @ApiResponse({ status: 200, description: 'Tax calculation result' })
  calculateTax(@Body() body: {
    subtotal: number;
    category?: 'cosmetic' | 'tool' | 'essential';
  }) {
    const calculation = this.taxService.calculatePDV(
      body.subtotal,
      body.category || 'cosmetic'
    );

    return {
      success: true,
      data: calculation,
      formatted: this.taxService.formatPDVForInvoice(calculation)
    };
  }

  @Post('tax/calculate-multi')
  @ApiOperation({ summary: 'Calculate Croatian PDV for multiple items' })
  @ApiResponse({ status: 200, description: 'Multi-item tax calculation' })
  calculateMultiItemTax(@Body() body: {
    items: Array<{
      price: number;
      quantity: number;
      category: 'cosmetic' | 'tool' | 'essential';
    }>;
  }) {
    const calculation = this.taxService.calculateMultiItemPDV(body.items);

    return {
      success: true,
      data: calculation,
      formatted: this.taxService.formatPDVForInvoice(calculation)
    };
  }

  @Get('business/oib/validate/:oib')
  @ApiOperation({ summary: 'Validate Croatian OIB' })
  @ApiParam({ name: 'oib', description: 'Croatian OIB to validate' })
  @ApiResponse({ status: 200, description: 'OIB validation result' })
  validateOIB(@Param('oib') oib: string) {
    const validation = this.businessService.validateOIB(oib);
    return {
      success: true,
      data: validation
    };
  }

  @Get('business/counties')
  @ApiOperation({ summary: 'Get Croatian counties and cities' })
  @ApiResponse({ status: 200, description: 'List of Croatian counties' })
  getCroatianCounties() {
    return {
      success: true,
      data: this.businessService.getCroatianCounties()
    };
  }

  @Get('business/counties/:code/cities')
  @ApiOperation({ summary: 'Get cities by county code' })
  @ApiParam({ name: 'code', description: 'County code (e.g., ZG, ST, RI)' })
  @ApiResponse({ status: 200, description: 'List of cities in county' })
  getCitiesByCounty(@Param('code') code: string) {
    return {
      success: true,
      data: this.businessService.getCitiesByCounty(code)
    };
  }

  @Get('business/activity-codes')
  @ApiOperation({ summary: 'Get beauty industry activity codes' })
  @ApiResponse({ status: 200, description: 'Beauty industry activity codes' })
  getBeautyActivityCodes() {
    return {
      success: true,
      data: this.businessService.getBeautyIndustryActivityCodes()
    };
  }

  @Post('business/validate-registration')
  @ApiOperation({ summary: 'Validate Croatian business registration data' })
  @ApiResponse({ status: 200, description: 'Business registration validation' })
  validateBusinessRegistration(@Body() businessData: {
    oib: string;
    businessName: string;
    businessType: string;
    activityCode: string;
    address: any;
  }) {
    const validation = this.businessService.validateBusinessRegistration(businessData);
    return {
      success: true,
      data: validation
    };
  }

  @Get('business/registration-requirements/:type')
  @ApiOperation({ summary: 'Get business registration requirements by type' })
  @ApiParam({ name: 'type', description: 'Business type (obrt, doo, jdoo, ad)' })
  @ApiResponse({ status: 200, description: 'Registration requirements' })
  getRegistrationRequirements(@Param('type') type: string) {
    return {
      success: true,
      data: this.businessService.getRegistrationRequirements(type)
    };
  }

  @Get('business/beauty-license-requirements')
  @ApiOperation({ summary: 'Get beauty industry licensing requirements' })
  @ApiResponse({ status: 200, description: 'Beauty license requirements' })
  getBeautyLicenseRequirements() {
    return {
      success: true,
      data: this.businessService.getBeautyLicenseRequirements()
    };
  }

  @Get('shipping/zones')
  @ApiOperation({ summary: 'Get Croatian shipping zones' })
  @ApiResponse({ status: 200, description: 'List of shipping zones' })
  getShippingZones() {
    return {
      success: true,
      data: this.shippingService.getAllShippingZones()
    };
  }

  @Get('shipping/calculate')
  @ApiOperation({ summary: 'Calculate shipping cost for Croatian city' })
  @ApiQuery({ name: 'city', description: 'Croatian city name' })
  @ApiQuery({ name: 'orderValue', description: 'Order value in EUR' })
  @ApiQuery({ name: 'method', description: 'Shipping method', enum: ['standard', 'express'], required: false })
  @ApiResponse({ status: 200, description: 'Shipping calculation' })
  calculateShipping(
    @Query('city') city: string,
    @Query('orderValue') orderValue: string,
    @Query('method') method: 'standard' | 'express' = 'standard'
  ) {
    const calculation = this.shippingService.calculateShipping(
      city,
      parseFloat(orderValue),
      method
    );

    if (!calculation) {
      return {
        success: false,
        error: 'Shipping zone not found for the specified city'
      };
    }

    return {
      success: true,
      data: calculation
    };
  }

  @Get('shipping/options')
  @ApiOperation({ summary: 'Get all shipping options for Croatian city' })
  @ApiQuery({ name: 'city', description: 'Croatian city name' })
  @ApiQuery({ name: 'orderValue', description: 'Order value in EUR' })
  @ApiResponse({ status: 200, description: 'All shipping options' })
  getShippingOptions(
    @Query('city') city: string,
    @Query('orderValue') orderValue: string
  ) {
    const options = this.shippingService.getShippingOptions(
      city,
      parseFloat(orderValue)
    );

    return {
      success: true,
      data: options,
      sameDayAvailable: this.shippingService.isSameDayDeliveryAvailable(city),
      freeShippingThreshold: this.shippingService.getFreeShippingThreshold(city)
    };
  }

  @Get('holidays')
  @ApiOperation({ summary: 'Get Croatian holidays for 2025' })
  @ApiResponse({ status: 200, description: 'List of Croatian holidays' })
  getCroatianHolidays() {
    return {
      success: true,
      data: this.shippingService.getCroatianHolidays()
    };
  }

  @Get('holidays/check/:date')
  @ApiOperation({ summary: 'Check if date is Croatian holiday' })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Holiday check result' })
  checkHoliday(@Param('date') date: string) {
    const holiday = this.shippingService.isHoliday(date);
    return {
      success: true,
      data: {
        isHoliday: !!holiday,
        holiday: holiday || null
      }
    };
  }

  @Get('tax/benefits')
  @ApiOperation({ summary: 'Check Croatian tax benefits for business' })
  @ApiQuery({ name: 'businessType', description: 'Business type' })
  @ApiQuery({ name: 'annualRevenue', description: 'Annual revenue in EUR' })
  @ApiResponse({ status: 200, description: 'Tax benefits information' })
  checkTaxBenefits(
    @Query('businessType') businessType: 'salon' | 'spa' | 'individual' | 'retail',
    @Query('annualRevenue') annualRevenue: string
  ) {
    const benefits = this.taxService.checkTaxBenefits(
      businessType,
      parseFloat(annualRevenue)
    );

    return {
      success: true,
      data: benefits
    };
  }
}
