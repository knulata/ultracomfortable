'use client'

import { Package, Camera, Edit3, Upload, CheckCircle, Clock } from 'lucide-react'
import { useIntakeStore } from '@/stores/intake'
import { useTranslation } from '@/stores/language'

export function IntakeStats() {
  const { language } = useTranslation()
  const { getIntakeStats } = useIntakeStore()
  const stats = getIntakeStats()

  const statCards = [
    {
      icon: Package,
      label: language === 'id' ? 'Total Item' : 'Total Items',
      value: stats.totalItems,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: Clock,
      label: language === 'id' ? 'Drop-off Hari Ini' : 'Today Drop-offs',
      value: stats.todayDropoffs,
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      icon: Camera,
      label: language === 'id' ? 'Antrian Foto' : 'Photo Queue',
      value: stats.pendingPhoto,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      alert: stats.pendingPhoto > 5,
    },
    {
      icon: Edit3,
      label: language === 'id' ? 'Dalam Proses' : 'In Progress',
      value: stats.inProgress,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Upload,
      label: language === 'id' ? 'Siap Upload' : 'Ready to List',
      value: stats.readyToList,
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      alert: stats.readyToList > 0,
    },
    {
      icon: CheckCircle,
      label: language === 'id' ? 'Aktif di Store' : 'Active in Store',
      value: stats.active,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-background border rounded-xl p-4 ${
            stat.alert ? 'border-primary ring-1 ring-primary/20' : ''
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
