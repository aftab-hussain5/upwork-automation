declare module 'oauth' {
  export class OAuth {
    constructor(
      requestUrl: string,
      accessUrl: string,
      consumerKey: string,
      consumerSecret: string,
      version: string,
      authorize_callback: string | null,
      signatureMethod: string,
      nonceSize?: number,
      customHeaders?: object
    );

    getOAuthRequestToken(
      extraParams?: object,
      callback?: (
        error: any,
        oauthToken: string,
        oauthTokenSecret: string,
        results?: any
      ) => void
    ): void;

    getOAuthAccessToken(
      oauthToken: string,
      oauthTokenSecret: string,
      oauthVerifier: string,
      callback?: (
        error: any,
        accessToken: string,
        accessTokenSecret: string,
        results?: any
      ) => void
    ): void;

    get(
      url: string,
      accessToken: string,
      accessTokenSecret: string,
      callback?: (error: any, data: any, response: any) => void
    ): void;

    post(
      url: string,
      accessToken: string,
      accessTokenSecret: string,
      data: any,
      contentType: string,
      callback?: (error: any, data: any, response: any) => void
    ): void;

    put(
      url: string,
      accessToken: string,
      accessTokenSecret: string,
      data: any,
      contentType: string,
      callback?: (error: any, data: any, response: any) => void
    ): void;

    delete(
      url: string,
      accessToken: string,
      accessTokenSecret: string,
      callback?: (error: any, data: any, response: any) => void
    ): void;
  }
}