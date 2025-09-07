import { toast } from "@/hooks/use-toast";

export const handleApiError = (error: any, context: string = "Operation") => {
  console.error(`${context} error:`, error);
  
  let message = "An unexpected error occurred";
  
  if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error?.error) {
    message = error.error;
  }

  toast({
    title: `${context} Failed`,
    description: message,
    variant: "destructive"
  });
};

export const handleStripeError = (error: any) => {
  console.error("Stripe error:", error);
  
  let message = "Payment processing failed";
  
  if (error?.message?.includes("stripe")) {
    message = "Payment service temporarily unavailable. Please try again.";
  } else if (error?.message?.includes("authentication")) {
    message = "Please log in to continue with payment.";
  }

  toast({
    title: "Payment Error",
    description: message,
    variant: "destructive"
  });
};