import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../../shared/api.interfaces';
import { errorCode } from '../../shared/error-codes';
import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetCityResult } from './cities.interfaces';
import { CitiesService } from './cities.service';

export class CitiesController {
  public constructor(private service: CitiesService) {
  }

  public getCity: ApiHandler = (
    event: ApiEvent, context: ApiContext, callback: ApiCallback,
  ): void => {
    // Input validation.
    if (!event.pathParameters || !event.pathParameters.id) {
      return ResponseBuilder
        .badRequest(errorCode.MissingId, 'Please specify the city ID!', callback);
    }

    if (isNaN(+event.pathParameters.id)) {
      return ResponseBuilder
        .badRequest(errorCode.InvalidId, 'The city ID must be a number!', callback);
    }

    const id: number = +event.pathParameters.id;
    this.service.getCity(id)
      .then((result: GetCityResult) => {
        return ResponseBuilder
          .ok<GetCityResult>(result, callback);
      })
      .catch((error: ErrorResult) => {
        if (error instanceof NotFoundResult) {
          return ResponseBuilder.notFound(error.code, error.description, callback);
        }

        if (error instanceof ForbiddenResult) {
          return ResponseBuilder.forbidden(error.code, error.description, callback);
        }

        return ResponseBuilder.internalServerError(error, callback);
      });
  }
}
