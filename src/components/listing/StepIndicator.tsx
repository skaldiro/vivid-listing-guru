interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          className={`flex items-center ${i !== totalSteps ? 'flex-1' : ''}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i === currentStep
                ? 'bg-primary text-primary-foreground'
                : i < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i}
          </div>
          {i !== totalSteps && (
            <div
              className={`flex-1 h-1 mx-2 ${
                i < currentStep ? 'bg-primary/20' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};