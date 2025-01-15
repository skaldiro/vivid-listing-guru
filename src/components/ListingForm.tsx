import { useLocation } from "react-router-dom";
import { FormSteps } from "./listing/FormSteps";
import { useListingForm } from "./listing/useListingForm";

interface LocationState {
  prefill?: {
    title: string;
    listingType: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    location: string;
    standoutFeatures: string[];
    additionalDetails: string;
    generationInstructions: string;
  };
}

const ListingForm = () => {
  const location = useLocation();
  const prefillData = (location.state as LocationState)?.prefill;
  
  const {
    formData,
    isLoading,
    step,
    setStep,
    handleInputChange,
    handleImageUpload,
    handleSubmit
  } = useListingForm(prefillData);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            {prefillData ? "Regenerate Listing" : "Create New Listing"}
          </h1>
          <p className="text-gray-600">Fill in the details below to generate your listing</p>
        </div>

        <FormSteps
          step={step}
          formData={formData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          setStep={setStep}
        />
      </div>
    </div>
  );
};

export default ListingForm;