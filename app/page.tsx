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

export default function BookingSystem() {
  const [regNumber, setRegNumber] = useState("")
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const steps = [
    { num: 1, text: "Registreringsnummer", icon: Car },
    { num: 2, text: "Vælg kategori", icon: Settings },
    { num: 3, text: "Vælg dato", icon: Calendar },
    { num: 4, text: "Vælg tid", icon: Clock },
    { num: 5, text: "Bekræft", icon: CheckCircle },
  ]

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

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2E4374]">
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
            <Button className="bg-[#4361EE] hover:bg-[#3451DE]">Log ind</Button>
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
                      ? "bg-[#4361EE] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-600 font-medium">{step.text}</span>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Indtast registreringsnummer
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="AB 12 345"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                    className="uppercase bg-white"
                  />
                  <Button 
                    onClick={fetchVehicleData}
                    disabled={loading}
                    className="bg-[#4361EE] hover:bg-[#3451DE] min-w-[100px]"
                  >
                    {loading ? "Søger..." : "Næste"}
                  </Button>
                </div>
              </div>

              {/* Vehicle Details */}
              {vehicleData && (
                <div className="pt-4 border-t">
                  <VehicleDetails data={vehicleData} />
                </div>
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
                <Button className="w-full bg-[#4CAF50] hover:bg-[#43A047]">
                  Book næste ledige tid
                </Button>
              </CardContent>
            </Card>

            {/* Prices */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Priser</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "Periodesyn", price: "499" },
                  { name: "Omsyn", price: "250" },
                  { name: "Toldsyn", price: "1299" },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{item.price} kr</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Panel */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <CardTitle>Administrator Panel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Dagens Bookinger", value: "12", bg: "bg-[#EEF2FF]", text: "text-[#4361EE]" },
                { title: "Ledige Tider", value: "8", bg: "bg-[#ECFDF5]", text: "text-[#4CAF50]" },
                { title: "Forhandlere", value: "5", bg: "bg-[#FFF7ED]", text: "text-[#F97316]" },
                { title: "Medarbejdere", value: "2", bg: "bg-[#FAF5FF]", text: "text-[#9333EA]" },
              ].map((stat) => (
                <Card key={stat.title} className={`border-0 ${stat.bg}`}>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {stat.title}
                    </div>
                    <div className={`text-3xl font-bold ${stat.text}`}>
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}