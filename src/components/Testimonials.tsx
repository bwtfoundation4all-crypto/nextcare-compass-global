import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Rodriguez",
      location: "Spain → USA",
      rating: 5,
      text: "NextCare helped me navigate the complex U.S. healthcare system when I needed urgent treatment. Their team was professional, compassionate, and made everything possible.",
      service: "Healthcare Access Consulting"
    },
    {
      name: "Dr. James Chen", 
      location: "Singapore → Germany",
      rating: 5,
      text: "Excellent support with international insurance claims. The expertise saved me thousands of dollars and countless hours of paperwork.",
      service: "Insurance Navigation"
    },
    {
      name: "Sarah Thompson",
      location: "Canada → Switzerland", 
      rating: 5,
      text: "From visa support to finding the right specialists, NextCare guided my family through every step. Truly exceptional service.",
      service: "Medical Travel Coordination"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-accent/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Trusted by Families Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from people we've helped navigate their healthcare journeys
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="shadow-card hover:shadow-hero transition-all duration-300 bg-background/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <Quote className="h-6 w-6 text-primary/60" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  <p className="text-xs text-primary font-medium mt-1">{testimonial.service}</p>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>500+ Families Helped</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>50+ Countries Served</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>98% Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;