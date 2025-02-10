
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  visibleSteps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export const ProgressIndicator = ({ 
  steps, 
  visibleSteps, 
  currentStep, 
  onStepClick 
}: ProgressIndicatorProps) => {
  const progressPercentage = ((visibleSteps.indexOf(steps[currentStep]) + 1) / visibleSteps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <Progress value={progressPercentage} className="h-2 mb-4" />
      <div className="flex justify-between px-2">
        {visibleSteps.map((step, index) => {
          const stepIndex = steps.indexOf(step);
          return (
            <button
              key={step}
              onClick={() => onStepClick(stepIndex)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                stepIndex <= currentStep 
                  ? 'text-primary cursor-pointer hover:text-primary/80' 
                  : 'text-muted-foreground cursor-not-allowed'
              }`}
              disabled={stepIndex > currentStep}
            >
              {stepIndex < currentStep && (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span className={`${
                stepIndex === currentStep ? 'text-lg font-semibold' : ''
              }`}>
                {step}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
