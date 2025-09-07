import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Calendar, FileText } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Here you could verify the payment with your backend
    // For now, we'll just show a success message
    if (sessionId) {
      setPaymentDetails({
        sessionId,
        amount: "$99.00",
        service: "Healthcare Consultation",
        status: "paid"
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your payment. Your consultation has been confirmed.
            </p>
          </div>

          {paymentDetails && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Service:</span>
                    <p className="text-muted-foreground">{paymentDetails.service}</p>
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span>
                    <p className="text-muted-foreground">{paymentDetails.amount}</p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className="text-green-600 font-medium">Paid</p>
                  </div>
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <p className="text-muted-foreground text-xs">{paymentDetails.sessionId?.slice(-12)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Schedule Your Consultation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book a convenient time slot for your consultation with our experts.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/book-appointment">
                      Schedule Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">View Your Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access your consultation history, appointments, and documents.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-accent p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is available 24/7 to assist you with any questions about your consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/support">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:+1-555-123-4567">Call: (555) 123-4567</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;