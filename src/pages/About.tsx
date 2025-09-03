import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We understand that healthcare decisions affect entire families. Every interaction is guided by empathy and care."
    },
    {
      icon: Shield,
      title: "Trust",
      description: "We maintain the highest standards of privacy, security, and professional integrity in all our services."
    },
    {
      icon: Users,
      title: "Expertise",
      description: "Our team combines healthcare knowledge, insurance expertise, and global compliance understanding."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We're committed to delivering exceptional results and exceeding expectations for every client."
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
              About NextCare Global Services
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We bridge the gap between healthcare needs and global accessibility, 
              providing expert guidance for individuals and families seeking quality 
              care across borders.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                To simplify access to healthcare and insurance for underserved communities 
                and international clients through expert consulting and compassionate service. 
                We believe that quality healthcare should be accessible to everyone, 
                regardless of geographic or economic barriers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our experienced team works tirelessly to connect individuals with the 
                healthcare solutions they need, providing guidance through complex 
                international systems and ensuring compliance with all regulatory requirements.
              </p>
            </div>
            <div className="bg-accent p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                A world where healthcare is borderless, accessible, and secure.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a future where individuals and families can access 
                quality healthcare anywhere in the world with confidence, supported 
                by transparent processes, secure documentation, and expert guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide every decision we make and every service we provide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center shadow-card hover:shadow-hero transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                NextCare Global Services was founded with a simple yet powerful vision: 
                to make quality healthcare accessible to everyone, everywhere. Our founders 
                recognized that navigating international healthcare systems, insurance 
                policies, and compliance requirements could be overwhelming for individuals 
                and families in need.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What started as a mission to help underserved communities access basic 
                healthcare has evolved into a comprehensive service platform that assists 
                clients with everything from emergency medical travel to long-term 
                insurance planning. We've helped hundreds of families navigate complex 
                healthcare systems across multiple continents.
              </p>
              <p className="text-lg leading-relaxed">
                Today, NextCare Global Services continues to expand its reach and refine 
                its services, always maintaining our core commitment to compassionate, 
                expert guidance. Every client's success story reinforces our belief that 
                healthcare truly can be borderless when supported by the right expertise 
                and dedication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience the NextCare Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let us help you navigate your healthcare journey with confidence and expertise
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;