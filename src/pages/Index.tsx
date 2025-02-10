
import React, { useState } from "react";
import { ReservationFormProvider } from "@/contexts/ReservationFormContext";
import { ReservationDetailsStep } from "@/components/reservation/ReservationDetailsStep";
import { LocationStep } from "@/components/reservation/LocationStep";
import { AdditionalNeedsStep } from "@/components/reservation/AdditionalNeedsStep";
import { TypeSelectionStep } from "@/components/reservation/TypeSelectionStep";
import { ReservationSummaryStep } from "@/components/reservation/ReservationSummaryStep";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { CheckCircle2 } from "lucide-react";

const steps = [
  "Type",
  "Reservation Details",
  "Location",
  "Additional Needs",
  "Summary",
];

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { formData } = useReservationForm();

  React.useEffect(() => {
    if (formData.type && currentStep === 0) {
      handleNext();
    }
  }, [formData.type]);

  const getVisibleSteps = () => {
    if (formData.type === "Vehicle Reservation") {
      return steps.filter(step => step !== "Location");
    }
    return steps;
  };

  const handleNext = () => {
    const visibleSteps = getVisibleSteps();
    if (currentStep < visibleSteps.length - 1) {
      const nextStep = visibleSteps[visibleSteps.indexOf(steps[currentStep]) + 1];
      const nextStepIndex = steps.indexOf(nextStep);
      setCurrentStep(nextStepIndex);
    }
  };

  const handleBack = () => {
    const visibleSteps = getVisibleSteps();
    if (currentStep > 0) {
      const currentVisibleStep = steps[currentStep];
      const currentVisibleIndex = visibleSteps.indexOf(currentVisibleStep);
      if (currentVisibleIndex > 0) {
        const previousStep = visibleSteps[currentVisibleIndex - 1];
        const previousStepIndex = steps.indexOf(previousStep);
        setCurrentStep(previousStepIndex);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Success!",
      description: "Your reservation has been submitted.",
    });
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case "Type":
        return <TypeSelectionStep />;
      case "Reservation Details":
        return <ReservationDetailsStep />;
      case "Location":
        return formData.type === "Vehicle Reservation" ? null : <LocationStep />;
      case "Additional Needs":
        return <AdditionalNeedsStep />;
      case "Summary":
        return <ReservationSummaryStep />;
      default:
        return null;
    }
  };

  const visibleSteps = getVisibleSteps();
  const progressPercentage = ((visibleSteps.indexOf(steps[currentStep]) + 1) / visibleSteps.length) * 100;

  const handleStepClick = (index: number) => {
    const stepName = steps[index];
    const visibleStepIndex = visibleSteps.indexOf(stepName);
    if (visibleStepIndex <= visibleSteps.indexOf(steps[currentStep])) {
      setCurrentStep(index);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] font-figtree">
      <div className="flex">
        <div className="w-64 min-h-screen bg-sidebar-background text-sidebar-foreground p-6">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/4a7db52c-f46c-4061-9c89-deeb179b255f.png" 
              alt="FMX Logo" 
              className="w-32 mx-auto"
            />
          </div>
          <nav className="space-y-2">
            {["1-to-1 Asset Manager", "FMX Maps", "Reservation Finder", "Calendar", "To-Do List", "Work List"].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 rounded hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-primary-dark">New Reservation</h1>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-8">
            <Progress value={progressPercentage} className="h-2 mb-4" />
            <div className="flex justify-between px-2">
              {visibleSteps.map((step, index) => {
                const stepIndex = steps.indexOf(step);
                return (
                  <button
                    key={step}
                    onClick={() => handleStepClick(stepIndex)}
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

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            <div className="min-h-[400px]">{renderStep()}</div>

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 rounded-lg transition-all duration-200 hover:bg-muted"
                >
                  Back
                </button>
              )}
              {currentStep === 0 && <div></div>}
              {currentStep === steps.indexOf(visibleSteps[visibleSteps.length - 1]) ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Submit Reservation
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ReservationFormProvider>
      <ReservationForm />
    </ReservationFormProvider>
  );
};

export default Index;

