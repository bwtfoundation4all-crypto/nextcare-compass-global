import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressiveFormProps {
  steps: {
    title: string;
    description?: string;
    content: React.ReactNode;
  }[];
  onComplete: () => void;
  isLoading?: boolean;
  className?: string;
}

export const ProgressiveForm = ({ 
  steps, 
  onComplete, 
  isLoading = false,
  className = "" 
}: ProgressiveFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {steps[currentStep].title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          {steps[currentStep].description && (
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="animate-fade-in">
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center bg-hero-gradient hover:opacity-90"
            >
              {currentStep === steps.length - 1 ? (
                isLoading ? "Processing..." : "Complete"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};