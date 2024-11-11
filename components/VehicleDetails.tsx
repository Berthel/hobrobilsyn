"use client"

import { VehicleData } from "@/lib/types"
import { format } from "date-fns"
import { da } from "date-fns/locale"
import { FileText, Award } from "lucide-react"

interface VehicleDetailsProps {
  data: VehicleData
}

export function VehicleDetails({ data }: VehicleDetailsProps) {
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
    <div className="space-y-8">
      {/* Main Vehicle Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-600 text-sm">Mærke og model</p>
          <p className="font-semibold">{data.brand_and_model}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Første reg.</p>
          <p className="font-semibold">{formatDate(data.first_registration_date)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Brændstof</p>
          <p className="font-semibold">{data.fuel_type}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Kilometerstand</p>
          <p className="font-semibold">{formatNumber(data.mileage)} km</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Seneste syn</p>
          <p className="font-semibold">{formatDate(data.last_inspection_date)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Næste syn</p>
          <p className="font-semibold">{formatDate(data.next_inspection_date_estimate)}</p>
        </div>
      </div>

      {/* Inspection History */}
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4" />
          Synshistorik
        </h3>
        <div className="space-y-3">
          {data.inspections?.map((inspection) => (
            <div
              key={inspection.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{formatDate(inspection.date)}</p>
                <p className="text-sm text-gray-500">
                  {formatNumber(inspection.mileage)} km
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
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
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment */}
      {data.extra_equipment && (
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" />
            Udstyr
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {data.extra_equipment.split(", ").map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}