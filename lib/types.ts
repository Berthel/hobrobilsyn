export interface VehicleInspection {
  id: number;
  vehicle_id: number;
  registration: string;
  vin: string;
  date: string;
  result: string;
  mileage: number;
  pdf: string;
}

export interface VehicleData {
  id: number;
  registration: string;
  vin: string;
  first_registration_date: string;
  status: string;
  kind: string;
  usage: string;
  model_year: number;
  fuel_type: string;
  mileage: number;
  mileage_annual_average: number;
  brand_and_model: string;
  brand: string;
  model: string;
  variant: string;
  body_type: string;
  last_inspection_date: string;
  last_inspection_result: string;
  next_inspection_date_estimate: string;
  ncap_five: boolean;
  extra_equipment: string;
  inspections: VehicleInspection[];
}