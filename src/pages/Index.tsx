
import { useState } from "react";
import { ReservationFormProvider } from "@/contexts/ReservationFormContext";
import { ReservationDetailsStep } from "@/components/reservation/ReservationDetailsStep";
import { LocationStep } from "@/components/reservation/LocationStep";
import { AdditionalNeedsStep } from "@/components/reservation/AdditionalNeedsStep";
import { TypeSelectionStep } from "@/components/reservation/TypeSelectionStep";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useReservationForm } from "@/contexts/ReservationFormContext";

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

  // Watch for type changes and advance to next step
  React.useEffect(() => {
    if (formData.type && currentStep === 0) {
      handleNext();
    }
  }, [formData.type]);

  const handleNext = () => {
    if (currentStep < getVisibleSteps().length - 1) {
      // If current step is 1 and it's a vehicle reservation, skip to step 3
      if (currentStep === 1 && formData.type === "Vehicle Reservation") {
        setCurrentStep(3);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // If we're on step 3 and it's a vehicle reservation, go back to step 1
      if (currentStep === 3 && formData.type === "Vehicle Reservation") {
        setCurrentStep(1);
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Success!",
      description: "Your reservation has been submitted.",
    });
  };

  const getVisibleSteps = () => {
    if (formData.type === "Vehicle Reservation") {
      return steps.filter(step => step !== "Location");
    }
    return steps;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TypeSelectionStep />;
      case 1:
        return <ReservationDetailsStep />;
      case 2:
        return formData.type === "Vehicle Reservation" ? null : <LocationStep />;
      case 3:
        return <AdditionalNeedsStep />;
      default:
        return (
          <div className="text-center text-muted-foreground">
            Step {currentStep + 1} content coming in the next iteration
          </div>
        );
    }
  };

  const visibleSteps = getVisibleSteps();
  const progressPercentage = (currentStep / (visibleSteps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#f3f3f3] font-figtree">
      <div className="flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-primary-dark">New Reservation</h1>
            <p className="text-muted-foreground">
              Complete the form below to submit your reservation request
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto mb-8">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {visibleSteps[currentStep]}
            </p>
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
              {currentStep === visibleSteps.length - 1 ? (
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
