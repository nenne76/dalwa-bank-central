import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { TransactionForm } from "@/components/TransactionForm";
import { AdminPanel } from "@/components/AdminPanel";
import { LoginForm } from "@/components/LoginForm";

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  category: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(50000); // Starting balance

  // Load demo data
  useEffect(() => {
    const demoTransactions: Transaction[] = [
      {
        id: '1',
        amount: 5000,
        type: 'credit',
        description: 'Monthly Salary',
        date: '2025-01-05',
        category: 'Salary'
      },
      {
        id: '2',
        amount: 150,
        type: 'debit',
        description: 'Grocery Shopping',
        date: '2025-01-06',
        category: 'Food'
      },
      {
        id: '3',
        amount: 2000,
        type: 'credit',
        description: 'Freelance Project',
        date: '2025-01-04',
        category: 'Business'
      }
    ];
    setTransactions(demoTransactions);
  }, []);

  // Calculate balance based on transactions
  useEffect(() => {
    const calculatedBalance = transactions.reduce((sum, transaction) => {
      return transaction.type === 'credit' 
        ? sum + transaction.amount 
        : sum - transaction.amount;
    }, 50000); // Starting with 50k base balance
    setBalance(calculatedBalance);
  }, [transactions]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onLogin={() => setShowLogin(true)}
      />

      {showLogin && (
        <LoginForm 
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        {!currentUser ? (
          // Landing Page for non-authenticated users
          <div className="text-center py-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-banking-blue to-banking-trust bg-clip-text text-transparent">
                Welcome to Dalwa Bank
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your trusted banking partner for secure online transactions and financial management.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="group p-8 rounded-2xl bg-gradient-feature border border-banking-blue/20 shadow-feature hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-banking-blue/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-banking-blue/20 transition-colors">
                    <div className="w-6 h-6 bg-banking-blue rounded-md opacity-80"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-banking-blue">Secure Transactions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Register and manage your financial transactions with bank-level security and encryption.
                  </p>
                </div>
                <div className="group p-8 rounded-2xl bg-gradient-feature border border-banking-green/20 shadow-feature hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-banking-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-banking-green/20 transition-colors">
                    <div className="w-6 h-6 bg-banking-green rounded-md opacity-80"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-banking-green">Real-time Dashboard</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Track your balance and transaction history with our intuitive, real-time dashboard.
                  </p>
                </div>
                <div className="group p-8 rounded-2xl bg-gradient-feature border border-banking-trust/20 shadow-feature hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-banking-trust/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-banking-trust/20 transition-colors">
                    <div className="w-6 h-6 bg-banking-trust rounded-md opacity-80"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-banking-trust">Admin Control</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Complete administrative control with advanced management tools for authorized personnel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Authenticated User Interface
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">New Transaction</TabsTrigger>
              {currentUser.isAdmin && (
                <TabsTrigger value="admin">Admin Panel</TabsTrigger>
              )}
            </TabsList>

            <div className="mt-8">
              <TabsContent value="dashboard">
                <Dashboard balance={balance} transactions={transactions} />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionForm onAddTransaction={handleAddTransaction} />
              </TabsContent>

              {currentUser.isAdmin && (
                <TabsContent value="admin">
                  <AdminPanel 
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                    onEditTransaction={handleEditTransaction}
                  />
                </TabsContent>
              )}
            </div>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
