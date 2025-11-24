import React from "react"
import { Check } from "lucide-react"

export const Stepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div
            className="flex flex-col items-center cursor-pointer flex-shrink-0"
            onClick={() => onStepClick && onStepClick(idx)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                idx < currentStep
                  ? "bg-green-500 text-white"
                  : idx === currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {idx < currentStep ? <Check size={20} /> : idx + 1}
            </div>
            <p className="text-xs font-medium text-gray-600 mt-1 text-center whitespace-nowrap">{step}</p>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-shrink-0 h-1 w-8 md:w-12 mx-1 md:mx-2 transition ${idx < currentStep ? "bg-green-500" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
