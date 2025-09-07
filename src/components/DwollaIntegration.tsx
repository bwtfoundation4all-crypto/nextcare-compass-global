import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CheckCircle, AlertCircle, Banknote } from "lucide-react";

interface DwollaIntegrationProps {
  user: User;
}

interface DwollaState {
  customerId: string | null;
  fundingSourceId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const DwollaIntegration = ({ user }: DwollaIntegrationProps) => {
  const [dwollaState, setDwollaState] = useState<DwollaState>({
    customerId: null,
    fundingSourceId: null,
    isLoading: false,
    error: null
  });
  
  const [transferForm, setTransferForm] = useState({
    amount: "",
    note: ""
  });

  // Load existing Dwolla data from user profile
  useEffect(() => {
    const loadDwollaData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('dwolla_customer_id')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.dwolla_customer_id) {
        setDwollaState(prev => ({ ...prev, customerId: profile.dwolla_customer_id }));
      }
    };
    
    loadDwollaData();
  }, [user.id]);

  const createCustomer = async () => {
    setDwollaState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke('dwolla-create-customer');
      
      if (error) throw error;
      
      setDwollaState(prev => ({
        ...prev,
        customerId: data?.dwollaCustomerId || null,
        isLoading: false
      }));
      
      toast({
        title: "Success",
        description: "Dwolla customer created successfully",
      });
    } catch (error: any) {
      console.error('Create customer error:', error);
      setDwollaState(prev => ({
        ...prev,
        error: error.message || "Failed to create customer",
        isLoading: false
      }));
      
      toast({
        title: "Error",
        description: error.message || "Failed to create Dwolla customer",
        variant: "destructive"
      });
    }
  };

  const createFundingSource = async () => {
    if (!dwollaState.customerId) {
      toast({
        title: "Error",
        description: "Please create a Dwolla customer first",
        variant: "destructive"
      });
      return;
    }

    setDwollaState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke('dwolla-create-and-verify-funding-source');
      
      if (error) throw error;
      
      setDwollaState(prev => ({
        ...prev,
        fundingSourceId: data?.fundingSourceId || null,
        isLoading: false
      }));
      
      toast({
        title: "Success",
        description: "Test bank account linked and verified",
      });
    } catch (error: any) {
      console.error('Create funding source error:', error);
      setDwollaState(prev => ({
        ...prev,
        error: error.message || "Failed to link bank account",
        isLoading: false
      }));
      
      toast({
        title: "Error",
        description: error.message || "Failed to link bank account",
        variant: "destructive"
      });
    }
  };

  const initiateTransfer = async () => {
    if (!dwollaState.fundingSourceId) {
      toast({
        title: "Error",
        description: "Please link a test bank account first",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setDwollaState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke('dwolla-transfer', {
        body: {
          amountCents: Math.round(amount * 100),
          sourceFundingSourceId: dwollaState.fundingSourceId,
          note: transferForm.note || undefined
        }
      });
      
      if (error) throw error;
      
      setDwollaState(prev => ({ ...prev, isLoading: false }));
      setTransferForm({ amount: "", note: "" });
      
      toast({
        title: "Transfer Initiated",
        description: `ACH transfer of $${amount.toFixed(2)} has been initiated`,
      });
    } catch (error: any) {
      console.error('Transfer error:', error);
      setDwollaState(prev => ({
        ...prev,
        error: error.message || "Failed to initiate transfer",
        isLoading: false
      }));
      
      toast({
        title: "Error",
        description: error.message || "Failed to initiate transfer",
        variant: "destructive"
      });
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber === 1) return dwollaState.customerId ? 'complete' : 'pending';
    if (stepNumber === 2) return dwollaState.fundingSourceId ? 'complete' : dwollaState.customerId ? 'pending' : 'disabled';
    return dwollaState.fundingSourceId ? 'pending' : 'disabled';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          ACH Payments (Dwolla Sandbox)
        </CardTitle>
        <CardDescription>
          Test environment for ACH bank transfers. Use sandbox data for testing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {dwollaState.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{dwollaState.error}</span>
          </div>
        )}

        {/* Step 1: Create Customer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getStepStatus(1) === 'complete' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
            )}
            <h3 className="font-semibold">Step 1: Create Dwolla Customer</h3>
          </div>
          <Button
            onClick={createCustomer}
            disabled={dwollaState.isLoading || !!dwollaState.customerId}
            variant={dwollaState.customerId ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            {dwollaState.isLoading && <LoadingSpinner className="mr-2" />}
            {dwollaState.customerId ? 'Customer Ready ✓' : 'Create Customer'}
          </Button>
          {dwollaState.customerId && (
            <p className="text-xs text-muted-foreground">
              Customer ID: {dwollaState.customerId}
            </p>
          )}
        </div>

        {/* Step 2: Link Bank Account */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getStepStatus(2) === 'complete' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : getStepStatus(2) === 'pending' ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground opacity-50" />
            )}
            <h3 className="font-semibold">Step 2: Link Test Bank Account</h3>
          </div>
          <Button
            onClick={createFundingSource}
            disabled={dwollaState.isLoading || !dwollaState.customerId || !!dwollaState.fundingSourceId}
            variant={dwollaState.fundingSourceId ? "outline" : "secondary"}
            className="w-full sm:w-auto"
          >
            {dwollaState.isLoading && <LoadingSpinner className="mr-2" />}
            {dwollaState.fundingSourceId ? 'Bank Linked ✓' : 'Link Test Bank'}
          </Button>
          {dwollaState.fundingSourceId && (
            <p className="text-xs text-muted-foreground">
              Funding Source ID: {dwollaState.fundingSourceId}
            </p>
          )}
        </div>

        {/* Step 3: Test Transfer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`h-5 w-5 rounded-full border-2 ${getStepStatus(3) === 'pending' ? 'border-primary' : 'border-muted-foreground opacity-50'}`} />
            <h3 className="font-semibold">Step 3: Test ACH Transfer</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="transfer-amount">Amount (USD)</Label>
              <Input
                id="transfer-amount"
                type="number"
                step="0.01"
                min="0.01"
                max="1000"
                value={transferForm.amount}
                onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                disabled={!dwollaState.fundingSourceId || dwollaState.isLoading}
              />
            </div>
            <div>
              <Label htmlFor="transfer-note">Note (Optional)</Label>
              <Input
                id="transfer-note"
                value={transferForm.note}
                onChange={(e) => setTransferForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Transfer description"
                disabled={!dwollaState.fundingSourceId || dwollaState.isLoading}
              />
            </div>
          </div>
          
          <Button
            onClick={initiateTransfer}
            disabled={dwollaState.isLoading || !dwollaState.fundingSourceId || !transferForm.amount}
            className="w-full sm:w-auto"
          >
            {dwollaState.isLoading && <LoadingSpinner className="mr-2" />}
            Initiate ACH Transfer
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <strong>Sandbox Environment:</strong> This uses test data only. No real money will be transferred.
          The system uses default sandbox bank account (routing: 222222226, account: 123456789).
        </div>
      </CardContent>
    </Card>
  );
};