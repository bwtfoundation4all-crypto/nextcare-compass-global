import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

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
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{consultationRequests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Healthcare consultation requests
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled consultations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${payments.reduce((sum, p) => sum + (p.amount_cents / 100), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total amount paid
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(appointment.status)}
                      {appointment.appointment_type}
                    </CardTitle>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <CardDescription>
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Consultant:</span> {appointment.consultant_name || "TBD"}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {appointment.appointment_type}
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-4">
                      <span className="font-medium">Notes:</span>
                      <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {appointments.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
                  <p className="text-muted-foreground mb-4">Your appointments will appear here</p>
                  <Button onClick={() => navigate("/contact")}>Book Appointment</Button>
                </CardContent>
              </Card>
            )}
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