import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Payment Cancelled</h1>
            <p className="text-xl text-muted-foreground">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What happened?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You cancelled the payment process before it was completed. This is completely fine - 
                no payment has been processed and you can try again at any time.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">What would you like to do?</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <ArrowLeft className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Try Payment Again</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Return to our services page and complete your consultation booking.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/services">View Services</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <HelpCircle className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our support team if you encountered any issues during checkout.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/support">Get Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-accent p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Alternative Payment Options</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you're having trouble with online payment, we offer alternative payment methods:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• Phone payment with our billing team</li>
                <li>• Bank transfer (for international clients)</li>
                <li>• Payment plans for larger consultations</li>
              </ul>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact Us for Alternatives</Link>
              </Button>
            </div>

            <div className="pt-4">
              <Button variant="ghost" asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;