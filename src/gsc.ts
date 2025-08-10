import { google, searchconsole_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Config } from './types';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

async function getBlogUrl(): Promise<string> {
  const configStr = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config: Config = JSON.parse(configStr);
  return config.blogUrl;
}

const searchconsole = google.searchconsole('v1');
const indexing = google.indexing('v3');

export async function inspectUrl(auth: OAuth2Client, url: string): Promise<void> {
  const blogUrl = await getBlogUrl();
  const res = await searchconsole.urlInspection.index.inspect({
    auth: auth,
    requestBody: {
      inspectionUrl: url,
      siteUrl: blogUrl,
    },
  });

  console.log('Inspection Result:');
  console.log(JSON.stringify(res.data, null, 2));
}

export async function requestIndexing(auth: OAuth2Client, url: string): Promise<void> {
  const res = await indexing.urlNotifications.publish({
    auth: auth,
    requestBody: {
      url: url,
      type: 'URL_UPDATED',
    },
  });

  console.log('Indexing Request Result:');
  console.log(JSON.stringify(res.data, null, 2));
}
