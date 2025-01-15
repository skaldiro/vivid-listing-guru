import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          placeholder="This is just for your records and will not be used in the listing"
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
            <SelectItem value="For Sale">For Sale</SelectItem>
            <SelectItem value="For Rent">For Rent</SelectItem>
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
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Flat">Flat</SelectItem>
            <SelectItem value="Bungalow">Bungalow</SelectItem>
            <SelectItem value="Maisonette">Maisonette</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};