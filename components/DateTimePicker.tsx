"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format, isWeekend } from "date-fns"
import { da } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  onSelect: (date: Date | undefined, time: string | undefined) => void
}

export function DateTimePicker({ onSelect }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()

  // Generer tilgængelige tider baseret på åbningstider
  const getAvailableTimes = (date: Date) => {
    const times = []
    const dayOfWeek = date.getDay()
    
    // Fredag
    if (dayOfWeek === 5) {
      for (let hour = 8; hour < 14; hour++) {
        for (let minute of ['00', '30']) {
          times.push(`${hour.toString().padStart(2, '0')}:${minute}`)
        }
      }
    }
    // Mandag til torsdag
    else if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      for (let hour = 8; hour < 16; hour++) {
        for (let minute of ['00', '30']) {
          times.push(`${hour.toString().padStart(2, '0')}:${minute}`)
        }
      }
    }
    
    return times
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined)
    onSelect(date, undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      const [hours, minutes] = time.split(':')
      const dateWithTime = new Date(selectedDate)
      dateWithTime.setHours(parseInt(hours), parseInt(minutes))
      onSelect(dateWithTime, time)
    }
  }

  // Funktion til at deaktivere datoer
  const disabledDays = (date: Date) => {
    // Deaktiver weekender
    return isWeekend(date)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Vælg dato for syn</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={da}
          disabled={{ 
            before: new Date(),
            after: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          }}
          modifiers={{
            disabled: [disabledDays]
          }}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Vælg tidspunkt</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {getAvailableTimes(selectedDate).map((time) => (
              <Button
                key={time}
                variant="outline"
                className={cn(
                  "w-full",
                  selectedTime === time && "bg-[#4361EE] text-white hover:bg-[#3451DE]"
                )}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {selectedDate.getDay() === 5 
              ? "Fredag: 08:00 - 14:00"
              : "Mandag - Torsdag: 08:00 - 16:00"}
          </p>
        </div>
      )}
    </div>
  )
}