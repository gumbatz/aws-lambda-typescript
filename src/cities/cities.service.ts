import { ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { City, GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';

export class CitiesService {
  public constructor(private repo: CitiesRepository, private env: NodeJS.ProcessEnv) {
  }

  public getCity(id: number): Promise<GetCityResult> {
    return new Promise((
      resolve: (result: GetCityResult) => void, reject: (reason: NotFoundResult) => void,
    ): void => {
      if (!this.repo.exists(id)) {
        reject(new NotFoundResult('UNKNOWN_CITY', 'There is no city with the specified ID!'));
        return;
      }

      if (!this.repo.hasAccess(id)) {
        reject(new ForbiddenResult(
          'PERMISSION_REQUIRED',
          'You have no permission to access the city with the specified ID!'));
        return;
      }

      const defaultCountry: string = this.env.DEFAULT_COUNTRY || 'Hungary';
      const city: City = this.repo.getCity(id, defaultCountry);
      const result: GetCityResult = {
        city,
      };

      resolve(result);
    });
  }
}
