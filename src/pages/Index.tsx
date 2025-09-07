import { useEffect } from "react";
import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Heart, Shield, Globe, Users } from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    document.title = "NextCare Global Services - International Healthcare Consulting & Insurance Navigation";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Professional international healthcare consulting, insurance navigation, and medical access support for individuals and families worldwide. Expert guidance for quality care across borders.'
      );
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('name', 'description');
      newMeta.setAttribute('content', 'Professional international healthcare consulting, insurance navigation, and medical access support for individuals and families worldwide. Expert guidance for quality care across borders.');
      document.head.appendChild(newMeta);
    }

    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }
    
    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "HealthcareOrganization", 
      "name": "NextCare Global Services",
      "description": "International healthcare consulting and insurance navigation services",
      "url": window.location.origin,
      "telephone": "+1-555-123-4567",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "medicalSpecialty": ["Healthcare Consulting", "Insurance Navigation", "Medical Travel Coordination"],
      "serviceArea": "Worldwide",
      "potentialAction": {
        "@type": "ScheduleAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/book-appointment`
        }
      }
    };
    
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script') as HTMLScriptElement;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
    
    return () => {
      // Cleanup handled by React
    };
  }, []);

  const features = [
    {
      icon: Heart,
      title: "Healthcare Access",
      description: "Expert guidance for accessing quality healthcare across borders and navigating complex medical systems."
    },
    {
      icon: Shield,
      title: "Insurance Support",
      description: "Comprehensive assistance with international health insurance selection, claims, and coverage optimization."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Worldwide network of healthcare providers and insurance partners to serve you anywhere you are."
    },
    {
      icon: Users,
      title: "Family Care",
      description: "Specialized support for families and individuals seeking healthcare solutions that fit their unique needs."
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
              <h1 className="text-4xl lg:text-6xl font-heading font-bold text-white mb-6">
                Global Care.
                <br />
                <span className="text-white/90">Local Trust.</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                NextCare Global Services connects people to the healthcare and 
                insurance solutions they need—anywhere in the world. Expert guidance 
                for your health journey, with compassion every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                  <Link to="/contact">
                    Get Help Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary" asChild>
                  <Link to="/book-appointment">
                    Free Consultation
                  </Link>
                </Button>
              </div>
              <div className="mt-3">
                <Link to="/auth" className="text-sm text-white/90 underline underline-offset-4 hover:text-white">
                  Already have an account? Log in
                </Link>
              </div>
            </div>
            <div>
              <img 
                src={heroImage} 
                alt="Professional healthcare team providing global medical services"
                className="rounded-2xl shadow-hero w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Why Choose NextCare Global Services?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We simplify complex healthcare systems and provide expert guidance 
              for individuals and families seeking quality care worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center shadow-card hover:shadow-hero transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive healthcare consulting services designed to support your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Healthcare Access Consulting</CardTitle>
                <CardDescription className="text-base">
                  Hospital referrals, medical travel coordination, and visa support for treatment abroad
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Insurance Navigation</CardTitle>
                <CardDescription className="text-base">
                  Expert guidance on international health insurance, claims support, and coverage optimization
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-hero-gradient hover:opacity-90" asChild>
              <Link to="/services">
                Explore All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Start Your Healthcare Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Our expert team is standing by to help you navigate complex healthcare 
              systems and find the solutions you need. Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                <Link to="/book-appointment">
                  Book Free Consultation
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary" asChild>
                <Link to="tel:+15551234567">
                  Call Now: (555) 123-4567
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Contact Form Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
                Start Your Healthcare Journey Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Our expert consultants are ready to help you navigate complex healthcare systems 
                and find the right solutions for your needs. Get personalized guidance with a 
                completely free consultation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">No obligation consultation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">Expert guidance within 24 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-muted-foreground">Personalized healthcare strategy</span>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
