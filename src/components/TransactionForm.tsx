import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  user_id: string;
  id: string;
  email: string;
  full_name: string;
  account_number: string;
  balance: number;
  is_admin: boolean;
}

interface TransactionFormProps {
  currentUser: User;
  onTransactionComplete: () => void;
}

export const TransactionForm = ({ currentUser, onTransactionComplete }: TransactionFormProps) => {
  const [amount, setAmount] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!amount || !toAccountNumber || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (numAmount > currentUser.balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this transfer",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // Check if recipient account exists
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_number', toAccountNumber)
        .single();

      if (recipientError || !recipient) {
        toast({
          title: "Account Not Found",
          description: "The recipient account number does not exist",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Create transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          from_user_id: currentUser.user_id,
          to_user_id: recipient.user_id,
          from_account_number: currentUser.account_number,
          to_account_number: toAccountNumber,
          amount: numAmount,
          transaction_type: 'transfer',
          description: description,
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      // Update balances
      const { error: senderError } = await supabase
        .from('profiles')
        .update({ balance: currentUser.balance - numAmount })
        .eq('user_id', currentUser.user_id);

      if (senderError) throw senderError;

      const { error: recipientError2 } = await supabase
        .from('profiles')
        .update({ balance: recipient.balance + numAmount })
        .eq('user_id', recipient.user_id);

      if (recipientError2) throw recipientError2;

      toast({
        title: "Transfer Successful",
        description: `₦${numAmount.toLocaleString()} sent to ${recipient.full_name}`,
      });

      // Reset form
      setAmount("");
      setToAccountNumber("");
      setDescription("");
      
      onTransactionComplete();
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-to-r from-banking-blue/5 to-banking-trust/5">
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5 text-banking-blue" />
          <span>Send Money</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>Amount (₦) *</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              required
            />
            <p className="text-sm text-muted-foreground">
              Available balance: ₦{currentUser.balance.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toAccount">Recipient Account Number *</Label>
            <Input
              id="toAccount"
              type="text"
              placeholder="Enter 10-digit account number"
              value={toAccountNumber}
              onChange={(e) => setToAccountNumber(e.target.value)}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="What's this transfer for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-banking-blue to-banking-trust hover:opacity-90 shadow-banking"
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};