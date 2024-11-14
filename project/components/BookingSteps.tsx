"use client"

import { StepIndicator } from "./StepIndicator"

interface StepProps {
  currentStep: number
  steps: Array<{
    num: number
    text: string
    icon: any
  }>
}

export function BookingSteps({ currentStep, steps }: StepProps) {
  return (
    <div className="hidden md:flex justify-between items-center max-w-4xl mx-auto px-4">
      {steps.map((step) => (
        <StepIndicator 
          key={step.num}
          step={step}
          isActive={currentStep === step.num}
        />
      ))}
    </div>
  )
}
