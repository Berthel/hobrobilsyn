"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/Footer"
import { VehicleData } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { DateTimePicker } from "@/components/DateTimePicker"
import { Settings, Car, Calendar, Clock, CheckCircle } from "lucide-react"

export default function BookingSystem() {
  const [regNumber, setRegNumber] = useState("")
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const { toast } = useToast()

  const getCurrentStep = () => {
    if (!vehicleData) return 1
    if (!selectedCategory) return 2
    if (!selectedDate) return 3
    if (!selectedTime) return 4
    return 5
  }

  const steps = [
    { num: 1, text: "Registreringsnummer", icon: Car },
    { num: 2, text: "Vælg kategori", icon: Settings },
    { num: 3, text: "Vælg dato", icon: Calendar },
    { num: 4, text: "Vælg tid", icon: Clock },
    { num: 5, text: "Bekræft", icon: CheckCircle },
  ]

  const getStepStyle = (stepNum: number) => {
    const currentStep = getCurrentStep()
    if (stepNum < currentStep) return "bg-[#2E3192] text-white" // Completed steps
    if (stepNum === currentStep) return "bg-[#FFD700] text-[#2E3192]" // Current step
    return "bg-gray-200 text-gray-400" // Future steps
  }

  // Rest of the existing functions remain the same...
  const getAvailableCategories = (vehicle: VehicleData) => {
    const categories = []
    
    // Basic categories available for all vehicles
    categories.push({ value: "periodesyn", label: "Periodesyn" })
    categories.push({ value: "omsyn", label: "Omsyn" })
    
    // Special categories based on vehicle type
    if (vehicle.kind === "Personbil") {
      categories.push({ value: "registreringssyn", label: "Registreringssyn" })
      if (vehicle.fuel_type === "El") {
        categories.push({ value: "batteritest", label: "Batteritest elbil" })
      }
    } else if (vehicle.kind === "Motorcykel") {
      categories.push({ value: "motorcykel", label: "Motorcykel" })
    } else if (vehicle.kind === "Påhængsvogn") {
      categories.push({ value: "trailersyn", label: "Trailersyn" })
    }
    
    // Toldsyn available for all except trailers
    if (vehicle.kind !== "Påhængsvogn") {
      categories.push({ value: "toldsyn", label: "Toldsyn" })
    }
    
    return categories
  }

  const fetchVehicleData = async () => {
    if (!regNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Fejl",
        description: "Indtast venligst et registreringsnummer",
      })
      return
    }

    setLoading(true)
    setVehicleData(null)
    setShowBooking(false)
    setSelectedCategory("")
    setSelectedDate(undefined)
    setSelectedTime(undefined)

    try {
      const response = await fetch(
        `https://api.synsbasen.dk/v1/vehicles/registration/${regNumber.replace(/\s+/g, "")}`,
        {
          headers: {
            "Authorization": "Bearer sb_sk_a995d948451c410e11a77326527a4689",
            "Content-Type": "application/json"
          },
        }
      )

      if (!response.ok) {
        throw new Error("Kunne ikke finde køretøjet")
      }

      const result = await response.json()
      if (result.data) {
        setVehicleData(result.data)
        setShowBooking(true)
        toast({
          title: "Success",
          description: "Køretøjsoplysninger hentet",
        })
      } else {
        throw new Error("Ingen data fundet for dette køretøj")
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Fejl",
        description: err instanceof Error ? err.message : "Der opstod en fejl",
      })
      setVehicleData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDateTimeSelect = (date: Date | undefined, time: string | undefined) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2E3192]">
            Hobro Bilsyn
          </h1>
          <div className="flex items-center gap-4">
            <Select defaultValue="da">
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Vælg sprog" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="da">Dansk</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#2E3192] hover:bg-[#1E2162]">Log ind</Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8 flex-1">
        <div className="hidden md:flex justify-between items-center max-w-4xl mx-auto px-4">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200 
                  ${getStepStyle(step.num)}`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600 font-medium">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Book Syn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Registreringsnummer
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="AB 12 345"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                      className="uppercase bg-white w-48"
                    />
                    <Button 
                      onClick={fetchVehicleData}
                      disabled={loading}
                      className="bg-[#2E3192] hover:bg-[#1E2162] h-10 whitespace-nowrap"
                    >
                      {loading ? "Søger..." : "Hent"}
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  {showBooking && vehicleData && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Vælg kategori
                      </label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white w-48">
                          <SelectValue placeholder="Vælg type af syn" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCategories(vehicleData).map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {showBooking && vehicleData && selectedCategory && (
                <DateTimePicker 
                  onSelect={handleDateTimeSelect}
                  inspectionType={selectedCategory}
                />
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Hurtig Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Næste ledige tid: <span className="font-medium">I dag 14:30</span>
                </p>
                <Button className="w-full bg-[#FFD700] hover:bg-[#FFE44D] text-[#2E3192]">
                  Book næste ledige tid
                </Button>
              </CardContent>
            </Card>

            {vehicleData && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Køretøjsoplysninger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mærke og model:</span>
                    <span className="font-medium">{vehicleData.brand_and_model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Årgang:</span>
                    <span className="font-medium">{vehicleData.model_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brændstof:</span>
                    <span className="font-medium">{vehicleData.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seneste syn:</span>
                    <span className="font-medium">{vehicleData.last_inspection_date}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}