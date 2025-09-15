import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Phone, Mail } from "lucide-react";

const faqData = [
  {
    id: "1",
    question: "What services does NextCare Global Services provide?",
    answer: "We provide comprehensive healthcare consulting services including international health insurance navigation, medical travel coordination, hospital referrals, visa support for medical treatment abroad, and expert guidance on accessing quality healthcare worldwide.",
    category: "services"
  },
  {
    id: "2",
    question: "How much do your consultation services cost?",
    answer: "We offer both free and paid consultation services. Initial consultations are typically free, while specialized services like comprehensive insurance analysis, medical travel planning, and document assistance may have associated fees. Check our Services page for detailed pricing.",
    category: "pricing"
  },
  {
    id: "3",
    question: "Do you help with international health insurance?",
    answer: "Yes! We specialize in international health insurance navigation. Our experts help you understand policy options, compare coverage, assist with claims, and optimize your insurance for international travel or relocation.",
    category: "insurance"
  },
  {
    id: "4",
    question: "Can you help me find healthcare providers in other countries?",
    answer: "Absolutely. We have a global network of healthcare providers and can help you find qualified doctors, hospitals, and medical facilities in over 50 countries. We also assist with appointments, medical record transfers, and language support.",
    category: "healthcare"
  },
  {
    id: "5",
    question: "How do I schedule an appointment?",
    answer: "You can schedule an appointment through our online booking system, by calling us directly, or by filling out our contact form. We offer flexible scheduling including emergency consultations for urgent healthcare needs.",
    category: "appointments"
  },
  {
    id: "6",
    question: "Do you provide support for medical visa applications?",
    answer: "Yes, we provide comprehensive support for medical visa applications including document preparation, liaison with medical facilities, invitation letters, and guidance through the visa application process.",
    category: "visa"
  },
  {
    id: "7",
    question: "What if I need urgent healthcare assistance while traveling?",
    answer: "We offer 24/7 emergency support for urgent healthcare needs. Contact our emergency hotline and we'll connect you with local healthcare providers, assist with insurance claims, and provide real-time guidance.",
    category: "emergency"
  },
  {
    id: "8",
    question: "How do you protect my personal health information?",
    answer: "We maintain strict confidentiality and comply with international privacy standards including HIPAA and GDPR. All personal health information is encrypted and accessed only by authorized personnel on a need-to-know basis.",
    category: "privacy"
  },
  {
    id: "9",
    question: "Can you help with prescription medications while traveling?",
    answer: "Yes, we can assist with prescription medication needs including finding equivalent medications in other countries, connecting with local pharmacies, and ensuring you have proper documentation for travel with medications.",
    category: "medications"
  },
  {
    id: "10",
    question: "What languages do your consultants speak?",
    answer: "Our team speaks multiple languages including English, Spanish, French, German, Mandarin, and Arabic. We also work with professional medical interpreters when needed to ensure clear communication.",
    category: "languages"
  }
];

const categories = [
  { id: "all", label: "All Questions", count: faqData.length },
  { id: "services", label: "Services", count: faqData.filter(q => q.category === "services").length },
  { id: "pricing", label: "Pricing", count: faqData.filter(q => q.category === "pricing").length },
  { id: "insurance", label: "Insurance", count: faqData.filter(q => q.category === "insurance").length },
  { id: "healthcare", label: "Healthcare", count: faqData.filter(q => q.category === "healthcare").length },
  { id: "appointments", label: "Appointments", count: faqData.filter(q => q.category === "appointments").length }
];

interface FAQSectionProps {
  showHeader?: boolean;
  showSearch?: boolean;
  showCategories?: boolean;
  showContactCTA?: boolean;
  className?: string;
}

export const FAQSection = ({
  showHeader = true,
  showSearch = true,
  showCategories = true,
  showContactCTA = true,
  className = ""
}: FAQSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our healthcare consulting services
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          {showSearch && (
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Category Filters */}
          {showCategories && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-sm"
                  >
                    {category.label} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Accordion */}
          <Card className="mb-8">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="px-6">
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any questions matching your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact CTA */}
          {showContactCTA && (
            <Card className="bg-accent">
              <CardHeader>
                <CardTitle className="text-center">Still have questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-6">
                  Can't find the answer you're looking for? Our expert team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-hero-gradient hover:opacity-90" asChild>
                    <Link to="/contact" className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send us a message
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+15551234567" className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Call (555) 123-4567
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/book-appointment" className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Book consultation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};