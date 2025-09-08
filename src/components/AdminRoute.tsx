import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin portal. This area is restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};