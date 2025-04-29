import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode, useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Features from "@/pages/features";
import Pricing from "@/pages/pricing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Calendar from "@/pages/calendar";
import Meetings from "@/pages/meetings";
import Booking from "@/pages/booking";
import Profile from "@/pages/profile";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRouter } from "wouter";
import { ThemeProvider } from "next-themes";

// Auth context
import { createContext, useContext } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  name?: string;
  timezone: string;
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  
  // Check if user is authenticated
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user: user || null, 
        isLoading, 
        isAuthenticated: !!user && !error,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Route guard for authenticated routes
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/onboarding">
        {() => (
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/calendar">
        {() => (
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/meetings">
        {() => (
          <PrivateRoute>
            <Meetings />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/profile">
        {() => (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/:username/:slug">
        {(params) => <Booking username={params.username} slug={params.slug} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
