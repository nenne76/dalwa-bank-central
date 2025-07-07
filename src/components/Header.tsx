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
    <header className="bg-gradient-to-r from-banking-blue to-banking-trust shadow-banking relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <CreditCard className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">Dalwa Bank</h1>
              <p className="text-white/90 text-sm font-medium">Your Trusted Banking Partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Card className="bg-white/15 border-white/25 px-5 py-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{currentUser.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-white/90 text-sm">{currentUser.email}</p>
                        {currentUser.isAdmin && (
                          <Badge variant="secondary" className="bg-banking-green/90 text-white text-xs px-2 py-0.5">
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
                  className="border-white/30 text-white hover:bg-white/15 backdrop-blur-sm transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={onLogin}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/15 backdrop-blur-sm transition-all duration-200 px-6"
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