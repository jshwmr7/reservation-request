
import React, { useState } from "react";
import { ReservationFormProvider } from "@/contexts/ReservationFormContext";
import { ReservationDetailsStep } from "@/components/reservation/ReservationDetailsStep";
import { LocationStep } from "@/components/reservation/LocationStep";
import { AdditionalNeedsStep } from "@/components/reservation/AdditionalNeedsStep";
import { TypeSelectionStep } from "@/components/reservation/TypeSelectionStep";
import { ModuleSelectionStep } from "@/components/reservation/ModuleSelectionStep";
import { ReservationSummaryStep } from "@/components/reservation/ReservationSummaryStep";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { ProgressIndicator } from "@/components/reservation/ProgressIndicator";

const steps = [
  "Module",
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
    if (formData.module && currentStep === 0) {
      handleNext();
    }
    if (formData.type && currentStep === 1) {
      handleNext();
    }
  }, [formData.module, formData.type]);

  const getVisibleSteps = () => {
    if (formData.module === "Transportation Requests") {
      return steps.filter(step => step !== "Location");
    }
    if (formData.type === "Staff Vehicle" || formData.type === "Field Trip") {
      return steps.filter(step => step !== "Location");
    }
    return steps;
  };

  const handleNext = () => {
    const visibleSteps = getVisibleSteps();
    const currentVisibleIndex = visibleSteps.indexOf(steps[currentStep]);
    if (currentVisibleIndex < visibleSteps.length - 1) {
      const nextStep = visibleSteps[currentVisibleIndex + 1];
      const nextStepIndex = steps.indexOf(nextStep);
      setCurrentStep(nextStepIndex);
    }
  };

  const handleBack = () => {
    const visibleSteps = getVisibleSteps();
    const currentVisibleStep = steps[currentStep];
    const currentVisibleIndex = visibleSteps.indexOf(currentVisibleStep);
    if (currentVisibleIndex > 0) {
      const previousStep = visibleSteps[currentVisibleIndex - 1];
      const previousStepIndex = steps.indexOf(previousStep);
      setCurrentStep(previousStepIndex);
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
      case "Module":
        return <ModuleSelectionStep />;
      case "Type":
        return <TypeSelectionStep />;
      case "Reservation Details":
        return <ReservationDetailsStep />;
      case "Location":
        return <LocationStep />;
      case "Additional Needs":
        return <AdditionalNeedsStep />;
      case "Summary":
        return <ReservationSummaryStep />;
      default:
        return null;
    }
  };

  const visibleSteps = getVisibleSteps();

  const handleStepClick = (index: number) => {
    const stepName = steps[index];
    const visibleStepIndex = visibleSteps.indexOf(stepName);
    if (visibleStepIndex <= visibleSteps.indexOf(steps[currentStep])) {
      setCurrentStep(index);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl">New Request</h1>
        </motion.div>

        <ProgressIndicator 
          steps={steps}
          visibleSteps={visibleSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="border border-gray-200 rounded p-6 mb-6"
        >
          <div className="min-h-[400px]">{renderStep()}</div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded"
              >
                Back
              </button>
            )}
            {currentStep === 0 && <div></div>}
            {currentStep === steps.indexOf(visibleSteps[visibleSteps.length - 1]) ? (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Submit Request
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </motion.div>
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
