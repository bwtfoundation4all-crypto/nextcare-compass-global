import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe, 
  Shield, 
  Heart, 
  FileText, 
  Users, 
  CreditCard, 
  MapPin,
  Languages
} from "lucide-react";
import servicesImage from "@/assets/services-overview.jpg";

const Services = () => {
  const services = [
    {
      title: "Healthcare Access Consulting",
      description: "Expert guidance for accessing quality healthcare across borders",
      icon: Heart,
      features: [
        "Hospital and clinic referrals worldwide",
        "Medical travel coordination",
        "Visa support for medical treatment",
        "Health documentation services"
      ]
    },
    {
      title: "Insurance Navigation",
      description: "Comprehensive support for international health insurance",
      icon: Shield,
      features: [
        "International insurance plan selection",
        "Claims support and documentation",
        "Emergency coverage advisory",
        "Policy comparison and optimization"
      ]
    },
    {
      title: "Financial Assistance",
      description: "Support for managing healthcare costs and finding aid",
      icon: CreditCard,
      features: [
        "Medical bill relief guidance",
        "Payment planning assistance",
        "Nonprofit organization coordination",
        "Sponsorship and donor matching"
      ]
    },
    {
      title: "Compliance & Identity Services",
      description: "Secure documentation and legal compliance support",
      icon: FileText,
      features: [
        "Legal identity verification",
        "Secure document management",
        "Multilingual form support",
        "Privacy and compliance assurance"
      ]
    }
  ];

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

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-hero transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
              <Button size="lg" className="bg-hero-gradient hover:opacity-90">
                Book Free Consultation
              </Button>
              <Button size="lg" variant="outline">
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