interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`text-sm font-medium ${currentStep >= index + 1 ? "text-[#f1eece]" : "text-[#f1eece]/40"}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="w-full bg-[rgba(30,30,35,0.5)] rounded-full h-2.5">
        <div
          className="bg-[#f1eece] h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

