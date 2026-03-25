import express from 'express'
import cron from 'node-cron'
import { config, validateConfig } from './config'
import { runScrapeJob } from './jobs/scrape-job'
import { runAnalyzeJob } from './jobs/analyze-job'
import { runScoreJob } from './jobs/score-job'
import { runBroadcastJob } from './jobs/broadcast-job'
import { runAlertJob } from './jobs/alert-job'
import { handleIncomingMessage, verifyWebhookSignature } from './broadcast/whatsapp'

validateConfig()

const app = express()
app.use(express.json())

// ── Health Check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// ── WhatsApp Webhook ──────────────────────────────────────
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const body = req.body
    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const message = changes?.value?.messages?.[0]

    if (message?.type === 'text') {
      await handleIncomingMessage(message.from, message.text.body)
    }

    res.sendStatus(200)
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      msg: 'Webhook processing failed',
      error: error instanceof Error ? error.message : String(error),
    }))
    res.sendStatus(200) // Always 200 to prevent WA retries
  }
})

// ── Manual Triggers (for testing) ─────────────────────────
app.post('/trigger/scrape', async (_req, res) => {
  const count = await runScrapeJob(['shopee'])
  res.json({ status: 'ok', itemsInserted: count })
})

app.post('/trigger/analyze', async (_req, res) => {
  const count = await runAnalyzeJob()
  res.json({ status: 'ok', itemsAnalyzed: count })
})

app.post('/trigger/score', async (_req, res) => {
  await runScoreJob()
  res.json({ status: 'ok' })
})

app.post('/trigger/broadcast', async (_req, res) => {
  await runBroadcastJob()
  res.json({ status: 'ok' })
})

app.post('/trigger/full-pipeline', async (_req, res) => {
  console.log(JSON.stringify({ level: 'info', msg: 'Full pipeline triggered manually' }))
  const scraped = await runScrapeJob(['shopee'])
  const analyzed = await runAnalyzeJob()
  await runScoreJob()
  res.json({ status: 'ok', scraped, analyzed })
})

// ── Cron Schedules ────────────────────────────────────────

// Scrape Shopee every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log(JSON.stringify({ level: 'info', msg: 'Cron: scrape job starting' }))
  const scraped = await runScrapeJob(['shopee'])
  const analyzed = await runAnalyzeJob()
  await runScoreJob()
  console.log(JSON.stringify({ level: 'info', msg: 'Cron: scrape pipeline complete', scraped, analyzed }))
})

// Daily broadcast at 00:00 UTC (7 AM WIB)
cron.schedule('0 0 * * *', async () => {
  console.log(JSON.stringify({ level: 'info', msg: 'Cron: daily broadcast starting' }))
  await runBroadcastJob()
})

// Check for viral trends every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  await runAlertJob()
})

// ── Start Server ──────────────────────────────────────────
app.listen(config.port, () => {
  console.log(JSON.stringify({
    level: 'info',
    msg: `Alyanoor Engine running on port ${config.port}`,
    crons: {
      scrape: 'every 4 hours',
      broadcast: 'daily 00:00 UTC (7 AM WIB)',
      alerts: 'every 30 minutes',
    },
  }))
})
