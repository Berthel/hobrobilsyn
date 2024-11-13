"use client"

import { Settings, Car, Calendar, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/Footer"
import { useState } from "react"
import { VehicleData } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { VehicleDetails } from "@/components/VehicleDetails"
import { DateTimePicker } from "@/components/DateTimePicker"

export default function BookingSystem() {
  const [regNumber, setRegNumber] = useState("")
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedDateTime, setSelectedDateTime] = useState<{ date?: Date; time?: string }>({})
  const { toast } = useToast()

  const steps = [
    { num: 1, text: "Registreringsnummer", icon: Car },
    { num: 2, text: "Vælg kategori", icon: Settings },
    { num: 3, text: "Vælg dato", icon: Calendar },
    { num: 4, text: "Vælg tid", icon: Clock },
    { num: 5, text: "Bekræft", icon: CheckCircle },
  ]

  const getAvailableCategories = (data: VehicleData) => {
    const categories = []
    
    // Base categories available for all vehicles
    categories.push({ value: "periodesyn", label: "Periodesyn" })
    categories.push({ value: "omsyn", label: "Omsyn" })
    
    // Add categories based on vehicle type
    if (data.kind?.toLowerCase().includes("påhængsvogn") || 
        data.kind?.toLowerCase().includes("trailer")) {
      categories.push({ value: "trailersyn", label: "Trailersyn" })
    }
    
    if (data.kind?.toLowerCase().includes("motorcykel")) {
      categories.push({ value: "motorcykel", label: "Motorcykelsyn" })
    }
    
    // Add Toldsyn as it might be needed for any vehicle type
    categories.push({ value: "toldsyn", label: "Toldsyn" })
    
    // Add battery test for electric vehicles
    if (data.fuel_type?.toLowerCase().includes("el")) {
      categories.push({ value: "batteritest", label: "Batteritest elbil" })
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
    setSelectedDateTime({ date, time })
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Header */}
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
        {/* Progress Steps */}
        <div className="flex justify-between items-center max-w-4xl mx-auto px-4">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200 
                  ${
                    step.num === 1
                      ? "bg-[#2E3192] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600 font-medium hidden md:block">{step.text}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form and Vehicle Info */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Book Syn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Indtast registreringsnummer
                  </label>
                  <Input
                    placeholder="AB 12 345"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                    className="uppercase bg-white"
                  />
                </div>
                <Button 
                  onClick={fetchVehicleData}
                  disabled={loading}
                  className="bg-[#2E3192] hover:bg-[#1E2162] self-end"
                >
                  {loading ? "Søger..." : "Hent"}
                </Button>
              </div>

              {showBooking && vehicleData && (
                <>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Vælg kategori
                      </label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white">
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
                  </div>

                  {selectedCategory && (
                    <DateTimePicker 
                      onSelect={handleDateTimeSelect}
                      inspectionType={selectedCategory}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Hurtig Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Næste ledige tid: <span className="font-medium">I dag 14:30</span>
                </p>
                <Button className="w-full bg-[#FFD700] hover:bg-[#FFE44D] text-[#2E3192]">
                  Book næste ledige tid
                </Button>
              </CardContent>
            </Card>

            {/* Vehicle Info Card */}
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
                    <span className="text-gray-600">Reg. nummer:</span>
                    <span className="font-medium">{vehicleData.registration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Første reg.:</span>
                    <span className="font-medium">
                      {new Date(vehicleData.first_registration_date).toLocaleDateString('da-DK')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Næste syn:</span>
                    <span className="font-medium">
                      {new Date(vehicleData.next_inspection_date_estimate).toLocaleDateString('da-DK')}
                    </span>
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