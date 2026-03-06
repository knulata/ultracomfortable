'use client'

import { useState } from 'react'
import { Camera, Clock, Edit3, CheckCircle, Play, Image, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIntakeStore, IntakeItem, IntakeStatus } from '@/stores/intake'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

const statusConfig: Record<string, { label: { en: string; id: string }; color: string; icon: React.ElementType }> = {
  pending_photo: {
    label: { en: 'Waiting', id: 'Menunggu' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
  },
  photographing: {
    label: { en: 'Shooting', id: 'Difoto' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Camera,
  },
  editing: {
    label: { en: 'Editing', id: 'Diedit' },
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: Edit3,
  },
}

interface PhotoItemCardProps {
  item: IntakeItem
  onStartPhoto: () => void
  onCompletePhoto: () => void
  onCompleteEdit: () => void
}

function PhotoItemCard({ item, onStartPhoto, onCompletePhoto, onCompleteEdit }: PhotoItemCardProps) {
  const { language } = useTranslation()
  const status = statusConfig[item.status]
  const StatusIcon = status?.icon || Clock

  const waitingTime = Math.floor(
    (Date.now() - new Date(item.droppedOffAt).getTime()) / (1000 * 60 * 60)
  )

  return (
    <div className="bg-background border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            {item.photoCount > 0 ? (
              <Image className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{item.productName}</h3>
            <p className="text-sm text-muted-foreground">
              {item.shopName} • {item.quantity} pcs
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              SKU: {item.sku} • {language === 'id' ? 'Rak' : 'Rack'}: {item.rackLocation}
            </p>
          </div>
        </div>

        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status?.color}`}>
          <StatusIcon className="h-3 w-3" />
          {language === 'id' ? status?.label.id : status?.label.en}
        </span>
      </div>

      {/* Progress Info */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        {item.status === 'pending_photo' && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {language === 'id' ? `Menunggu ${waitingTime}j` : `Waiting ${waitingTime}h`}
          </span>
        )}
        {item.photoCount > 0 && (
          <span className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            {item.photoCount} {language === 'id' ? 'foto' : 'photos'}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {item.status === 'pending_photo' && (
          <Button size="sm" onClick={onStartPhoto} className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Mulai Foto' : 'Start Photo'}
          </Button>
        )}

        {item.status === 'photographing' && (
          <Button size="sm" onClick={onCompletePhoto} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Selesai Foto' : 'Done Shooting'}
          </Button>
        )}

        {item.status === 'editing' && (
          <Button size="sm" onClick={onCompleteEdit} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Selesai Edit' : 'Done Editing'}
          </Button>
        )}
      </div>
    </div>
  )
}

type FilterStatus = 'all' | 'pending_photo' | 'photographing' | 'editing'

export function PhotoQueue() {
  const { language } = useTranslation()
  const { getPhotoQueue, startPhotography, completePhotography, updateItemStatus } = useIntakeStore()
  const [filter, setFilter] = useState<FilterStatus>('all')

  const queue = getPhotoQueue()
  const filteredQueue = filter === 'all'
    ? queue
    : queue.filter((item) => item.status === filter)

  const statusCounts = {
    all: queue.length,
    pending_photo: queue.filter((i) => i.status === 'pending_photo').length,
    photographing: queue.filter((i) => i.status === 'photographing').length,
    editing: queue.filter((i) => i.status === 'editing').length,
  }

  const handleStartPhoto = (item: IntakeItem) => {
    startPhotography(item.id)
    toast.success(
      language === 'id'
        ? `Mulai foto ${item.productName}`
        : `Started shooting ${item.productName}`
    )
  }

  const handleCompletePhoto = (item: IntakeItem) => {
    // In real app, this would open a photo upload modal
    // For demo, we'll just mark it as complete with mock photos
    completePhotography(item.id, ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'])
    toast.success(
      language === 'id'
        ? `Foto ${item.productName} selesai`
        : `Photos for ${item.productName} completed`
    )
  }

  const handleCompleteEdit = (item: IntakeItem) => {
    updateItemStatus(item.id, 'pending_upload')
    toast.success(
      language === 'id'
        ? `${item.productName} siap untuk upload`
        : `${item.productName} ready for upload`
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending_photo', 'photographing', 'editing'] as FilterStatus[]).map((status) => {
          const config = status === 'all' ? null : statusConfig[status]
          const Icon = config?.icon

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {status === 'all'
                ? (language === 'id' ? 'Semua' : 'All')
                : (language === 'id' ? config?.label.id : config?.label.en)
              }
              {' '}({statusCounts[status]})
            </button>
          )
        })}
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{statusCounts.pending_photo}</p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {language === 'id' ? 'Antrian' : 'In Queue'}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{statusCounts.photographing}</p>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            {language === 'id' ? 'Difoto' : 'Shooting'}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{statusCounts.editing}</p>
          <p className="text-xs text-purple-700 dark:text-purple-400">
            {language === 'id' ? 'Diedit' : 'Editing'}
          </p>
        </div>
      </div>

      {/* Queue List */}
      {filteredQueue.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada item dalam antrian' : 'No items in queue'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((item) => (
            <PhotoItemCard
              key={item.id}
              item={item}
              onStartPhoto={() => handleStartPhoto(item)}
              onCompletePhoto={() => handleCompletePhoto(item)}
              onCompleteEdit={() => handleCompleteEdit(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
