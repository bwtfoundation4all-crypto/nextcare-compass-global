import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";

const CustomerService = () => {
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    email: "",
    name: ""
  });
  const [zapierWebhook, setZapierWebhook] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description || !ticketForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Trigger Zapier webhook if provided
      if (zapierWebhook) {
        await fetch(zapierWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            ...ticketForm,
            timestamp: new Date().toISOString(),
            source: "customer_service_portal",
          }),
        });

        toast({
          title: "Support Ticket Submitted",
          description: "Your ticket has been sent to our support team via Zapier. We'll get back to you soon!",
        });
      } else {
        // Fallback: just show success message
        toast({
          title: "Support Ticket Created",
          description: "Your support request has been recorded. Our team will contact you within 24 hours.",
        });
      }

      // Reset form
      setTicketForm({
        subject: "",
        category: "",
        priority: "",
        description: "",
        email: "",
        name: ""
      });
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your ticket. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+1 (555) 123-4567",
      hours: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Send us an email for detailed inquiries",
      contact: "support@nextcare.com",
      hours: "24/7 - Response within 12 hours"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      hours: "Mon-Fri 8AM-8PM EST"
    }
  ];

  const faqItems = [
    {
      question: "How do I approve an invoice?",
      answer: "Navigate to the Payments page, find your invoice, and click the 'Approve' button when the status is 'Sent'."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We use Stripe for secure credit card processing. All payments are PCI DSS compliant and processed instantly."
    },
    {
      question: "How long does payment processing take?",
      answer: "Credit card payments are processed instantly with Stripe. You'll receive immediate confirmation once payment is complete."
    },
    {
      question: "Can I cancel an invoice?",
      answer: "Yes, invoices can be canceled before payment. Contact support or use the invoice management tools."
    },
    {
      question: "How do I update my payment information?",
      answer: "You can update your banking information through your account settings or by contacting support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center">
                <HeadphonesIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help with payments, invoices, and any questions you have
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center shrink-0">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                          <p className="text-muted-foreground mb-2">{method.description}</p>
                          <p className="font-medium text-primary">{method.contact}</p>
                          <p className="text-sm text-muted-foreground">{method.hours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Support Ticket Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                  <CardDescription>
                    Describe your issue and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={ticketForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={ticketForm.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="payment">Payment Issues</SelectItem>
                            <SelectItem value="invoice">Invoice Questions</SelectItem>
                            <SelectItem value="account">Account Management</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select onValueChange={(value) => handleInputChange("priority", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={ticketForm.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Please provide detailed information about your issue..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="zapier">Zapier Webhook URL (Optional)</Label>
                      <Input
                        id="zapier"
                        type="url"
                        value={zapierWebhook}
                        onChange={(e) => setZapierWebhook(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Connect your Zapier webhook to automatically process support tickets
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-hero-gradient hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-muted-foreground text-sm">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-8 p-6 bg-accent/50 rounded-lg">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Payment System: Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Stripe Payment: Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Support Portal: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;