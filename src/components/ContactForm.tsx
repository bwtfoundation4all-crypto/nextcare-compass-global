import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const ContactForm = ({ title = "Get Free Consultation" }: { title?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    service: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-consultation', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          service: formData.service,
          message: formData.message
        }
      });

      if (error) throw error;
      
      toast({
        title: "Consultation Request Received",
        description: "Our team will contact you within 24 hours to discuss your healthcare needs."
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        service: "",
        message: ""
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-2xl font-heading text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                aria-describedby="name-error"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                aria-describedby="email-error"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">
                Current Country
              </Label>
              <Input
                id="country"
                type="text"
                placeholder="e.g., United States"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-medium">
              Service Needed
            </Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select the service you need help with" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare-access">Healthcare Access Consulting</SelectItem>
                <SelectItem value="insurance-navigation">Insurance Navigation</SelectItem>
                <SelectItem value="financial-assistance">Financial Assistance</SelectItem>
                <SelectItem value="compliance-identity">Compliance & Identity Services</SelectItem>
                <SelectItem value="medical-travel">Medical Travel Coordination</SelectItem>
                <SelectItem value="emergency-support">Emergency Support</SelectItem>
                <SelectItem value="other">Other / Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Tell Us About Your Situation
            </Label>
            <Textarea
              id="message"
              placeholder="Please describe your healthcare needs, timeline, and any specific concerns..."
              className="min-h-[120px]"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-hero-gradient hover:opacity-90" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Request Free Consultation
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to our{" "}
            <Link to="/privacy" className="text-primary underline">Privacy Policy</Link> and{" "}
            <Link to="/terms" className="text-primary underline">Terms of Service</Link>.
            No obligation - completely free consultation.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;