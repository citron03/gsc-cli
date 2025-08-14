#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';
import { authenticate, getAuthenticatedClient } from './auth';
import { inspectUrl, requestIndexing } from './gsc';
import { autoIndexFromRss } from './auto-index';

const program = new Command();

program
  .name('gsc-cli')
  .description('A CLI tool to manage Google SEO for a Tistory blog')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize the CLI with your Tistory blog URL and Google OAuth credentials')
  .action(async () => {
    try {
      const configExamplePath = path.join(process.cwd(), 'config.example.json');
      const configPath = path.join(process.cwd(), 'config.json');
      await fs.copyFile(configExamplePath, configPath);
      console.log('Successfully created config.json. Please edit this file with your credentials.');
      console.log('After editing, run "gsc-cli auth" to authenticate.');
    } catch (error) {
      console.error('Error creating config.json. Make sure config.example.json exists.', error);
    }
  });

program
  .command('auth')
  .description('Authenticate with Google to get access to the Search Console API')
  .action(async () => {
    try {
      await authenticate();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  });

program
  .command('inspect <url>')
  .description('Inspect a URL using the Google Search Console API')
  .action(async (url: string) => {
    try {
      const auth = await getAuthenticatedClient();
      console.log(`Inspecting URL: ${url}`);
      await inspectUrl(auth, url);
    } catch (error) {
      console.error('Error inspecting URL:', error);
    }
  });

program
  .command('request-indexing <url>')
  .description('Request indexing for a URL from Google')
  .action(async (url: string) => {
    try {
      const auth = await getAuthenticatedClient();
      console.log(`Requesting indexing for URL: ${url}`);
      await requestIndexing(auth, url);
    } catch (error) {
      console.error('Error requesting indexing:', error);
    }
  });

program
  .command('auto-index')
  .description('블로그 RSS에서 모든 포스트를 읽어 자동으로 인덱싱 요청을 보냅니다')
  .action(async () => {
    try {
      await autoIndexFromRss();
    } catch (error) {
      console.error('자동 인덱싱 요청 실패:', error);
    }
  });

program.parse(process.argv);
