import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { DollarSign, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface Invoice {
  id: string;
  amount_cents: number;
  currency: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

const Payments = () => {
  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Dwolla ACH sandbox state
  const [dwollaCustomerId, setDwollaCustomerId] = useState<string | null>(null);
  const [dwollaFundingSourceId, setDwollaFundingSourceId] = useState<string | null>(null);
  const [achAmount, setAchAmount] = useState("");
  const [achNote, setAchNote] = useState("");
  const [achLoading, setAchLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchInvoices();
      }
      setLoading(false);
    };

    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchInvoices();
      } else {
        setInvoices([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } else {
      setInvoices(data || []);
    }
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    const amountCents = Math.round(parseFloat(amount) * 100);

    const { error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        amount_cents: amountCents,
        description,
        due_date: dueDate || null,
        status: 'draft'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      setAmount("");
      setDescription("");
      setDueDate("");
      setShowForm(false);
      await fetchInvoices();
    }
    setCreating(false);
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', invoiceId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Invoice ${newStatus}`,
      });
      await fetchInvoices();
    }
  };

  // Dwolla ACH actions
  const handleCreateDwollaCustomer = async () => {
    setAchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('dwolla-create-customer');
      if (error) throw error;
      setDwollaCustomerId((data as any)?.dwollaCustomerId || (data as any)?.dwolla_customer_id || null);
      toast({ title: "Dwolla customer ready" });
    } catch (e: any) {
      toast({ title: "Dwolla error", description: e.message || String(e), variant: "destructive" });
    } finally {
      setAchLoading(false);
    }
  };

  const handleCreateFundingSource = async () => {
    setAchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('dwolla-create-and-verify-funding-source');
      if (error) throw error;
      setDwollaFundingSourceId((data as any)?.fundingSourceId || null);
      toast({ title: "Bank linked (sandbox)" });
    } catch (e: any) {
      toast({ title: "Dwolla error", description: e.message || String(e), variant: "destructive" });
    } finally {
      setAchLoading(false);
    }
  };

  const handleAchTransfer = async () => {
    if (!dwollaFundingSourceId) {
      toast({ title: "Missing bank", description: "Link a test bank first", variant: "destructive" });
      return;
    }
    const amt = parseFloat(achAmount);
    if (isNaN(amt) || amt <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    setAchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('dwolla-transfer', {
        body: { amountCents: Math.round(amt * 100), sourceFundingSourceId: dwollaFundingSourceId, note: achNote || undefined }
      });
      if (error) throw error;
      toast({ title: "ACH initiated", description: `Transfer ID: ${(data as any)?.transferId || 'created'}` });
    } catch (e: any) {
      toast({ title: "Dwolla error", description: e.message || String(e), variant: "destructive" });
    } finally {
      setAchLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approved':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'canceled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">Please log in to access payments</p>
            <Button onClick={() => window.location.href = '/auth'}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Payment Management</h1>
              <p className="text-muted-foreground">Manage invoices and payments with Dwolla ACH</p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-hero-gradient hover:opacity-90"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>Create an invoice for Dwolla ACH payment processing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createInvoice} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date (Optional)</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Service description..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={creating}>
                      {creating ? "Creating..." : "Create Invoice"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
          </Card>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>ACH (Dwolla) Sandbox</CardTitle>
              <CardDescription>Set up your test customer and bank, then run a test transfer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCreateDwollaCustomer} disabled={achLoading}>
                  {dwollaCustomerId ? 'Customer Ready' : 'Create Dwolla Customer'}
                </Button>
                <Button onClick={handleCreateFundingSource} variant="secondary" disabled={achLoading || !dwollaCustomerId}>
                  {dwollaFundingSourceId ? 'Bank Linked' : 'Link Test Bank'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="achAmount">Amount (USD)</Label>
                  <Input id="achAmount" type="number" step="0.01" min="0.01" value={achAmount} onChange={(e) => setAchAmount(e.target.value)} placeholder="0.00" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="achNote">Note (optional)</Label>
                  <Input id="achNote" value={achNote} onChange={(e) => setAchNote(e.target.value)} placeholder="Description" />
                </div>
              </div>
              <Button onClick={handleAchTransfer} disabled={achLoading || !dwollaFundingSourceId}>
                {achLoading ? 'Processing...' : 'Initiate ACH Transfer'}
              </Button>
              <div className="text-sm text-muted-foreground">
                {dwollaCustomerId && <div>Customer ID: {dwollaCustomerId}</div>}
                {dwollaFundingSourceId && <div>Funding Source ID: {dwollaFundingSourceId}</div>}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Invoices</h2>
            {invoices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No invoices found</p>
                  <p className="text-sm text-muted-foreground">Create your first invoice to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(invoice.status)}
                            <h3 className="font-semibold">
                              ${(invoice.amount_cents / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                            </h3>
                            <Badge variant={getStatusVariant(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          {invoice.description && (
                            <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>
                          )}
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Created: {new Date(invoice.created_at).toLocaleDateString()}</span>
                            {invoice.due_date && (
                              <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {invoice.status === 'draft' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                            >
                              Send
                            </Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateInvoiceStatus(invoice.id, 'approved')}
                            >
                              Approve
                            </Button>
                          )}
                          {invoice.status === 'approved' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;