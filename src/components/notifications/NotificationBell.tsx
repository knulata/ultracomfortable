'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Check, X, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import {
  useNotificationsStore,
  getNotificationIcon,
  formatNotificationTime,
} from '@/stores/notifications'

export function NotificationBell() {
  const { language } = useTranslation()
  const {
    notifications,
    isOpen,
    togglePanel,
    closePanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getUnreadCount,
  } = useNotificationsStore()

  const panelRef = useRef<HTMLDivElement>(null)
  const unreadCount = getUnreadCount()

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closePanel()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closePanel])

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={togglePanel}
        className="relative p-2 hover:bg-muted rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] bg-background rounded-xl shadow-lg border overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">
              {language === 'id' ? 'Notifikasi' : 'Notifications'}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  {language === 'id' ? 'Tandai dibaca' : 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[360px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  {language === 'id'
                    ? 'Tidak ada notifikasi'
                    : 'No notifications'}
                </p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`relative group ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      onClick={() => handleNotificationClick(notification.id)}
                      className="flex gap-3 p-4 hover:bg-muted transition-colors"
                    >
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                          {language === 'id' ? notification.titleId : notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {language === 'id' ? notification.messageId : notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatNotificationTime(notification.createdAt, language === 'id' ? 'id' : 'en')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </Link>
                  ) : (
                    <div
                      className="flex gap-3 p-4 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                          {language === 'id' ? notification.titleId : notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {language === 'id' ? notification.messageId : notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatNotificationTime(notification.createdAt, language === 'id' ? 'id' : 'en')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                    className="absolute right-2 top-2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                    aria-label="Remove notification"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <Link
                href="/account/notifications"
                onClick={closePanel}
                className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
              >
                {language === 'id' ? 'Lihat Semua Notifikasi' : 'View All Notifications'}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
