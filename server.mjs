import express from 'express';
import cors from 'cors';
import handler from './api/comments.js';

const app = express();
app.use(cors());
app.use(express.json());

// Simulate the Vercel serverless environment
app.all('/api/comments', (req, res) => {
  handler(req, res);
});

app.all('/api/comments/like', (req, res) => {
  handler(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Local API Backend is running on http://localhost:${PORT}`);
  console.log(`✅ Angular proxy will forward /api requests here.\n`);
});
