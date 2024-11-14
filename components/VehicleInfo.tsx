"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleData } from "@/lib/types"
import { FileText, Calendar, Car, Gauge, Award, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { da } from "date-fns/locale"

interface VehicleInfoProps {
  data: VehicleData
}

export function VehicleInfo({ data }: VehicleInfoProps) {
  if (!data) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Ikke tilgængelig"
    return format(new Date(dateString), "d. MMMM yyyy", { locale: da })
  }

  const formatNumber = (number: number | null) => {
    if (number === null || number === undefined) return "Ikke tilgængelig"
    return number.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Overview */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Køretøjsoplysninger</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mærke og model</p>
              <p className="font-medium">{data.brand_and_model || "Ikke tilgængelig"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Variant</p>
              <p className="font-medium">{data.variant || "Ikke tilgængelig"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Registreringsnummer</p>
              <p className="font-medium">{data.registration || "Ikke tilgængelig"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Første registrering</p>
              <p className="font-medium">{formatDate(data.first_registration_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Brændstof</p>
              <p className="font-medium">{data.fuel_type || "Ikke tilgængelig"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{data.kind || "Ikke tilgængelig"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Årgang</p>
              <p className="font-medium">{data.model_year || "Ikke tilgængelig"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Status */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Synsstatus</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Seneste syn</p>
              <p className="font-medium">{formatDate(data.last_inspection_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Resultat</p>
              <p className="font-medium">{data.last_inspection_result || "Ikke tilgængelig"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Næste syn</p>
              <p className="font-medium">{formatDate(data.next_inspection_date_estimate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection History */}
      {data.inspections && data.inspections.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Synshistorik</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.inspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{formatDate(inspection.date)}</p>
                    <p className="text-sm text-gray-500">
                      Kilometerstand: {formatNumber(inspection.mileage)} km
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inspection.result === "Godkendt"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {inspection.result}
                    </span>
                    {inspection.pdf && (
                      <a
                        href={inspection.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <FileText className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Kilometerstand</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Aktuel kilometerstand</p>
                <p className="text-2xl font-bold">
                  {formatNumber(data.mileage)} km
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Årligt gennemsnit</p>
                <p className="text-lg font-medium">
                  {formatNumber(data.mileage_annual_average)} km/år
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.extra_equipment && (
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Udstyr</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {data.extra_equipment.split(", ").map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}