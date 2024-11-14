"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format, isWeekend, startOfToday, isBefore, setHours, setMinutes } from "date-fns"
import { da } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface DateTimePickerProps {
  onSelect: (date: Date | undefined, time: string | undefined) => void
  inspectionType?: string
}

export function DateTimePicker({ onSelect, inspectionType }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const { toast } = useToast()

  const getAvailableTimes = (date: Date) => {
    const times = []
    const dayOfWeek = date.getDay()
    const interval = inspectionType === 'toldsyn' ? 60 : 30
    const now = new Date()
    const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    if (dayOfWeek === 5) { // Friday
      const endHour = 14
      for (let hour = 8; hour < endHour; hour++) {
        if (interval === 60) {
          if (hour < endHour - 1) { // Ensure there's a full hour available
            // Skip times that have already passed today
            if (!isToday || (hour > currentHour || (hour === currentHour && currentMinute < 0))) {
              times.push(`${hour.toString().padStart(2, '0')}:00`)
            }
          }
        } else {
          for (let minute of ['00', '30']) {
            if (!(hour === endHour - 1 && minute === '30')) { // Skip 13:30 on Friday
              // Skip times that have already passed today
              if (!isToday || 
                  (hour > currentHour || 
                   (hour === currentHour && parseInt(minute) > currentMinute))) {
                times.push(`${hour.toString().padStart(2, '0')}:${minute}`)
              }
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
            // Skip times that have already passed today
            if (!isToday || (hour > currentHour || (hour === currentHour && currentMinute < 0))) {
              times.push(`${hour.toString().padStart(2, '0')}:00`)
            }
          }
        } else {
          for (let minute of ['00', '30']) {
            if (!(hour === endHour - 1 && minute === '30')) { // Skip 15:30
              // Skip times that have already passed today
              if (!isToday || 
                  (hour > currentHour || 
                   (hour === currentHour && parseInt(minute) > currentMinute))) {
                times.push(`${hour.toString().padStart(2, '0')}:${minute}`)
              }
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
      const formattedDate = format(selectedDate, 'd. MMMM yyyy', { locale: da })
      toast({
        title: "Tid booket!",
        description: `Din tid er booket til ${formattedDate} kl. ${selectedTime}`,
      })
    }
  }

  const disabledDays = (date: Date) => {
    return isWeekend(date) || isBefore(date, startOfToday())
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4 text-[#2E3192]">Vælg dato for syn</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={da}
          weekStartsOn={1}
          disabled={{ 
            before: startOfToday(),
            after: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          }}
          modifiers={{
            disabled: [disabledDays]
          }}
          className="rounded-md border border-[#E8ECF8] bg-white"
          classNames={{
            head_cell: "text-[#2E3192] font-medium text-center w-10",
            cell: "text-[#2E3192] w-10",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#F8F9FC]",
              "focus-visible:bg-[#F8F9FC] focus-visible:ring-0 focus-visible:ring-offset-0"
            ),
            day_selected: "bg-[#FFD700] text-[#2E3192] hover:bg-[#FFE44D] hover:text-[#2E3192] focus:bg-[#FFE44D] focus:text-[#2E3192]",
            day_today: "text-[#2E3192] font-bold bg-[#F8F9FC]",
            nav_button_previous: "text-[#2E3192] hover:bg-[#F8F9FC] hover:text-[#2E3192]",
            nav_button_next: "text-[#2E3192] hover:bg-[#F8F9FC] hover:text-[#2E3192]",
            caption: "text-[#2E3192] font-medium"
          }}
        />
      </div>

      <div className="flex-1">
        {selectedDate && (
          <>
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

            {selectedTime && (
              <div className="mt-6">
                <Button 
                  className="w-full bg-[#2E3192] hover:bg-[#1E2162] text-white font-medium py-6"
                  onClick={handleBooking}
                >
                  Book tid {format(selectedDate, 'd. MMMM', { locale: da })} kl. {selectedTime}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}