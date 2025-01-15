import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BasicInfoStep } from "./listing/BasicInfoStep";
import { PropertyDetailsStep } from "./listing/PropertyDetailsStep";
import { AdditionalDetailsStep } from "./listing/AdditionalDetailsStep";
import { StepIndicator } from "./listing/StepIndicator";

const ListingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    listingType: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
    price: "",
    standoutFeatures: "",
    additionalDetails: "",
    generationInstructions: "",
    images: [] as File[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 10 images",
        variant: "destructive"
      });
      return;
    }
    
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isUnderLimit = file.size <= 1024 * 1024 * 2; // 2MB
      return isValid && isUnderLimit;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Please ensure all files are images under 2MB",
        variant: "destructive"
      });
    }

    setFormData(prev => ({
      ...prev,
      images: validFiles
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to create a listing');
      }

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          title: formData.title,
          listing_type: formData.listingType,
          property_type: formData.propertyType,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          location: formData.location,
          price: parseFloat(formData.price),
          standout_features: formData.standoutFeatures,
          additional_details: formData.additionalDetails,
          generation_instructions: formData.generationInstructions,
          user_id: user.id
        })
        .select()
        .single();

      if (listingError) throw listingError;

      if (formData.images.length > 0) {
        for (const file of formData.images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `${listing.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath);

          await supabase
            .from('listing_images')
            .insert({
              listing_id: listing.id,
              image_url: publicUrl
            });
        }
      }

      const response = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          ...formData
        }),
      });

      if (!response.ok) throw new Error('Failed to generate listing content');

      toast({
        title: "Success!",
        description: "Your listing has been created and is being generated",
      });

      navigate('/listings');
    } catch (error: any) {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Create New Listing</h1>
        <p className="text-gray-600">Fill in the details below to generate your listing</p>
      </div>

      <StepIndicator currentStep={step} totalSteps={3} />

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
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
                  disabled={!formData.location || !formData.price}
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

export default ListingForm;