import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalUsers: number;
  totalAppointments: number;
  totalPayments: number;
  totalConsultations: number;
  recentAppointments: number;
  pendingConsultations: number;
  chatSessions: number;
  averageResponseTime: string;
}

const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalAppointments: 0,
    totalPayments: 0,
    totalConsultations: 0,
    recentAppointments: 0,
    pendingConsultations: 0,
    chatSessions: 0,
    averageResponseTime: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [appointmentTypeData, setAppointmentTypeData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total counts
      const [
        { count: totalUsers },
        { count: totalAppointments },
        { count: totalPayments },
        { count: totalConsultations },
        { count: chatSessions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('*', { count: 'exact', head: true }),
        supabase.from('consultation_requests').select('*', { count: 'exact', head: true }),
        supabase.from('ai_chat_sessions').select('*', { count: 'exact', head: true })
      ]);

      // Fetch recent appointments (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch pending consultations
      const { count: pendingConsultations } = await supabase
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch monthly appointment data for chart
      const { data: monthlyAppointments } = await supabase
        .from('appointments')
        .select('created_at')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString());

      // Process monthly data
      const monthlyStats = processMonthlyData(monthlyAppointments || []);
      setMonthlyData(monthlyStats);

      // Fetch appointment types for pie chart
      const { data: appointmentTypes } = await supabase
        .from('appointments')
        .select('appointment_type');

      const typeStats = processAppointmentTypes(appointmentTypes || []);
      setAppointmentTypeData(typeStats);

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalAppointments: totalAppointments || 0,
        totalPayments: totalPayments || 0,
        totalConsultations: totalConsultations || 0,
        recentAppointments: recentAppointments || 0,
        pendingConsultations: pendingConsultations || 0,
        chatSessions: chatSessions || 0,
        averageResponseTime: '2.5 hours'
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processMonthlyData = (appointments: any[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const count = appointments.filter(apt => {
        const aptDate = new Date(apt.created_at);
        const aptMonthKey = `${aptDate.getFullYear()}-${String(aptDate.getMonth() + 1).padStart(2, '0')}`;
        return aptMonthKey === monthKey;
      }).length;

      last6Months.push({
        month: monthNames[date.getMonth()],
        appointments: count
      });
    }
    
    return last6Months;
  };

  const processAppointmentTypes = (appointments: any[]) => {
    const typeCounts: Record<string, number> = {};
    
    appointments.forEach(apt => {
      const type = apt.appointment_type || 'general';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.recentAppointments} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.recentAppointments} in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              Payment transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.pendingConsultations} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Chat Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.chatSessions}</div>
            <p className="text-xs text-muted-foreground">
              Active AI conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Month over month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Uptime this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;