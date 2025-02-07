
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex flex-col items-center relative z-10",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                index <= currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
            <span className="mt-2 text-sm font-medium">{step}</span>
          </div>
        ))}
        <div
          className="absolute top-5 left-0 h-[2px] bg-muted-foreground -z-10"
          style={{ width: "100%" }}
        />
        <div
          className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-500 -z-10"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
