"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format, isWeekend, startOfToday, isBefore, isToday } from "date-fns"
import { da } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

interface DateTimePickerProps {
  onSelect: (date: Date | undefined, time: string | undefined) => void
  inspectionType?: string
  onBookingComplete?: () => void
}

export function DateTimePicker({ onSelect, inspectionType, onBookingComplete }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [isBooked, setIsBooked] = useState(false)
  const { toast } = useToast()

  const getAvailableTimes = (date: Date) => {
    const times = []
    const dayOfWeek = date.getDay()
    const interval = inspectionType === 'toldsyn' ? 60 : 30
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const isCurrentDay = isToday(date)
    
    if (dayOfWeek === 5) { // Friday
      const endHour = 14
      for (let hour = 8; hour < endHour; hour++) {
        if (interval === 60) {
          if (hour < endHour - 1) { // Ensure there's a full hour available
            // For current day, only show future times
            if (!isCurrentDay || hour > currentHour || (hour === currentHour && currentMinute < 0)) {
              times.push(`${hour.toString().padStart(2, '0')}:00`)
            }
          }
        } else {
          for (let minute of ['00', '30']) {
            // Skip 13:30 on Friday
            if (!(hour === endHour - 1 && minute === '30')) {
              // For current day, only show future times
              const timeInMinutes = (hour * 60) + parseInt(minute)
              const currentTimeInMinutes = (currentHour * 60) + currentMinute
              
              if (!isCurrentDay || timeInMinutes > currentTimeInMinutes) {
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
            // For current day, only show future times
            if (!isCurrentDay || hour > currentHour || (hour === currentHour && currentMinute < 0)) {
              times.push(`${hour.toString().padStart(2, '0')}:00`)
            }
          }
        } else {
          for (let minute of ['00', '30']) {
            // Skip 15:30
            if (!(hour === endHour - 1 && minute === '30')) {
              // For current day, only show future times
              const timeInMinutes = (hour * 60) + parseInt(minute)
              const currentTimeInMinutes = (currentHour * 60) + currentMinute
              
              if (!isCurrentDay || timeInMinutes > currentTimeInMinutes) {
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
      setIsBooked(true)
      if (onBookingComplete) {
        onBookingComplete()
      }
    }
  }

  const disabledDays = (date: Date) => {
    return isWeekend(date) || isBefore(date, startOfToday())
  }

  if (isBooked && selectedDate && selectedTime) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#2E3192] flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold text-[#2E3192]">Booking bekræftet!</h3>
          <p className="text-gray-600">
            Din tid er booket til {format(selectedDate, 'd. MMMM yyyy', { locale: da })} kl. {selectedTime}
          </p>
          {inspectionType && (
            <p className="text-gray-600">Type: {inspectionType}</p>
          )}
        </div>
        <div className="w-full max-w-sm space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-[#2E3192] mb-2">Husk at medbringe:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Bilens registreringsattest</li>
              <li>• Gyldig legitimation</li>
              {inspectionType === 'toldsyn' && (
                <li>• Relevant tolddokumentation</li>
              )}
            </ul>
          </div>
          <Button 
            variant="outline"
            className="w-full border-[#2E3192] text-[#2E3192] hover:bg-[#2E3192] hover:text-white"
            onClick={() => {
              setIsBooked(false)
              setSelectedDate(undefined)
              setSelectedTime(undefined)
              onSelect(undefined, undefined)
            }}
          >
            Book en ny tid
          </Button>
        </div>
      </div>
    )
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