import { expect } from 'chai';
import * as rp from 'request-promise-native';

import { httpStatusCode } from '../../shared/http-status-codes';
import { GetSwaggerResult } from '../../src/swagger/swagger.interfaces';
import { ApiClient } from './api-client';

describe('Swagger', () => {
  let response: rp.FullResponse;
  let responseBody: GetSwaggerResult;

  before(async () => {
    const client: ApiClient = new ApiClient();
    response = await client.getSwaggerJson() as rp.FullResponse;
    responseBody = JSON.parse(response.body as string) as GetSwaggerResult;
  });

  it('should return 200 OK', async () => {
    expect(response.statusCode).to.eql(httpStatusCode.Ok);
  });

  it('should return API info', async () => {
    expect(responseBody.info.title).to.be.not.undefined;
    expect(responseBody.info.version).to.be.not.undefined;
  });

  it('should return CORS headers', () => {
    const corsHeaderValue: string = <string> response.headers['access-control-allow-origin'];
    expect(corsHeaderValue).to.eql('*');
  });
});
