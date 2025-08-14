import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as http from 'http';
import * as url from 'url';
import open from 'open';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Config, Credentials } from './types';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/indexing'
];

// Helper function to read config
async function readConfig(): Promise<Config> {
  try {
    const configStr = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(configStr);
  } catch (error) {
    console.error('Error reading config file. Please run "gsc-cli init" first.');
    process.exit(1);
  }
}

// Helper function to create an OAuth2 client
function createOAuth2Client(config: Config): OAuth2Client {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
}

// Main function to handle the authentication flow
export async function authenticate(): Promise<OAuth2Client> {
  const config = await readConfig();
  const oAuth2Client = createOAuth2Client(config);

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (req.url && req.url.indexOf('/oauth2callback') > -1) {
          const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
          const code = qs.get('code');
          res.end('Authentication successful! You can close this window.');
          server.close();

          if (code) {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);

            // Save credentials for future use
            const credentials: Credentials = {
              type: 'authorized_user',
              client_id: config.clientId,
              client_secret: config.clientSecret,
              refresh_token: tokens.refresh_token!,
            };
            await fs.writeFile(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2));
            console.log('Credentials saved successfully.');
            resolve(oAuth2Client);
          } else {
            reject(new Error('Failed to get authorization code.'));
          }
        }
      } catch (e) {
        reject(e);
      }
    }).listen(3000, () => {
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent' // Force consent screen to get a refresh token
      });
      console.log('Please log in to your Google account in the browser window that has been opened.');
      open(authorizeUrl, { wait: false });
    });
  });
}

// Function to get an authenticated client
export async function getAuthenticatedClient(): Promise<OAuth2Client> {
  try {
    // Check if credentials exist
    const credentialsStr = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
    const credentials = JSON.parse(credentialsStr) as Credentials;
    const config = await readConfig();
    const oAuth2Client = createOAuth2Client(config);
    oAuth2Client.setCredentials({ refresh_token: credentials.refresh_token });
    return oAuth2Client;
  } catch (error) {
    // If credentials don't exist, start the authentication flow
    console.log('Credentials not found. Starting authentication...');
    return authenticate();
  }
}
