'use client'

import { useState, useCallback } from 'react'
import { Camera, Upload, Image as ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface PhotoUploaderProps {
  onUpload: (file: File, type: 'stock' | 'fabric') => void
  isUploading: boolean
  uploadProgress?: number
  language?: 'id' | 'en'
}

export function PhotoUploader({ onUpload, isUploading, uploadProgress, language = 'id' }: PhotoUploaderProps) {
  const [photoType, setPhotoType] = useState<'stock' | 'fabric'>('stock')
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error(language === 'id' ? 'Format harus JPG atau PNG' : 'Must be JPG or PNG')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === 'id' ? 'Ukuran maksimal 5MB' : 'Max size 5MB')
        return
      }
      onUpload(file, photoType)
    },
    [onUpload, photoType, language]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">
          {language === 'id' ? 'Cocokkan Stok Anda' : 'Match Your Stock'}
        </h3>
      </div>

      {/* Type toggle */}
      <div className="flex gap-2">
        <Badge
          variant={photoType === 'stock' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setPhotoType('stock')}
        >
          <ImageIcon className="mr-1 h-3 w-3" />
          {language === 'id' ? 'Foto Stok' : 'Stock Photo'}
        </Badge>
        <Badge
          variant={photoType === 'fabric' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setPhotoType('fabric')}
        >
          🧵 {language === 'id' ? 'Foto Kain' : 'Fabric Photo'}
        </Badge>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
      >
        {isUploading ? (
          <div className="w-full space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${uploadProgress ?? 50}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {language === 'id' ? 'Mengunggah...' : 'Uploading...'}
            </p>
          </div>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">
              {language === 'id'
                ? photoType === 'stock'
                  ? 'Foto stok produk Anda'
                  : 'Foto kain yang Anda miliki'
                : photoType === 'stock'
                  ? 'Photo of your product stock'
                  : 'Photo of your fabric'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {language === 'id' ? 'Seret atau klik untuk unggah' : 'Drag or click to upload'}
              {' · JPG/PNG · Max 5MB'}
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </>
        )}
      </div>
    </div>
  )
}
