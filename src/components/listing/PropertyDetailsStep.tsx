import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropertyDetailsStepProps {
  formData: {
    bedrooms: string;
    bathrooms: string;
    location: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export const PropertyDetailsStep = ({ formData, handleInputChange }: PropertyDetailsStepProps) => {
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
    </div>
  );
};