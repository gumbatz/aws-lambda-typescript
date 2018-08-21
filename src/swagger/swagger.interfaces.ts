export interface GetSwaggerResult {
  info: {
    title: string;
    version: string;
  };
  paths: {
    [x: string]: {
      options?: {
        [x: string]: any;
      };
      [x: string]: any;
    };
  };
  [x: string]: any;
}
