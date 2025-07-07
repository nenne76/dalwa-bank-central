import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, CreditCard, Settings } from "lucide-react";

interface HeaderProps {
  currentUser: {
    email: string;
    name: string;
    isAdmin: boolean;
  } | null;
  onLogout: () => void;
  onLogin: () => void;
}

export const Header = ({ currentUser, onLogout, onLogin }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-banking-blue to-banking-trust shadow-banking">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dalwa Bank</h1>
              <p className="text-white/80 text-sm">Your Trusted Banking Partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Card className="bg-white/10 border-white/20 px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-white" />
                    <div>
                      <p className="text-white font-medium">{currentUser.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-white/80 text-sm">{currentUser.email}</p>
                        {currentUser.isAdmin && (
                          <Badge variant="secondary" className="bg-banking-green text-white">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
                <Button 
                  onClick={onLogout}
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={onLogin}
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};