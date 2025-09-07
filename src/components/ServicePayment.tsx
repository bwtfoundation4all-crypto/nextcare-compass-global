import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CreditCard, Check, Clock, User } from "lucide-react";

interface ServicePaymentProps {
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    features: string[];
  };
  user: any;
}

export const ServicePayment = ({ service, user }: ServicePaymentProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          serviceId: service.id
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "You'll be redirected to Stripe to complete your payment."
      });
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card hover:shadow-hero transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{service.name}</CardTitle>
          <Badge variant="secondary" className="text-lg font-bold">
            ${service.price}
          </Badge>
        </div>
        <CardDescription className="text-base">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Expert Consultant</span>
          </div>
        </div>

        {service.features && service.features.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">What's Included:</h4>
            <ul className="space-y-1">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-hero-gradient hover:opacity-90"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Book & Pay ${service.price}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Stripe. You'll receive a confirmation email after purchase.
        </p>
      </CardContent>
    </Card>
  );
};