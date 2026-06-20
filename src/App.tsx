import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { DebugRulerTool } from "./components/DebugRulerTool";
import {
  PortfolioDebugProvider,
} from "./lib/portfolioDebugMode";
import Home from "./pages/Home";

function PortfolioDebugTools() {
  if (!import.meta.env.DEV) return null;
  return <DebugRulerTool />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioDebugProvider>
        <TooltipProvider>
          <Toaster />
          <Home />
          <PortfolioDebugTools />
        </TooltipProvider>
      </PortfolioDebugProvider>
    </QueryClientProvider>
  );
}

export default App;
