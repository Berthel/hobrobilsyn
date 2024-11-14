"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format, isWeekend } from "date-fns"
import { da } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CalendarCheck } from "lucide-react"

interface DateTimePickerProps {
  onSelect: (date: Date | undefined, time: string | undefined) => void
  inspectionType?: string
}

export function DateTimePicker({ onSelect, inspectionType }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()

  const getAvailableTimes = (date: Date) => {
    const times = []
    const dayOfWeek = date.getDay()
    const interval = inspectionType === 'toldsyn' ? 60 : 30
    
    if (dayOfWeek === 5) { // Friday
      const endHour = 14
      for (let hour = 8; hour < endHour; hour++) {
        if (interval === 60) {
          if (hour < endHour - 1) { // Ensure there's a full hour available
            times.push(`${hour.toString().padStart(2, '0')}:00`)
          }
        } else {
          for (let minute of ['00', '30']) {
            if (!(hour === endHour - 1 && minute === '30')) { // Skip 13:30 on Friday
              times.push(`${hour.toString().padStart(2, '0')}:${minute}`)
            }
          }
        }
      }
    }
    else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday to Thursday
      const endHour = 16
      for (let hour = 8; hour < endHour; hour++) {
        if (interval === 60) {
          if (hour < endHour - 1) { // Ensure there's a full hour available
            times.push(`${hour.toString().padStart(2, '0')}:00`)
          }
        } else {
          for (let minute of ['00', '30']) {
            if (!(hour === endHour - 1 && minute === '30')) { // Skip 15:30
              times.push(`${hour.toString().padStart(2, '0')}:${minute}`)
            }
          }
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

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':')
      const dateWithTime = new Date(selectedDate)
      dateWithTime.setHours(parseInt(hours), parseInt(minutes))
      // Her kan du tilføje logik for at håndtere booking
      console.log('Booking requested for:', dateWithTime)
    }
  }

  const disabledDays = (date: Date) => {
    return isWeekend(date)
  }

  const formatSelectedDateTime = () => {
    if (selectedDate && selectedTime) {
      return format(selectedDate, "d. MMMM yyyy", { locale: da }) + ' kl. ' + selectedTime
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-[#2E3192]">Vælg dato for syn</h3>
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
            className="rounded-md border border-[#E8ECF8] bg-white"
            classNames={{
              head_cell: "text-[#2E3192]",
              cell: "text-[#2E3192]",
              day_selected: "bg-[#FFD700] text-[#2E3192]",
              day_today: "text-[#2E3192] font-bold",
              nav_button_previous: "text-[#2E3192]",
              nav_button_next: "text-[#2E3192]",
              caption: "text-[#2E3192]"
            }}
          />
        </div>

        {selectedDate && (
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-[#2E3192]">
              Vælg tidspunkt
              {inspectionType === 'toldsyn' && (
                <span className="text-sm font-normal ml-2 text-[#6B7280]">(60 min)</span>
              )}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getAvailableTimes(selectedDate).map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={cn(
                    "w-full border-[#E8ECF8] text-[#2E3192] hover:bg-[#F8F9FC]",
                    selectedTime === time && "bg-[#FFD700] hover:bg-[#FFE44D] border-[#FFD700]"
                  )}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            <p className="mt-4 text-sm text-[#6B7280]">
              {selectedDate.getDay() === 5 
                ? "Fredag: 08:00 - 14:00"
                : "Mandag - Torsdag: 08:00 - 16:00"}
            </p>
          </div>
        )}
      </div>

      {selectedDate && selectedTime && (
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[#2E3192]">
              <p className="font-medium">Valgt tid:</p>
              <p className="text-lg font-semibold">{formatSelectedDateTime()}</p>
            </div>
            <Button 
              onClick={handleBooking}
              className="w-full sm:w-auto bg-[#4361EE] hover:bg-[#3451DE] text-white px-8"
            >
              <CalendarCheck className="w-5 h-5 mr-2" />
              Book valgte tid
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}