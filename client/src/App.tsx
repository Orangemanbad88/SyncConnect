import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import RouletteMatch from "@/pages/RouletteMatch";
import VideoChat from "@/pages/VideoChat";
import Messages from "@/pages/Messages";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { UserProvider } from "./context/UserContext";
import { AmbientProvider } from "./context/AmbientContext";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/roulette" component={RouletteMatch} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/video/:id" component={VideoChat} />
      <ProtectedRoute path="/messages/:id" component={Messages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AmbientProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </UserProvider>
        </AmbientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
