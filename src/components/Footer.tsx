import { Link } from "react-router-dom";
import { Heart, Shield, Globe, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">NextCare</div>
                <div className="text-sm text-white/80">Global Services</div>
              </div>
            </div>
            <p className="text-white/80 mb-4 leading-relaxed">
              Connecting people to quality healthcare and insurance solutions worldwide. 
              Expert guidance for your health journey with compassion every step of the way.
            </p>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Healthcare Access Consulting
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Insurance Navigation
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Financial Assistance
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Medical Travel Coordination
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Emergency Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/payments" className="hover:text-white transition-colors">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">24/7 Support</div>
                  <div>+1 (555) 123-4567</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Email</div>
                  <div>support@nextcareglobal.com</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Coverage</div>
                  <div>Available Worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/70">
              © {currentYear} NextCare Global Services. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/70">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Secure & Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;