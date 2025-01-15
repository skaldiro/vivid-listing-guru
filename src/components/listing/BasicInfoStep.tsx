import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LISTING_TYPES, PROPERTY_TYPES } from "./constants";

interface BasicInfoStepProps {
  formData: {
    title: string;
    listingType: string;
    propertyType: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export const BasicInfoStep = ({ formData, handleInputChange }: BasicInfoStepProps) => {
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
    </div>
  );
};