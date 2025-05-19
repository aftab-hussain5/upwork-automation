import { OAuth } from 'oauth';

// Types
export interface OAuthTokens {
  accessToken: string;
  accessTokenSecret: string;
}

export interface RequestTokenResponse {
  oauthToken: string;
  oauthTokenSecret: string;
  redirectURL: string;
}

export class UpworkOAuth {
  private oauth: OAuth;
  private consumerKey: string;
  private consumerSecret: string;
  private callbackURL: string;

  constructor() {
    // Get credentials from environment variables
    this.consumerKey = process.env.UPWORK_CONSUMER_KEY || '';
    this.consumerSecret = process.env.UPWORK_CONSUMER_SECRET || '';
    
    // Validate credentials
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('Missing Upwork OAuth credentials. Please check UPWORK_CONSUMER_KEY and UPWORK_CONSUMER_SECRET environment variables.');
    }

    // Base URL should be configurable for different environments
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.callbackURL = `${baseUrl}/auth/upwork/callback`;

    // Initialize OAuth
    this.oauth = new OAuth(
      'https://www.upwork.com/api/auth/v1/oauth/token/request',
      'https://www.upwork.com/api/auth/v1/oauth/token/access',
      this.consumerKey,
      this.consumerSecret,
      '1.0',
      this.callbackURL,
      'HMAC-SHA1'
    );
  }

  /**
   * Get request token and create the redirect URL for authorization
   */
  getRequestToken(): Promise<RequestTokenResponse> {
    return new Promise((resolve, reject) => {
      console.log('Requesting OAuth token from Upwork...');
      console.log('Using callback URL:', this.callbackURL);

      this.oauth.getOAuthRequestToken((error : any, oauthToken : any, oauthTokenSecret : any, results : any) => {
        if (error) {
          // Log detailed error information
          console.error('Detailed OAuth error:', {
            message: error.message,
            statusCode: error.statusCode,
            data: error.data,
            results: results
          });

          if (error.statusCode === 401) {
            return reject(new Error('Authentication failed. Please verify your Upwork API credentials.'));
          }

          return reject(new Error(`Failed to get request token: ${error.message}`));
        }

        if (!oauthToken || !oauthTokenSecret) {
          console.error('Missing OAuth tokens in response:', { oauthToken, oauthTokenSecret, results });
          return reject(new Error('Invalid response from Upwork OAuth service'));
        }

        const redirectURL = `https://www.upwork.com/services/api/auth?oauth_token=${oauthToken}`;
        console.log('Successfully obtained request token');
        
        resolve({
          oauthToken,
          oauthTokenSecret,
          redirectURL
        });
      });
    });
  }

  /**
   * Exchange the request token for an access token
   */
  getAccessToken(
    oauthToken: string,
    oauthTokenSecret: string,
    oauthVerifier: string
  ): Promise<OAuthTokens> {
    return new Promise((resolve, reject) => {
      if (!oauthToken || !oauthTokenSecret || !oauthVerifier) {
        return reject(new Error('Missing required OAuth parameters'));
      }

      console.log('Exchanging request token for access token...');

      this.oauth.getOAuthAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, accessToken, accessTokenSecret, results) => {
          if (error) {
            console.error('Access token error:', {
              message: error.message,
              statusCode: error.statusCode,
              data: error.data,
              results: results
            });
            return reject(new Error(`Failed to get access token: ${error.message}`));
          }

          if (!accessToken || !accessTokenSecret) {
            console.error('Missing access tokens in response:', { accessToken, accessTokenSecret, results });
            return reject(new Error('Invalid response from Upwork OAuth service'));
          }

          console.log('Successfully obtained access token');
          resolve({
            accessToken,
            accessTokenSecret
          });
        }
      );
    });
  }
  
  /**
   * Make an authenticated API call
   */
  makeApiCall(
    accessToken: string,
    accessTokenSecret: string,
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!accessToken || !accessTokenSecret) {
        return reject(new Error('Missing OAuth credentials for API call'));
      }

      console.log(`Making ${method} request to ${url}`);

      const callback = (error: any, data: any, response: any) => {
        if (error) {
          console.error('API call error:', {
            url,
            method,
            statusCode: error.statusCode,
            message: error.message,
            data: error.data
          });
          return reject(error);
        }
        
        try {
          const parsedData = JSON.parse(data);
          console.log(`Successful ${method} request to ${url}`);
          resolve(parsedData);
        } catch (e) {
          console.log(`Successful ${method} request to ${url} (raw response)`);
          resolve(data);
        }
      };
      
      if (method === 'GET') {
        this.oauth.get(url, accessToken, accessTokenSecret, callback);
      } else if (method === 'POST') {
        this.oauth.post(url, accessToken, accessTokenSecret, data, 'application/json', callback);
      } else if (method === 'PUT') {
        this.oauth.put(url, accessToken, accessTokenSecret, data, 'application/json', callback);
      } else if (method === 'DELETE') {
        this.oauth.delete(url, accessToken, accessTokenSecret, callback);
      }
    });
  }
}