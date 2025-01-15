import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useListingForm = (prefillData?: any) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: prefillData?.title || "",
    listingType: prefillData?.listingType || "",
    propertyType: prefillData?.propertyType || "",
    bedrooms: prefillData?.bedrooms || "",
    bathrooms: prefillData?.bathrooms || "",
    location: prefillData?.location || "",
    standoutFeatures: prefillData?.standoutFeatures || [],
    additionalDetails: prefillData?.additionalDetails || "",
    generationInstructions: prefillData?.generationInstructions || "",
    images: [] as File[]
  });

  const handleInputChange = (field: string, value: any) => {
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

      const { error: generateError } = await supabase.functions.invoke('generate-listing', {
        body: {
          listingId: listing.id,
          ...formData
        }
      });

      if (generateError) throw generateError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-listing-email', {
        body: { listingId: listing.id }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
      }

      toast({
        title: "Success!",
        description: "Your listing has been created and is being generated",
      });

      navigate('/listings', { 
        replace: true,
        state: { newListing: true }
      });
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return {
    formData,
    isLoading,
    step,
    setStep,
    handleInputChange,
    handleImageUpload,
    handleSubmit
  };
};