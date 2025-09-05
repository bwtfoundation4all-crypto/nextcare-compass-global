import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms of Service - NextCare Global Services";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Terms of Service for NextCare Global Services. Understand the terms and conditions for using our healthcare consulting services.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Terms and conditions for using our services
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              Last updated: January 2024
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📋</span>
                  <span>Acceptance of Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  By accessing and using NextCare Global Services ("NextCare," "we," "us," or "our"), 
                  you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏥</span>
                  <span>Services Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h3>Healthcare Consulting Services</h3>
                <p>NextCare provides:</p>
                <ul>
                  <li>Healthcare access consulting and navigation support</li>
                  <li>Insurance guidance and claims assistance</li>
                  <li>Medical travel coordination</li>
                  <li>Financial assistance program navigation</li>
                  <li>Compliance and documentation support</li>
                </ul>
                
                <h3>Important Disclaimer</h3>
                <p>
                  <strong>NextCare does not provide medical advice, diagnosis, or treatment.</strong> 
                  We are consultants who help you navigate healthcare systems and access appropriate care. 
                  Always consult qualified healthcare professionals for medical decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>👤</span>
                  <span>User Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>By using our services, you agree to:</p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Keep your account information up to date</li>
                  <li>Use services only for lawful purposes</li>
                  <li>Not share your account credentials with others</li>
                  <li>Respect the privacy and rights of others</li>
                  <li>Pay all applicable fees in a timely manner</li>
                  <li>Follow all applicable laws and regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>💳</span>
                  <span>Payment Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h3>Fees and Billing</h3>
                <ul>
                  <li>Initial consultations are provided at no charge</li>
                  <li>Ongoing services are billed according to agreed-upon rates</li>
                  <li>Payments are due within 30 days of invoice date</li>
                  <li>Late payments may incur additional fees</li>
                  <li>All fees are non-refundable unless otherwise specified</li>
                </ul>
                
                <h3>Payment Methods</h3>
                <p>We accept major credit cards, bank transfers, and approved payment plans.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>Emergency Situations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  <strong>NextCare is not an emergency service.</strong> In case of medical emergencies:
                </p>
                <ul>
                  <li>Call your local emergency number (911 in the US)</li>
                  <li>Go to the nearest emergency room</li>
                  <li>Contact emergency medical services</li>
                </ul>
                <p>
                  Our services are designed to help with healthcare navigation and planning, 
                  not emergency medical situations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Limitation of Liability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  NextCare Global Services provides consulting and navigation services only. 
                  We are not liable for:
                </p>
                <ul>
                  <li>Medical outcomes or treatment results</li>
                  <li>Decisions made by healthcare providers</li>
                  <li>Insurance company decisions or policy changes</li>
                  <li>Delays or complications in accessing care</li>
                  <li>Third-party service provider actions</li>
                </ul>
                <p>
                  Our liability is limited to the amount of fees paid for our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔄</span>
                  <span>Termination</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Either party may terminate this agreement:</p>
                <ul>
                  <li>With 30 days written notice for any reason</li>
                  <li>Immediately for material breach of terms</li>
                  <li>Immediately if required by law or regulation</li>
                </ul>
                <p>
                  Upon termination, you remain liable for all outstanding fees, 
                  and we will provide reasonable assistance in transitioning your care.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Questions about these Terms of Service? Contact us:
                </p>
                <ul>
                  <li>Email: legal@nextcareglobal.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Mail: NextCare Global Services, Legal Department</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;