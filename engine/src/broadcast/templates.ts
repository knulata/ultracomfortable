export const WA_TEMPLATES = {
  daily_trend_blast: {
    name: 'daily_trend_blast',
    language: 'id',
    buildBody: (params: { partnerName: string; trends: Array<{ name: string; score: number; partners: number }> }) => {
      const trendList = params.trends
        .map((t, i) => `${i + 1}. ${t.name} (skor: ${Math.round(t.score * 100)}, ${t.partners} partner)`)
        .join('\n')

      return `Selamat pagi, ${params.partnerName}! 🔥\n\nBerikut gaya trending hari ini yang cocok untuk Anda:\n\n${trendList}\n\nBalas BISA + nomor untuk komit. Contoh: BISA 1\nAtau buka dashboard: https://alyanoor.com/partner/dashboard/trends`
    },
  },

  live_alert: {
    name: 'live_alert',
    language: 'id',
    buildBody: (params: { styleName: string; views: string; category: string }) => {
      return `🔥 TRENDING SEKARANG!\n\n${params.styleName}\n${params.views} views dalam beberapa jam\nKategori: ${params.category}\n\nJadi yang pertama komit dan dapatkan listing eksklusif 48 jam!\n\nBalas BISA untuk komit.`
    },
  },

  commitment_confirmation: {
    name: 'commitment_confirmation',
    language: 'id',
    buildBody: (params: { styleName: string; quantity: number; price: number; leadTime: number }) => {
      const priceStr = new Intl.NumberFormat('id-ID').format(params.price)
      return `✅ Komitmen tercatat!\n\n${params.styleName}\n${params.quantity} pcs × Rp${priceStr}\nWaktu produksi: ${params.leadTime} hari\n\nTerima kasih! Kami akan memantau progres Anda.`
    },
  },

  monthly_scorecard: {
    name: 'monthly_scorecard',
    language: 'id',
    buildBody: (params: {
      partnerName: string
      modelsProduced: number
      soldThrough: number
      rank: number
      totalPartners: number
    }) => {
      return `📊 Laporan Bulanan - ${params.partnerName}\n\n📦 Model diproduksi: ${params.modelsProduced}\n💰 Terjual: ${params.soldThrough}%\n🏆 Peringkat: #${params.rank} dari ${params.totalPartners} partner\n\nTerus semangat! 💪`
    },
  },
} as const
