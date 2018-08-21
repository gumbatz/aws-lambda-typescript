import { ApiCallback, ApiResponse, ErrorResponseBody } from './api.interfaces';
import { errorCode } from './error-codes';
import { BadRequestResult, ConfigurationErrorResult, ErrorResult, ForbiddenResult,
  InternalServerErrorResult, NotFoundResult} from './errors';
import { httpStatusCode } from './http-status-codes';

/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
  public static badRequest(code: string, description: string, callback: ApiCallback): void {
    const errorResult: BadRequestResult = new BadRequestResult(code, description);
    ResponseBuilder.returnAs<BadRequestResult>(errorResult, httpStatusCode.BadRequest, callback);
  }

  public static configurationError(code: string, description: string, callback: ApiCallback): void {
    const errorResult: ConfigurationErrorResult = new ConfigurationErrorResult(code, description);
    ResponseBuilder.returnAs<ConfigurationErrorResult>(
      errorResult, httpStatusCode.ConfigurationError, callback);
  }

  public static forbidden(code: string, description: string, callback: ApiCallback): void {
    const errorResult: ForbiddenResult = new ForbiddenResult(code, description);
    ResponseBuilder.returnAs<ForbiddenResult>(errorResult, httpStatusCode.Forbidden, callback);
  }

  public static internalServerError(error: Error, callback: ApiCallback): void {
    const errorResult: InternalServerErrorResult =
      new InternalServerErrorResult(errorCode.GeneralError, 'Sorry...');
    ResponseBuilder.returnAs<InternalServerErrorResult>(
      errorResult, httpStatusCode.InternalServerError, callback);
  }

  public static notFound(code: string, description: string, callback: ApiCallback): void {
    const errorResult: NotFoundResult = new NotFoundResult(code, description);
    ResponseBuilder.returnAs<NotFoundResult>(errorResult, httpStatusCode.NotFound, callback);
  }

  public static ok<T>(result: T, callback: ApiCallback): void {
    ResponseBuilder.returnAs<T>(result, httpStatusCode.Ok, callback);
  }

  private static returnAs<T>(result: T, statusCode: number, callback: ApiCallback): void {
    const bodyObject: ErrorResponseBody | T = result instanceof ErrorResult
      ? { error: result }
      : result;
    const response: ApiResponse = {
      statusCode,
      body: JSON.stringify(bodyObject),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };

    callback(undefined, response);
  }
}
