import { OAuth2Client } from 'google-auth-library';

export interface Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  blogUrl: string;
}

export interface Credentials {
  type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export interface AuthenticatedAuth extends OAuth2Client {}
