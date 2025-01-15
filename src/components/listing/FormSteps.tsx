import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BasicInfoStep } from "./BasicInfoStep";
import { PropertyDetailsStep } from "./PropertyDetailsStep";
import { AdditionalDetailsStep } from "./AdditionalDetailsStep";
import { StepIndicator } from "./StepIndicator";

interface FormStepsProps {
  step: number;
  formData: any;
  isLoading: boolean;
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setStep: (step: number) => void;
}

export const FormSteps = ({
  step,
  formData,
  isLoading,
  handleInputChange,
  handleImageUpload,
  handleSubmit,
  setStep,
}: FormStepsProps) => {
  return (
    <div>
      <StepIndicator currentStep={step} totalSteps={3} />

      <div className="bg-white rounded-lg shadow-sm border p-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {step === 1 && (
            <>
              <BasicInfoStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />
              <Button 
                className="w-full mt-6"
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.listingType || !formData.propertyType}
              >
                Next Step
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <PropertyDetailsStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />
              <div className="flex justify-between gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Previous</Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!formData.location}
                >
                  Next Step
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <AdditionalDetailsStep 
                formData={formData} 
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
              />
              <div className="flex justify-between gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Previous</Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Listing"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};