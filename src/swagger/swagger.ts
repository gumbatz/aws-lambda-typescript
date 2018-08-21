import { APIGateway } from 'aws-sdk';

import { ApiHandler } from '../../shared/api.interfaces';
import { SwaggerController } from './swagger.controller';
import { SwaggerRepository } from './swagger.repository';
import { SwaggerService } from './swagger.service';

const defaultRegion: string = <string> (process.env.REGION_NAME || process.env.AWS_REGION);
const apiGateway: APIGateway = new APIGateway({ region: defaultRegion });

const repo: SwaggerRepository = new SwaggerRepository(apiGateway);
const service: SwaggerService = new SwaggerService(repo, process.env);
const controller: SwaggerController = new SwaggerController(service);

export const getSwaggerJson: ApiHandler = controller.getSwaggerJson;
