"use client"

import { VehicleData } from "@/lib/types"
import { format } from "date-fns"
import { da } from "date-fns/locale"

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
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">Køretøjsoplysninger</h3>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-gray-500">Mærke og model</p>
          <p className="font-medium">{data.brand_and_model || "Ikke tilgængelig"}</p>
        </div>
        <div>
          <p className="text-gray-500">Variant</p>
          <p className="font-medium">{data.variant || "Ikke tilgængelig"}</p>
        </div>
        <div>
          <p className="text-gray-500">Første registrering</p>
          <p className="font-medium">{formatDate(data.first_registration_date)}</p>
        </div>
        <div>
          <p className="text-gray-500">Brændstof</p>
          <p className="font-medium">{data.fuel_type || "Ikke tilgængelig"}</p>
        </div>
        <div>
          <p className="text-gray-500">Kilometerstand</p>
          <p className="font-medium">{formatNumber(data.mileage)} km</p>
        </div>
        <div>
          <p className="text-gray-500">Årligt gennemsnit</p>
          <p className="font-medium">{formatNumber(data.mileage_annual_average)} km/år</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Synsstatus</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-500">Seneste syn</p>
            <p className="font-medium">{formatDate(data.last_inspection_date)}</p>
          </div>
          <div>
            <p className="text-gray-500">Resultat</p>
            <p className="font-medium">{data.last_inspection_result || "Ikke tilgængelig"}</p>
          </div>
          <div>
            <p className="text-gray-500">Næste syn</p>
            <p className="font-medium">{formatDate(data.next_inspection_date_estimate)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}