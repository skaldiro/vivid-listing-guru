import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface AdditionalDetailsStepProps {
  formData: {
    standoutFeatures: string;
    additionalDetails: string;
    generationInstructions: string;
    images: File[];
  };
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdditionalDetailsStep = ({ 
  formData, 
  handleInputChange, 
  handleImageUpload 
}: AdditionalDetailsStepProps) => {
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
    </div>
  );
};