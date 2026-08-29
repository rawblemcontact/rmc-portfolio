import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { MobileLandscapeGate } from "./components/MobileLandscapeGate";
import { PortfolioDebugProvider } from "./lib/portfolioDebugMode";
import Home from "./pages/Home";
import { usePauseVideosWhilePinched } from "./lib/visualViewport";

function App() {
  usePauseVideosWhilePinched();
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioDebugProvider>
        <TooltipProvider>
          <Toaster />
          <Home />
          <MobileLandscapeGate />
        </TooltipProvider>
      </PortfolioDebugProvider>
    </QueryClientProvider>
  );
}

export default App;
