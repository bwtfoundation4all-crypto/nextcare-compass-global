import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, CreditCard, UserCheck, Calendar, Settings } from 'lucide-react';
import { CustomersTab } from '@/components/admin/CustomersTab';
import { EmployeesTab } from '@/components/admin/EmployeesTab';
import { ConsultationsTab } from '@/components/admin/ConsultationsTab';
import { AppointmentsTab } from '@/components/admin/AppointmentsTab';
import { PaymentsTab } from '@/components/admin/PaymentsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';

const Admin = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage customers, employees, consultations, and system settings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-hero transition-all duration-300">
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

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
      </main>
    </div>
  );
};

export default Admin;