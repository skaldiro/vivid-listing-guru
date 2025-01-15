import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
      const isUnderLimit = file.size <= 1024 * 1024; // 1MB
      return isValid && isUnderLimit;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Please ensure all files are images under 1MB",
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
    toast({
      title: "Generating listing...",
      description: "Please wait while we create your perfect listing"
    });
    // TODO: Implement API call
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="listing-form-step">
            <div className="form-group">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter listing title"
              />
            </div>

            <div className="form-group">
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

            <div className="form-group">
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
          <div className="listing-form-step">
            {/* Step 2 content */}
            <Button onClick={() => setStep(1)}>Previous</Button>
            <Button onClick={() => setStep(3)}>Next</Button>
          </div>
        );

      case 3:
        return (
          <div className="listing-form-step">
            {/* Step 3 content */}
            <Button onClick={() => setStep(2)}>Previous</Button>
            <Button onClick={handleSubmit}>Generate Listing</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="step-indicator">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`step-dot ${
              i === step ? 'active' : i < step ? 'completed' : 'incomplete'
            }`}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {renderStep()}
      </form>
    </div>
  );
};

export default ListingForm;