import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CheckCircle, CreditCard } from "lucide-react";

interface StripeIntegrationProps {
  user: User;
}

export const StripeIntegration = ({ user }: StripeIntegrationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    description: ""
  });

  const initiatePayment = async () => {
    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          serviceId: 'custom-payment',
          amount: Math.round(amount * 100), // Convert to cents
          description: paymentForm.description || 'Custom Payment'
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Payment Initiated",
          description: "Stripe checkout opened in a new tab",
        });
        
        setPaymentForm({ amount: "", description: "" });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Stripe Payment Processing
        </CardTitle>
        <CardDescription>
          Secure credit card and payment processing powered by Stripe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Stripe integration is active and ready for payments</span>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Create Custom Payment</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-amount">Amount (USD)</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="payment-description">Description (Optional)</Label>
              <Input
                id="payment-description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Payment description"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button
            onClick={initiatePayment}
            disabled={isLoading || !paymentForm.amount}
            className="w-full sm:w-auto"
          >
            {isLoading && <LoadingSpinner className="mr-2" />}
            Pay with Stripe
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Stripe Features:</p>
          <ul className="space-y-1">
            <li>• Secure credit card processing</li>
            <li>• Automatic payment confirmations</li>
            <li>• Real-time payment status updates</li>
            <li>• PCI DSS compliant transactions</li>
            <li>• Support for multiple payment methods</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};