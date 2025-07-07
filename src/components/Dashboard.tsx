import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

interface User {
  user_id: string;
  id: string;
  email: string;
  full_name: string;
  account_number: string;
  balance: number;
  is_admin: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  from_account_number: string | null;
  to_account_number: string;
  transaction_type: string;
  description: string;
  created_at: string;
  status: string;
}

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onRefresh: () => void;
}

export const Dashboard = ({ user, transactions, onRefresh }: DashboardProps) => {
  const recentTransactions = transactions.slice(0, 5);
  const totalIncoming = transactions
    .filter(t => t.to_account_number === user.account_number)
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalOutgoing = transactions
    .filter(t => t.from_account_number === user.account_number)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-banking-blue">{user.full_name}</h2>
              <p className="text-muted-foreground">Account: {user.account_number}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {user.is_admin && (
              <Badge className="bg-banking-trust text-white">Admin</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-banking-blue to-banking-trust text-white shadow-banking">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Current Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{Number(user.balance).toLocaleString()}</div>
            <p className="text-xs opacity-80 mt-1">
              Available for transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Money Received
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-banking-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-banking-success">
              +₦{totalIncoming.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total received
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Money Sent
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              -₦{totalOutgoing.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions yet. Start by making your first transfer!
              </p>
            ) : (
              recentTransactions.map((transaction) => {
                const isIncoming = transaction.to_account_number === user.account_number;
                const isOutgoing = transaction.from_account_number === user.account_number;
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        isIncoming 
                          ? 'bg-banking-success/10' 
                          : 'bg-destructive/10'
                      }`}>
                        {isIncoming ? (
                          <ArrowUpRight className="h-4 w-4 text-banking-success" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {isIncoming ? `From: ${transaction.from_account_number || 'System'}` : `To: ${transaction.to_account_number}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        isIncoming 
                          ? 'text-banking-success' 
                          : 'text-destructive'
                      }`}>
                        {isIncoming ? '+' : '-'}₦{Number(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};