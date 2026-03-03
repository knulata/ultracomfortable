'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Flame } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { useCheckInStore } from '@/stores/checkIn'

export function CheckInCalendar() {
  const { language } = useTranslation()
  const { checkInHistory, getCheckInForDate } = useCheckInStore()

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = language === 'id'
    ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = language === 'id'
    ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const isFutureDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today
  }

  // Create calendar grid
  const calendarDays = []

  // Empty cells before first day
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Count check-ins this month
  const monthCheckIns = checkInHistory.filter(c => {
    const date = new Date(c.date)
    return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()
  }).length

  return (
    <div className="bg-background rounded-xl border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h3 className="font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <p className="text-xs text-muted-foreground">
            {monthCheckIns} {language === 'id' ? 'hari check-in' : 'days checked in'}
          </p>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateStr = getDateString(day)
          const checkIn = getCheckInForDate(dateStr)
          const today = isToday(day)
          const future = isFutureDate(day)

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${
                checkIn
                  ? 'bg-green-100 text-green-700'
                  : today
                  ? 'bg-primary/10 text-primary border-2 border-primary'
                  : future
                  ? 'text-muted-foreground/50'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className={`font-medium ${today ? 'text-primary' : ''}`}>{day}</span>

              {checkIn && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}

              {checkIn && checkIn.streakDay === 7 && (
                <Flame className="h-3 w-3 text-orange-500 absolute bottom-0.5" />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 rounded" />
          <span>{language === 'id' ? 'Check-in' : 'Checked in'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary/10 border-2 border-primary rounded" />
          <span>{language === 'id' ? 'Hari ini' : 'Today'}</span>
        </div>
      </div>
    </div>
  )
}
