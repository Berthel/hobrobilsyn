"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleData } from "@/lib/types";
import { FileText, Calendar, Car, Gauge, Award, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";

interface VehicleInfoProps {
  data: VehicleData;
}

export function VehicleInfo({ data }: VehicleInfoProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d. MMMM yyyy", { locale: da });
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Overview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#4361EE]" />
            <CardTitle>Køretøjsoplysninger</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mærke og model</p>
              <p className="font-medium">{data.brand_and_model}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Variant</p>
              <p className="font-medium">{data.variant}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Registreringsnummer</p>
              <p className="font-medium">{data.registration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Første registrering</p>
              <p className="font-medium">{formatDate(data.first_registration_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Brændstof</p>
              <p className="font-medium">{data.fuel_type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{data.kind}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Status */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#4361EE]" />
            <CardTitle>Synsstatus</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Seneste syn</p>
              <p className="font-medium">{formatDate(data.last_inspection_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Resultat</p>
              <p className="font-medium">{data.last_inspection_result}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Næste syn</p>
              <p className="font-medium">{formatDate(data.next_inspection_date_estimate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection History */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4361EE]" />
            <CardTitle>Synshistorik</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.inspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="space-y-1">
                  <p className="font-medium">{formatDate(inspection.date)}</p>
                  <p className="text-sm text-gray-500">
                    Kilometerstand: {inspection.mileage.toLocaleString()} km
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
                  <a
                    href={inspection.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FileText className="w-5 h-5 text-gray-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#4361EE]" />
              <CardTitle>Kilometerstand</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Aktuel kilometerstand</p>
                <p className="text-2xl font-bold">
                  {data.mileage.toLocaleString()} km
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Årligt gennemsnit</p>
                <p className="text-lg font-medium">
                  {data.mileage_annual_average.toLocaleString()} km/år
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#4361EE]" />
              <CardTitle>Udstyr</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.extra_equipment.split(", ").map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4361EE]" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}