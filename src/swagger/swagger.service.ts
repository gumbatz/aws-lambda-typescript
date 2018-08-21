import { AWSError } from 'aws-sdk';
import { errorCode } from '../../shared/error-codes';
import { ConfigurationErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult }
  from '../../shared/errors';
import { GetSwaggerResult } from './swagger.interfaces';
import { SwaggerRepository } from './swagger.repository';

export class SwaggerService {
  public constructor(private repo: SwaggerRepository, private env: NodeJS.ProcessEnv) {
  }

  public getSwaggerDescription(): Promise<GetSwaggerResult> {
    if (!this.env.REST_API_NAME) {
      return Promise.reject(new ConfigurationErrorResult(
        errorCode.MissingEnv, 'The REST_API_NAME environment variable is missing!'));
    }

    if (!this.env.STAGE_NAME) {
      return Promise.reject(new ConfigurationErrorResult(
        errorCode.MissingEnv, 'The STAGE_NAME environment variable is missing!'));
    }

    if (!this.env.API_INFO_TITLE) {
      return Promise.reject(new ConfigurationErrorResult(
        errorCode.MissingEnv, 'The API_INFO_TITLE environment variable is missing!'));
    }

    if (!this.env.API_INFO_VERSION) {
      return Promise.reject(new ConfigurationErrorResult(
        errorCode.MissingEnv, 'The API_INFO_VERSION environment variable is missing!'));
    }

    /* tslint:disable:no-unnecessary-type-assertion - False positive */
    const restApiName: string = <string> this.env.REST_API_NAME;
    const stageName: string = <string> this.env.STAGE_NAME;
    const title: string = <string> this.env.API_INFO_TITLE;
    const version: string = <string> this.env.API_INFO_VERSION;
    /* tslint:enable:no-unnecessary-type-assertion */

    return this.repo.getRestApiId(stageName, restApiName)
      .then((restApiId: string | undefined) => {
        if (!restApiId) {
          throw new NotFoundResult(
            errorCode.InvalidName, 'Cannot find the API with the specified name!');
        }

        return this.repo.getSwaggerDescription(restApiId, stageName);
      })
      .then((jsonDesc: string) => {
        const result: GetSwaggerResult = <GetSwaggerResult> JSON.parse(jsonDesc);

        // Remove the /swagger.json path from the documentation.
        delete result.paths['/swagger.json'];

        // Remove the OPTIONS endpoints generated automatically because CORS is enabled.
        for (const pathName in result.paths) {
          if (result.paths[pathName].options) {
            delete result.paths[pathName].options;
          }
        }

        result.info.title = title;
        result.info.version = version;

        return result;
      })
      .catch((error: AWSError | NotFoundResult) => {
        if (error.code === 'AccessDeniedException') {
          throw new ForbiddenResult(errorCode.MissingPermission, error.message);
        }

        if (error instanceof NotFoundResult) {
          throw error;
        }

        throw new InternalServerErrorResult(error.name, error.message);
      });
  }
}
