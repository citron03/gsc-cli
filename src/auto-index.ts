import { getAuthenticatedClient } from './auth';
import { requestIndexing } from './gsc';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Config } from './types';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

async function getBlogRssUrl(): Promise<string> {
  const configStr = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config: Config = JSON.parse(configStr);
  // 티스토리 RSS는 blogUrl/rss 형태
  return config.blogUrl.replace(/\/$/, '') + '/rss';
}

export async function autoIndexFromRss() {
  const rssUrl = await getBlogRssUrl();
  console.log(`RSS 피드에서 포스트 목록을 가져옵니다: ${rssUrl}`);

  const res = await fetch(rssUrl);
  if (!res.ok) {
    throw new Error(`RSS 피드 요청 실패: ${res.statusText}`);
  }
  const xml = await res.text();
  const parsed = await parseStringPromise(xml);

  // 티스토리 RSS는 channel > item 배열
  const items = parsed.rss.channel[0].item;
  if (!items || items.length === 0) {
    console.log('RSS에서 포스트를 찾을 수 없습니다.');
    return;
  }

  const urls = items.map((item: any) => item.link[0]);
  const auth = await getAuthenticatedClient();

  for (const url of urls) {
    try {
      console.log(`인덱싱 요청: ${url}`);
      await requestIndexing(auth, url);
    } catch (e) {
      console.error(`인덱싱 요청 실패: ${url}`, e);
    }
  }
  console.log('RSS 기반 자동 인덱싱 요청 완료!');
}