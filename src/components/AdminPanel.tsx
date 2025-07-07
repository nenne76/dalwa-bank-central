import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Trash2, 
  Edit3, 
  Search, 
  Filter,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  category: string;
}

interface AdminPanelProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

export const AdminPanel = ({ transactions, onDeleteTransaction, onEditTransaction }: AdminPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTransactions = transactions.length;
  const totalCredits = transactions.filter(t => t.type === 'credit').length;
  const totalDebits = transactions.filter(t => t.type === 'debit').length;
  const totalAmount = transactions.reduce((sum, t) => 
    sum + (t.type === 'credit' ? t.amount : -t.amount), 0
  );

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been successfully removed",
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-r from-banking-blue to-banking-trust text-white shadow-banking">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Admin Panel</span>
          </CardTitle>
          <p className="text-white/80">Manage all transactions and system settings</p>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-banking-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-banking-success" />
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold text-banking-success">{totalCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-destructive rotate-180" />
              <div>
                <p className="text-sm text-muted-foreground">Debits</p>
                <p className="text-2xl font-bold text-destructive">{totalDebits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-banking-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Net Amount</p>
                <p className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-banking-success' : 'text-destructive'}`}>
                  ${Math.abs(totalAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Transaction Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="space-y-2">
            {filteredTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions found.
              </p>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border hover:shadow-card transition-shadow"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Badge variant="outline" className="w-fit">
                      {transaction.category}
                    </Badge>
                    
                    <Badge 
                      variant={transaction.type === 'credit' ? 'default' : 'destructive'}
                      className="w-fit"
                    >
                      {transaction.type}
                    </Badge>
                    
                    <p className={`font-bold ${
                      transaction.type === 'credit' 
                        ? 'text-banking-success' 
                        : 'text-destructive'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(transaction.id)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};