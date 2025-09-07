import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import GeneralContactForm from "@/components/GeneralContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Clock, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "info@nextcareglobal.com",
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "+1 (555) 123-4567",
      action: "Chat Now"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "+1 (555) 123-4567",
      action: "Call Now"
    },
    {
      icon: Clock,
      title: "Office Hours",
      description: "Mon-Fri: 8AM-6PM EST",
      action: "View Schedule"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Ready to start your healthcare journey? Our expert team is here to 
              help you navigate every step with confidence and care.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="text-center shadow-card hover:shadow-hero transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      {item.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Can We Help You?</h2>
              <p className="text-xl text-muted-foreground">
                Choose the appropriate form below and we'll get back to you within 24 hours
              </p>
            </div>

            <Tabs defaultValue="consultation" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="consultation" className="text-base">
                  Healthcare Consultation
                </TabsTrigger>
                <TabsTrigger value="general" className="text-base">
                  General Contact
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="consultation">
                <ContactForm title="Request Free Healthcare Consultation" />
              </TabsContent>
              
              <TabsContent value="general">
                <GeneralContactForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-destructive/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Emergency Support</h2>
            <p className="text-lg text-muted-foreground mb-6">
              If you're experiencing a medical emergency or urgent healthcare situation that 
              requires immediate assistance, please contact us directly:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="destructive">
                Emergency Hotline: +1 (555) 911-CARE
              </Button>
              <Button size="lg" variant="outline">
                24/7 WhatsApp Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;