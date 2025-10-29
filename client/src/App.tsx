import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, UserRole } from "@/contexts/AuthContext";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import VoiceArtist from "@/pages/voice-artist";
import Attendance from "@/pages/attendance";
import WorkFlow from "@/pages/work-flow";
import VideoUploadTime from "@/pages/video-upload-time";
import EmployeeData from "@/pages/employee-data";
import JelaReporterData from "@/pages/jela-reporter-data";
import Rankings from "@/pages/rankings";
import Admin from "@/pages/admin";

function ProtectedRoute({ 
  component: Component, 
  requiredRole 
}: { 
  component: React.ComponentType;
  requiredRole?: UserRole;
}) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/voice-artist">
        {() => <ProtectedRoute component={VoiceArtist} />}
      </Route>
      <Route path="/attendance">
        {() => <ProtectedRoute component={Attendance} />}
      </Route>
      <Route path="/work-flow">
        {() => <ProtectedRoute component={WorkFlow} />}
      </Route>
      <Route path="/video-upload-time">
        {() => <ProtectedRoute component={VideoUploadTime} />}
      </Route>
      <Route path="/employee-data">
        {() => <ProtectedRoute component={EmployeeData} requiredRole="admin" />}
      </Route>
      <Route path="/jela-reporter-data">
        {() => <ProtectedRoute component={JelaReporterData} requiredRole="admin" />}
      </Route>
      <Route path="/rankings">
        {() => <ProtectedRoute component={Rankings} requiredRole="admin" />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={Admin} requiredRole="admin" />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
