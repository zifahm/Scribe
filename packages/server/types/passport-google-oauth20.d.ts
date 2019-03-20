declare class index {
  static Strategy: any;
  name: any;
  constructor(options: any, verify: any);
  authenticate(req: any, options: any): any;
  authorizationParams(options: any): any;
  parseErrorResponse(body: any, status: any): any;
  tokenParams(options: any): any;
  userProfile(accessToken: any, done: any): void;
}
export default index;
