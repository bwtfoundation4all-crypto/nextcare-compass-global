import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - NextCare Global Services";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Privacy Policy for NextCare Global Services. Learn how we protect your personal health information and ensure HIPAA compliance.'
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How we protect and handle your personal information
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              Last updated: January 2024
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h3>Personal Information</h3>
                <p>We collect information you provide directly to us, including:</p>
                <ul>
                  <li>Name, email address, phone number, and contact information</li>
                  <li>Health information necessary to provide consulting services</li>
                  <li>Insurance information and coverage details</li>
                  <li>Payment and billing information</li>
                  <li>Communication preferences and consultation history</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <p>When you use our services, we automatically collect:</p>
                <ul>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏥</span>
                  <span>HIPAA Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  NextCare Global Services is committed to protecting your health information 
                  in accordance with the Health Insurance Portability and Accountability Act (HIPAA). 
                  We maintain appropriate safeguards to protect the privacy and security of your 
                  protected health information (PHI).
                </p>
                <h3>Your Rights Under HIPAA</h3>
                <ul>
                  <li>Right to access your health information</li>
                  <li>Right to request amendments to your health records</li>
                  <li>Right to receive an accounting of disclosures</li>
                  <li>Right to request restrictions on use and disclosure</li>
                  <li>Right to file a complaint</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>How We Use Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We use your information to:</p>
                <ul>
                  <li>Provide healthcare consulting and insurance navigation services</li>
                  <li>Communicate with you about your consultations and services</li>
                  <li>Process payments and manage your account</li>
                  <li>Improve our services and develop new offerings</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Protect against fraud and unauthorized access</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🤝</span>
                  <span>Information Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We may share your information with:</p>
                <ul>
                  <li><strong>Healthcare Providers:</strong> When facilitating your care with your consent</li>
                  <li><strong>Insurance Companies:</strong> To help process claims or verify coverage</li>
                  <li><strong>Service Providers:</strong> Third parties who assist in providing our services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                </ul>
                <p>
                  <strong>We never sell your personal information.</strong> All sharing is done in accordance 
                  with applicable privacy laws and with appropriate safeguards in place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Security Measures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We implement comprehensive security measures including:</p>
                <ul>
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure data storage with regular security audits</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Regular employee training on privacy and security</li>
                  <li>Incident response procedures for potential breaches</li>
                  <li>Compliance with industry security standards</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚖️</span>
                  <span>Your Rights and Choices</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>You have the right to:</p>
                <ul>
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt-out of certain communications</li>
                  <li>Request data portability</li>
                  <li>File a complaint with regulatory authorities</li>
                </ul>
                
                <h3>Contact Us</h3>
                <p>
                  To exercise your rights or ask questions about this privacy policy, contact our 
                  Privacy Officer at:
                </p>
                <ul>
                  <li>Email: privacy@nextcareglobal.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Mail: NextCare Global Services, Privacy Office</li>
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

export default Privacy;