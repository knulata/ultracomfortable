import { sendDailyBroadcast } from '../broadcast/whatsapp'

export async function runBroadcastJob(): Promise<void> {
  console.log(JSON.stringify({ level: 'info', msg: 'Starting daily broadcast job' }))
  await sendDailyBroadcast()
  console.log(JSON.stringify({ level: 'info', msg: 'Daily broadcast job complete' }))
}
