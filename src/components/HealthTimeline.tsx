import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Calendar, Activity, Pill, FileText, TestTube, Stethoscope, Clipboard, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface HealthEvent {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  event_date: string;
  metadata: any;
  created_at: string;
}

const HealthTimeline = () => {
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HealthEvent | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    event_type: '',
    title: '',
    description: '',
    event_date: '',
    metadata: {}
  });

  const eventTypes = [
    { value: 'appointment', label: 'Appointment', icon: Calendar },
    { value: 'medication', label: 'Medication', icon: Pill },
    { value: 'symptom', label: 'Symptom', icon: Activity },
    { value: 'test_result', label: 'Test Result', icon: TestTube },
    { value: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
    { value: 'treatment', label: 'Treatment', icon: FileText },
    { value: 'note', label: 'Personal Note', icon: Clipboard }
  ];

  useEffect(() => {
    if (user) {
      fetchHealthEvents();
    }
  }, [user]);

  const fetchHealthEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('health_timeline')
        .select('*')
        .eq('user_id', user?.id)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching health events:', error);
      toast({
        title: "Error",
        description: "Failed to load health timeline",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      event_type: '',
      title: '',
      description: '',
      event_date: '',
      metadata: {}
    });
    setEditingEvent(null);
  };

  const openEditDialog = (event: HealthEvent) => {
    setEditingEvent(event);
    setFormData({
      event_type: event.event_type,
      title: event.title,
      description: event.description || '',
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      metadata: event.metadata || {}
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.event_type || !formData.title || !formData.event_date) {
      toast({
        title: "Error",
        description: "Event type, title, and date are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const eventData = {
        user_id: user?.id,
        event_type: formData.event_type,
        title: formData.title,
        description: formData.description || null,
        event_date: new Date(formData.event_date).toISOString(),
        metadata: formData.metadata
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('health_timeline')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Health event updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('health_timeline')
          .insert(eventData);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Health event added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHealthEvents();
    } catch (error) {
      console.error('Error saving health event:', error);
      toast({
        title: "Error",
        description: "Failed to save health event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this health event?')) return;

    try {
      const { error } = await supabase
        .from('health_timeline')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Health event deleted successfully",
      });
      fetchHealthEvents();
    } catch (error) {
      console.error('Error deleting health event:', error);
      toast({
        title: "Error",
        description: "Failed to delete health event",
        variant: "destructive",
      });
    }
  };

  const getEventIcon = (eventType: string) => {
    const eventTypeInfo = eventTypes.find(type => type.value === eventType);
    const IconComponent = eventTypeInfo?.icon || Clipboard;
    return <IconComponent className="h-4 w-4" />;
  };

  const getEventTypeLabel = (eventType: string) => {
    const eventTypeInfo = eventTypes.find(type => type.value === eventType);
    return eventTypeInfo?.label || eventType;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Health Timeline</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Health Event
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Health Event' : 'Add Health Event'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_type">Event Type *</Label>
                  <Select 
                    value={formData.event_type} 
                    onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="event_date">Date & Time *</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Annual checkup, Started new medication"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this health event..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update' : 'Add'} Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <Card key={event.id} className="relative">
            {index < events.length - 1 && (
              <div className="absolute left-6 top-16 w-px h-full bg-border" />
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {getEventTypeLabel(event.event_type)}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(event.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {event.description && (
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No health events recorded yet</p>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Health Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthTimeline;