import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import RouletteMatch from "@/pages/RouletteMatch";
import Onboarding from "@/pages/Onboarding";
import VibeCheck from "@/pages/VibeCheck";
import ZodiacGuide from "@/pages/ZodiacGuide";
import VideoChat from "@/pages/VideoChat";
import VideoLobby from "@/pages/VideoLobby";
import Messages from "@/pages/Messages";
import Inbox from "@/pages/Inbox";
import AuthPage from "@/pages/auth-page";
import Profile from "@/pages/Profile";
import Explore from "@/pages/Explore";
import Recommendations from "@/pages/Recommendations";
import { ProtectedRoute } from "@/lib/protected-route";
import { UserProvider } from "./context/UserContext";
import { AmbientProvider } from "./context/AmbientContext";
import { CallProvider } from "./context/CallContext";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/dice" component={RouletteMatch} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/vibe-check" component={VibeCheck} />
      <Route path="/zodiac" component={ZodiacGuide} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/video" component={VideoLobby} />
      <ProtectedRoute path="/video/:id" component={VideoChat} />
      <ProtectedRoute path="/messages" component={Inbox} />
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
            <CallProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </CallProvider>
          </UserProvider>
        </AmbientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
