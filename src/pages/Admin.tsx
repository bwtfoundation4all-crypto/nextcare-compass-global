import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, FileText, CreditCard, UserCheck, Calendar, Settings, LogOut, Building } from 'lucide-react';
import { CustomersTab } from '@/components/admin/CustomersTab';
import { EmployeesTab } from '@/components/admin/EmployeesTab';
import { ConsultationsTab } from '@/components/admin/ConsultationsTab';
import { AppointmentsTab } from '@/components/admin/AppointmentsTab';
import { PaymentsTab } from '@/components/admin/PaymentsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';

const Admin = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('customers');

  const adminStats = [
    {
      title: 'Total Customers',
      value: '1,234',
      icon: Users,
      description: 'Active customer accounts',
      color: 'text-blue-600'
    },
    {
      title: 'Consultations',
      value: '89',
      icon: FileText,
      description: 'Pending requests',
      color: 'text-orange-600'
    },
    {
      title: 'Appointments',
      value: '156',
      icon: Calendar,
      description: 'This month',
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: '$24,580',
      icon: CreditCard,
      description: 'Monthly total',
      color: 'text-purple-600'
    }
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-primary">NextCare Global</h1>
                  <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Admin Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Internal management system for NextCare Global operations, customer data, and business analytics.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Admin Management Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Employees</span>
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Consultations</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeesTab />
          </TabsContent>

          <TabsContent value="consultations">
            <ConsultationsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;