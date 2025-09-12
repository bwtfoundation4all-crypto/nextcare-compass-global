import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Users, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string | null;
  phone: string | null;
  email: string | null;
  emergency_contact: boolean;
}

const FamilyManagement = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    date_of_birth: '',
    phone: '',
    email: '',
    emergency_contact: false
  });

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  const fetchFamilyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      date_of_birth: '',
      phone: '',
      email: '',
      emergency_contact: false
    });
    setEditingMember(null);
  };

  const openEditDialog = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      date_of_birth: member.date_of_birth || '',
      phone: member.phone || '',
      email: member.email || '',
      emergency_contact: member.emergency_contact
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relationship) {
      toast({
        title: "Error",
        description: "Name and relationship are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const memberData = {
        user_id: user?.id,
        name: formData.name,
        relationship: formData.relationship,
        date_of_birth: formData.date_of_birth || null,
        phone: formData.phone || null,
        email: formData.email || null,
        emergency_contact: formData.emergency_contact
      };

      if (editingMember) {
        const { error } = await supabase
          .from('family_members')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Family member updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('family_members')
          .insert(memberData);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Family member added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error saving family member:', error);
      toast({
        title: "Error",
        description: "Failed to save family member",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Family member removed successfully",
      });
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error deleting family member:', error);
      toast({
        title: "Error",
        description: "Failed to remove family member",
        variant: "destructive",
      });
    }
  };

  const relationships = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 
    'Grandchild', 'Partner', 'Guardian', 'Other'
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Family Management</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Edit Family Member' : 'Add Family Member'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select 
                    value={formData.relationship} 
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((rel) => (
                        <SelectItem key={rel} value={rel.toLowerCase()}>{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="emergency_contact"
                  checked={formData.emergency_contact}
                  onCheckedChange={(checked) => setFormData({ ...formData, emergency_contact: checked })}
                />
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMember ? 'Update' : 'Add'} Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {familyMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{member.name}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(member.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                <p className="capitalize">{member.relationship}</p>
              </div>
              
              {member.date_of_birth && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p>{new Date(member.date_of_birth).toLocaleDateString()}</p>
                </div>
              )}
              
              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.phone}</span>
                </div>
              )}
              
              {member.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
              )}
              
              {member.emergency_contact && (
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                  Emergency Contact
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {familyMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No family members added yet</p>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Family Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyManagement;