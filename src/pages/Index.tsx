
import { useState } from "react";
import { ReservationFormProvider } from "@/contexts/ReservationFormContext";
import { ProgressSteps } from "@/components/reservation/ProgressSteps";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const steps = [
  "Reservation Details",
  "Location",
  "Additional Needs",
  "Summary",
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Success!",
      description: "Your reservation has been submitted.",
    });
  };

  return (
    <ReservationFormProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Make a Reservation</h1>
            <p className="text-muted-foreground">
              Complete the form below to submit your reservation request
            </p>
          </motion.div>

          <ProgressSteps currentStep={currentStep} steps={steps} />

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg shadow-lg p-8 mb-8"
          >
            <div className="min-h-[400px]">
              {/* Step content will go here */}
              <div className="text-center text-muted-foreground">
                Step {currentStep + 1} content coming in the next iteration
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                  currentStep === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted"
                }`}
              >
                Back
              </button>
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Submit Reservation
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ReservationFormProvider>
  );
};

export default Index;
