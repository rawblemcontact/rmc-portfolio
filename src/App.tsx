import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { DebugRulerTool } from "./components/DebugRulerTool";
import {
  PortfolioDebugProvider,
} from "./lib/portfolioDebugMode";
import Home from "./pages/Home";

/** Dev-only draggable H/V ruler overlay — set `true` to restore. Component: `src/components/DebugRulerTool.tsx`. */
const SHOW_DEBUG_RULER_TOOL = false;

function PortfolioDebugTools() {
  if (!import.meta.env.DEV || !SHOW_DEBUG_RULER_TOOL) return null;
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
