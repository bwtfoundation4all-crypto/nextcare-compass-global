import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  Globe,
  Save,
  RefreshCw 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoAssignment, setAutoAssignment] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been saved successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="NextCare Global" />
                </div>
                <div>
                  <Label htmlFor="company-email">Support Email</Label>
                  <Input id="company-email" type="email" defaultValue="support@nextcare.com" />
                </div>
                <div>
                  <Label htmlFor="company-phone">Support Phone</Label>
                  <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable to temporarily disable customer access
                    </div>
                  </div>
                  <Switch 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Send email notifications for new consultations
                    </div>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Send SMS alerts for urgent matters
                    </div>
                  </div>
                  <Switch 
                    checked={smsNotifications} 
                    onCheckedChange={setSmsNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assignment</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically assign consultations to available staff
                    </div>
                  </div>
                  <Switch 
                    checked={autoAssignment} 
                    onCheckedChange={setAutoAssignment}
                  />
                </div>

                <Separator />
                
                <div>
                  <Label htmlFor="notification-email">Notification Recipients</Label>
                  <Textarea 
                    id="notification-email"
                    placeholder="admin@nextcare.com, manager@nextcare.com"
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Comma-separated email addresses
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Default User Role</Label>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="outline">Customer</Badge>
                    <Badge variant="outline">Employee</Badge>
                    <Badge variant="outline">Admin</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">User Registration Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Self Registration</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow users to create accounts without invitation
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verification Required</Label>
                      <div className="text-sm text-muted-foreground">
                        Require email verification for new accounts
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <div className="text-sm text-muted-foreground">
                      Auto-logout after inactivity (minutes)
                    </div>
                  </div>
                  <Input className="w-20" defaultValue="30" />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Password Policy</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum Length</Label>
                      <Input defaultValue="8" />
                    </div>
                    <div>
                      <Label>Password Expiry (days)</Label>
                      <Input defaultValue="90" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stripe Payment Processing</h4>
                      <div className="text-sm text-muted-foreground">
                        Payment gateway integration
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Dwolla Bank Transfers</h4>
                      <div className="text-sm text-muted-foreground">
                        ACH payment processing
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Resend Email Service</h4>
                      <div className="text-sm text-muted-foreground">
                        Email delivery service
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">API Settings</h4>
                  <div>
                    <Label>Rate Limiting</Label>
                    <div className="text-sm text-muted-foreground">
                      Requests per minute: 100
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings} className="bg-hero-gradient hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};