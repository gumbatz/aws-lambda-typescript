import { City } from './cities.interfaces';

export class CitiesRepository {
  public exists(id: number): boolean {
    return id > 0;
  }

  public getCity(id: number, defaultCountry: string): City {
    return {
      id,
      country: defaultCountry,
      name: 'Budapest',
      populationDensity: Math.random(),
    };
  }

  public hasAccess(id: number): boolean {
    return id !== 666;
  }
}
