import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import { UserProvider } from "./context/UserContext";
import { AmbientProvider } from "./context/AmbientContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AmbientProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </UserProvider>
    </AmbientProvider>
  );
}

export default App;
