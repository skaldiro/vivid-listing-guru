import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2 } from "lucide-react";

const LISTING_TYPES = [
  "Residential Sale",
  "Auction Sale", 
  "Commercial Sale",
  "Residential Letting",
  "Student Letting",
  "Commercial Lease",
  "Other"
];

const PROPERTY_TYPES = [
  "Detached",
  "Semi-Detached", 
  "Terraced",
  "Flat / Apartment",
  "Bungalow",
  "Maisonette",
  "Townhouse",
  "Land",
  "Park Home",
  "Commercial Building",
  "Other"
];

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
      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to create a listing');
      }

      // First, create the listing
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

      // Then upload images if any
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

      // Generate AI content
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

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter listing title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="listingType">Listing Type</Label>
              <Select 
                value={formData.listingType}
                onValueChange={(value) => handleInputChange("listingType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleInputChange("propertyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!formData.title || !formData.listingType || !formData.propertyType}
            >
              Next Step
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input 
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  placeholder="Number of bedrooms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input 
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  placeholder="Number of bathrooms"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Property location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Property price"
              />
            </div>

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>Previous</Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!formData.location || !formData.price}
              >
                Next Step
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="standoutFeatures">Standout Features</Label>
              <Textarea 
                id="standoutFeatures"
                value={formData.standoutFeatures}
                onChange={(e) => handleInputChange("standoutFeatures", e.target.value)}
                placeholder="Enter the standout features of the property"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea 
                id="additionalDetails"
                value={formData.additionalDetails}
                onChange={(e) => handleInputChange("additionalDetails", e.target.value)}
                placeholder="Enter any additional details"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generationInstructions">Generation Instructions</Label>
              <Textarea 
                id="generationInstructions"
                value={formData.generationInstructions}
                onChange={(e) => handleInputChange("generationInstructions", e.target.value)}
                placeholder="Enter any specific instructions for AI generation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Upload Images</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or WEBP (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {formData.images.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {formData.images.length} image(s) selected
                </p>
              )}
            </div>

            <div className="flex justify-between gap-4">
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Create New Listing</h1>
        <p className="text-gray-600">Fill in the details below to generate your listing</p>
      </div>

      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center ${i !== 3 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i === step
                  ? 'bg-primary text-primary-foreground'
                  : i < step
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i}
            </div>
            {i !== 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  i < step ? 'bg-primary/20' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>
      </div>
    </div>
  );
};

export default ListingForm;