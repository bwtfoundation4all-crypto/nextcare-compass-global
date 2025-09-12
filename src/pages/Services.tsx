import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ServiceCardSkeleton } from "@/components/LoadingSkeleton";
import { 
  Heart, 
  FileText, 
  CreditCard, 
  Loader2,
  Check
} from "lucide-react";
import servicesImage from "@/assets/services-overview.jpg";

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const highlightService = searchParams.get('highlight');

  useEffect(() => {
    checkUser();
    fetchServices();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
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
      toast({
        title: "Error",
        description: "Failed to load services. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (serviceId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setPaymentLoading(serviceId);

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          serviceId: serviceId
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const getServiceIcon = (name: string) => {
    if (name.toLowerCase().includes('healthcare') || name.toLowerCase().includes('medical')) return Heart;
    if (name.toLowerCase().includes('document') || name.toLowerCase().includes('compliance')) return FileText;
    if (name.toLowerCase().includes('financial') || name.toLowerCase().includes('payment')) return CreditCard;
    return Heart;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Comprehensive Healthcare Services
              </h1>
              <p className="text-xl text-white/90 mb-8">
                From healthcare access to insurance navigation, we provide end-to-end 
                support for individuals and families seeking quality care worldwide.
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Started Today
              </Button>
            </div>
            <div className="lg:order-first">
              <img 
                src={servicesImage} 
                alt="Global healthcare services"
                className="rounded-2xl shadow-hero w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer specialized consulting services designed to simplify your healthcare journey
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComponent = getServiceIcon(service.name);
                return (
                  <Card 
                    key={service.id} 
                    className={`shadow-card hover:shadow-hero transition-all duration-300 flex flex-col ${
                      highlightService === service.id ? 'ring-2 ring-primary animate-pulse' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          ${service.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Duration: {service.duration || '60 minutes'}</h4>
                          {service.features && service.features.length > 0 && (
                            <ul className="space-y-2">
                              {service.features.map((feature: string, featureIndex: number) => (
                                <li key={featureIndex} className="flex items-start space-x-2">
                                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <Button 
                          onClick={() => handlePayment(service.id)}
                          disabled={paymentLoading === service.id}
                          className="w-full bg-hero-gradient hover:opacity-90"
                        >
                          {paymentLoading === service.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Book & Pay - ${service.price}</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let our experts help you navigate your healthcare journey with confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-hero-gradient hover:opacity-90"
                onClick={() => navigate("/book-appointment")}
              >
                Book Free Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/about")}
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;