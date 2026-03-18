'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType =
  | 'order'           // Order status updates
  | 'promo'           // Promotional notifications
  | 'price_drop'      // Wishlist price drop
  | 'flash_sale'      // Flash sale starting/ending
  | 'coupon'          // Coupon expiring or new coupon
  | 'check_in'        // Check-in reminder
  | 'points'          // Points earned/expiring
  | 'restock'         // Item back in stock
  | 'system'          // System notifications

export interface Notification {
  id: string
  type: NotificationType
  title: string
  titleId: string
  message: string
  messageId: string
  link?: string
  image?: string
  isRead: boolean
  createdAt: number
  expiresAt?: number
  data?: Record<string, any>
}

interface NotificationsState {
  notifications: Notification[]
  isOpen: boolean

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  togglePanel: () => void
  openPanel: () => void
  closePanel: () => void

  // Getters
  getUnreadCount: () => number
  getNotificationsByType: (type: NotificationType) => Notification[]
}

// Generate mock notifications
const generateMockNotifications = (): Notification[] => {
  const now = Date.now()
  const hour = 60 * 60 * 1000
  const day = 24 * hour

  return [
    {
      id: 'n1',
      type: 'flash_sale',
      title: 'Flash Sale Live Now!',
      titleId: 'Flash Sale Sedang Berlangsung!',
      message: 'Mega Monday Sale with up to 50% off. Ends in 4 hours!',
      messageId: 'Promo Mega Senin diskon hingga 50%. Berakhir dalam 4 jam!',
      link: '/flash-sale',
      isRead: false,
      createdAt: now - (2 * hour),
    },
    {
      id: 'n2',
      type: 'order',
      title: 'Order Shipped',
      titleId: 'Pesanan Dikirim',
      message: 'Your order #UC-12345678 has been shipped and is on its way!',
      messageId: 'Pesanan #UC-12345678 telah dikirim dan sedang dalam perjalanan!',
      link: '/account/orders/12345678',
      isRead: false,
      createdAt: now - (5 * hour),
    },
    {
      id: 'n3',
      type: 'price_drop',
      title: 'Price Drop Alert!',
      titleId: 'Harga Turun!',
      message: 'Oversized Cotton Tee in your wishlist is now 30% off!',
      messageId: 'Kaos Oversized Katun di wishlist Anda sekarang diskon 30%!',
      link: '/products/oversized-cotton-tee',
      isRead: false,
      createdAt: now - (12 * hour),
    },
    {
      id: 'n4',
      type: 'coupon',
      title: 'Coupon Expiring Soon',
      titleId: 'Kupon Segera Kadaluarsa',
      message: 'Your WELCOME10 coupon expires tomorrow. Use it now!',
      messageId: 'Kupon WELCOME10 Anda kadaluarsa besok. Gunakan sekarang!',
      link: '/account/coupons',
      isRead: true,
      createdAt: now - (1 * day),
    },
    {
      id: 'n5',
      type: 'points',
      title: 'Points Earned!',
      titleId: 'Poin Diperoleh!',
      message: 'You earned 150 points from your recent purchase.',
      messageId: 'Anda mendapat 150 poin dari pembelian terakhir.',
      link: '/account/points',
      isRead: true,
      createdAt: now - (2 * day),
    },
    {
      id: 'n6',
      type: 'check_in',
      title: 'Daily Check-in Reminder',
      titleId: 'Pengingat Check-in Harian',
      message: "Don't forget to check in today and maintain your streak!",
      messageId: 'Jangan lupa check-in hari ini untuk menjaga streak Anda!',
      link: '/account/check-in',
      isRead: true,
      createdAt: now - (3 * day),
    },
    {
      id: 'n7',
      type: 'restock',
      title: 'Back in Stock!',
      titleId: 'Stok Tersedia Kembali!',
      message: 'High Waist Wide Leg Jeans (M, Blue) is back in stock!',
      messageId: 'High Waist Wide Leg Jeans (M, Biru) tersedia kembali!',
      link: '/products/high-waist-wide-leg-jeans',
      isRead: true,
      createdAt: now - (4 * day),
    },
  ]
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: generateMockNotifications(),
      isOpen: false,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `n-${Date.now()}`,
          isRead: false,
          createdAt: Date.now(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }))
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      clearAll: () => {
        set({ notifications: [] })
      },

      togglePanel: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      openPanel: () => {
        set({ isOpen: true })
      },

      closePanel: () => {
        set({ isOpen: false })
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type)
      },
    }),
    {
      name: 'alyanoor-notifications',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)

// Helper to get notification icon based on type
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'order': return '📦'
    case 'promo': return '🎉'
    case 'price_drop': return '💰'
    case 'flash_sale': return '⚡'
    case 'coupon': return '🎟️'
    case 'check_in': return '✅'
    case 'points': return '🎁'
    case 'restock': return '🔔'
    case 'system': return '⚙️'
    default: return '📢'
  }
}

// Helper to format notification time
export function formatNotificationTime(timestamp: number, language: 'en' | 'id' = 'en'): string {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return language === 'id' ? 'Baru saja' : 'Just now'
  }
  if (minutes < 60) {
    return language === 'id' ? `${minutes} menit lalu` : `${minutes}m ago`
  }
  if (hours < 24) {
    return language === 'id' ? `${hours} jam lalu` : `${hours}h ago`
  }
  if (days < 7) {
    return language === 'id' ? `${days} hari lalu` : `${days}d ago`
  }

  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}
