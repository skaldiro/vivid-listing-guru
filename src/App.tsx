import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<div>Generate Listing</div>} />
            <Route path="/listings" element={<div>Listings</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;