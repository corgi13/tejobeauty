import { Controller, Post, Get, Body, Query } from "@nestjs/common";

import {
  AddressValidationService,
  AddressData,
} from "./address-validation.service";

@Controller("api/address")
export class AddressValidationController {
  constructor(
    private readonly addressValidationService: AddressValidationService,
  ) {}

  @Post("validate")
  validateAddress(@Body() address: AddressData) {
    return this.addressValidationService.validateAddress(address);
  }

  @Post("format")
  formatAddress(@Body() address: AddressData) {
    const formatted = this.addressValidationService.formatAddress(address);
    return { formatted };
  }

  @Get("croatian-cities")
  getCroatianCities() {
    return this.addressValidationService.getCroatianCities();
  }

  @Get("croatian-counties")
  getCroatianCounties() {
    return this.addressValidationService.getCroatianCounties();
  }

  @Get("postal-code-suggestions")
  getPostalCodeSuggestions(
    @Query("city") city: string,
    @Query("country") country: string = "HR",
  ) {
    if (country.toUpperCase() === "HR") {
      const cities = this.addressValidationService.getCroatianCities();
      const suggestions: string[] = [];

      for (const [postalCode, cityName] of Object.entries(cities)) {
        if (cityName.toLowerCase().includes(city.toLowerCase())) {
          suggestions.push(postalCode);
        }
      }

      return { suggestions };
    }

    return { suggestions: [] };
  }

  @Get("city-suggestions")
  getCitySuggestions(
    @Query("postalCode") postalCode: string,
    @Query("country") country: string = "HR",
  ) {
    if (country.toUpperCase() === "HR") {
      const cities = this.addressValidationService.getCroatianCities();
      const city = cities[postalCode];

      return { suggestions: city ? [city] : [] };
    }

    return { suggestions: [] };
  }
}
