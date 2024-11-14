"use client"

interface StepIndicatorProps {
  step: {
    num: number
    text: string
    icon: any
  }
  isActive: boolean
}

export function StepIndicator({ step, isActive }: StepIndicatorProps) {
  const Icon = step.icon

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isActive
            ? "bg-[#FFD700] text-[#2E3192]"
            : "bg-[#2E3192] text-white"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-gray-600">{step.text}</span>
    </div>
  )
}
