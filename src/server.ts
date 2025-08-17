import express from 'express';
import { authenticate, getAuthenticatedClient } from './auth';
import { inspectUrl, requestIndexing } from './gsc';
import { autoIndexFromRss } from './auto-index';

const app = express();
app.use(express.json());

app.post('/api/auth', async (req, res) => {
  try {
    await authenticate();
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/inspect', async (req, res) => {
  try {
    const { url } = req.body;
    const auth = await getAuthenticatedClient();
    // 실제 결과를 반환하도록 수정 필요
    await inspectUrl(auth, url);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/request-indexing', async (req, res) => {
  try {
    const { url } = req.body;
    const auth = await getAuthenticatedClient();
    await requestIndexing(auth, url);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auto-index', async (req, res) => {
  try {
    await autoIndexFromRss();
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(4000, () => {
  console.log('API 서버가 4000번 포트에서 실행 중');
});