import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { TransactionForm } from "@/components/TransactionForm";
import { AdminPanel } from "@/components/AdminPanel";
import { LoginForm } from "@/components/LoginForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setCurrentUser(profile);
      fetchTransactions(userId);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    }
  };

  const fetchTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const refreshData = () => {
    if (currentUser) {
      fetchUserProfile(currentUser.user_id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-banking-blue text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser ? {
          email: currentUser.email,
          name: currentUser.full_name,
          isAdmin: currentUser.is_admin
        } : null}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />

      {showLogin && (
        <LoginForm 
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
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              {currentUser.is_admin && (
                <TabsTrigger value="admin">Admin Panel</TabsTrigger>
              )}
            </TabsList>

            <div className="mt-8">
              <TabsContent value="dashboard">
                <Dashboard 
                  user={currentUser}
                  transactions={transactions} 
                  onRefresh={refreshData}
                />
              </TabsContent>

              <TabsContent value="transfer">
                <TransactionForm 
                  currentUser={currentUser} 
                  onTransactionComplete={refreshData} 
                />
              </TabsContent>

              {currentUser.is_admin && (
                <TabsContent value="admin">
                  <AdminPanel 
                    transactions={transactions}
                    onRefresh={refreshData}
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
