import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle 404 errors properly - track in production if needed
    
    // SEO meta tags for 404 page
    document.title = "Page Not Found - NextCare Global";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "The page you're looking for doesn't exist. Return to NextCare Global's homepage for healthcare consulting services.");
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold text-primary mb-2">404</CardTitle>
          <CardTitle className="text-xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground">
            Requested path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full bg-hero-gradient hover:opacity-90">
              <Link to="/" className="flex items-center justify-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Back to Homepage</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/services">Explore Our Services</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
