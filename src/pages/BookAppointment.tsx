import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { CalendarIcon, Clock, Loader2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [date, setDate] = useState<Date>();
  const [paymentMode, setPaymentMode] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('service') || "",
    appointmentType: "",
    time: "",
    consultantName: "",
    notes: "",
    contactEmail: "",
    contactPhone: "",
    preferredLanguage: "english"
  });

  useEffect(() => {
    checkUser();
    fetchServices();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    setFormData(prev => ({ ...prev, contactEmail: user.email || "" }));
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services" as any)
        .select("*")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    const selectedService = services.find(s => s.id === formData.serviceId);
    
    if (selectedService && selectedService.price > 0 && !paymentMode) {
      setPaymentMode(true);
      return;
    }

    setLoading(true);

    try {
      const appointmentDateTime = new Date(date);
      const [hours, minutes] = formData.time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Insert appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          appointment_date: appointmentDateTime.toISOString(),
          appointment_type: formData.appointmentType,
          consultant_name: formData.consultantName || null,
          notes: formData.notes || null,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone || null,
          preferred_language: formData.preferredLanguage,
          status: "scheduled"
        } as any)
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // If paid service, create payment
      if (selectedService && selectedService.price > 0) {
        const { data, error: paymentError } = await supabase.functions.invoke('create-stripe-checkout', {
          body: {
            serviceId: selectedService.id,
            appointmentId: appointment.id
          }
        });

        if (paymentError) throw paymentError;

        // Open Stripe checkout
        window.open(data.url, '_blank');
        
        toast({
          title: "Appointment Created",
          description: "Please complete payment to confirm your appointment."
        });
      } else {
        toast({
          title: "Appointment Booked",
          description: "Your free consultation has been scheduled successfully."
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.serviceId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          serviceId: formData.serviceId
        }
      });

      if (error) throw error;
      window.open(data.url, '_blank');
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Book an Appointment</h1>
            <p className="text-muted-foreground">
              Schedule a consultation with our healthcare experts
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">Service *</Label>
                    <Select value={formData.serviceId} onValueChange={(value) => handleInputChange("serviceId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{service.name}</span>
                              <span className="ml-2 text-muted-foreground">
                                {service.price > 0 ? `$${service.price}` : 'Free'}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">Appointment Type *</Label>
                    <Select value={formData.appointmentType} onValueChange={(value) => handleInputChange("appointmentType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Initial Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up Consultation</SelectItem>
                        <SelectItem value="emergency">Emergency Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange("preferredLanguage", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultantName">Preferred Consultant (Optional)</Label>
                  <Input
                    id="consultantName"
                    placeholder="Enter consultant name if you have a preference"
                    value={formData.consultantName}
                    onChange={(e) => handleInputChange("consultantName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Please describe your healthcare needs, any specific concerns, or questions you'd like to discuss..."
                    className="min-h-[120px]"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                {paymentMode ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-accent rounded-lg">
                      <h3 className="font-semibold mb-2">Payment Required</h3>
                      <p className="text-sm text-muted-foreground">
                        This service requires payment. Please complete the payment to confirm your appointment.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setPaymentMode(false)}
                        className="flex-1"
                      >
                        Back to Edit
                      </Button>
                      <Button 
                        type="button"
                        onClick={handlePayment}
                        className="flex-1 bg-hero-gradient hover:opacity-90"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay & Confirm
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full bg-hero-gradient hover:opacity-90" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking Appointment...
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {services.find(s => s.id === formData.serviceId)?.price > 0 ? 'Review & Pay' : 'Book Free Appointment'}
                      </>
                    )}
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  By booking this appointment, you agree to our{" "}
                  <a href="/privacy" className="text-primary underline">Privacy Policy</a> and{" "}
                  <a href="/terms" className="text-primary underline">Terms of Service</a>.
                  You'll receive a confirmation email with appointment details.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;