import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardAnalytics } from "@/components/DashboardAnalytics";
import { AppointmentManagement } from "@/components/AppointmentManagement";
import { Calendar, FileText, CreditCard, Clock, CheckCircle, XCircle, Plus, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  service_type: string;
  status: string;
  created_at: string;
  message: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  consultant_name: string;
  notes: string;
}

interface Payment {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  service_type: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchUserData(user);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (user: any) => {
    try {
      // Fetch consultation requests
      const { data: requests } = await supabase
        .from("consultation_requests")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      // Fetch appointments
      const { data: appts } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: false });

      // Fetch payments
      const { data: paymentData } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setConsultationRequests(requests || []);
      setAppointments(appts || []);
      setPayments(paymentData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      contacted: "secondary",
      scheduled: "default",
      completed: "secondary",
      cancelled: "destructive",
      confirmed: "default",
      paid: "secondary",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "scheduled":
      case "confirmed":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </h1>
          <p className="text-muted-foreground">
            Manage your healthcare consultations, appointments, and payments
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Dashboard Analytics */}
            <DashboardAnalytics userId={user.id} />

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-hero-gradient hover:opacity-90" asChild>
                    <Link to="/book-appointment">
                      <Plus className="mr-2 h-4 w-4" />
                      Book New Appointment
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/services">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Services
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/support">
                      <Settings className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Consultation Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultationRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{request.service_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  ))}
                  {consultationRequests.length === 0 && (
                    <p className="text-muted-foreground">No consultation requests yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{appointment.appointment_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                  {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length === 0 && (
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            {consultationRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      {request.service_type}
                    </CardTitle>
                    {getStatusBadge(request.status)}
                  </div>
                  <CardDescription>
                    Submitted on {new Date(request.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{request.message}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {request.email}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {request.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {consultationRequests.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No consultation requests</h3>
                  <p className="text-muted-foreground mb-4">Start by submitting a consultation request</p>
                  <Button onClick={() => navigate("/")}>Request Consultation</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentManagement userId={user.id} />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      ${(payment.amount_cents / 100).toFixed(2)} {payment.currency.toUpperCase()}
                    </CardTitle>
                    {getStatusBadge(payment.status)}
                  </div>
                  <CardDescription>
                    {payment.service_type} - {new Date(payment.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            {payments.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payments made</h3>
                  <p className="text-muted-foreground mb-4">Your payment history will appear here</p>
                  <Button onClick={() => navigate("/services")}>View Services</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;