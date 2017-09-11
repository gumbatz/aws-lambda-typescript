import { ApiCallback, ApiResponse } from './api.interfaces';
import { ErrorCode } from './error-codes';
import { BadRequestResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from './errors';
import { HttpStatusCode } from './http-status-codes';

/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
  public static badRequest(code: string, description: string, callback: ApiCallback): void {
    const errorResult: BadRequestResult = new BadRequestResult(code, description);
    ResponseBuilder._returnAs<BadRequestResult>(errorResult, HttpStatusCode.BadRequest, callback);
  }

  public static forbidden(code: string, description: string, callback: ApiCallback): void {
    const errorResult: ForbiddenResult = new ForbiddenResult(code, description);
    ResponseBuilder._returnAs<ForbiddenResult>(errorResult, HttpStatusCode.Forbidden, callback);
  }

  public static internalServerError(error: Error, callback: ApiCallback): void {
    // TODO: Implement stack trace logging.
    const errorResult: InternalServerErrorResult = new InternalServerErrorResult(ErrorCode.GeneralError, 'Sorry...');
    ResponseBuilder._returnAs<InternalServerErrorResult>(errorResult, HttpStatusCode.InternalServerError, callback);
  }

  public static notFound(code: string, description: string, callback: ApiCallback): void {
    const errorResult: NotFoundResult = new NotFoundResult(code, description);
    ResponseBuilder._returnAs<NotFoundResult>(errorResult, HttpStatusCode.NotFound, callback);
  }

  public static ok<T>(result: T, callback: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, HttpStatusCode.Ok, callback);
  }

  private static _returnAs<T>(result: T, statusCode: number, callback: ApiCallback): void {
    const response: ApiResponse = {
      body: JSON.stringify(result),
      statusCode
    };

    callback(undefined, response);
  }
}