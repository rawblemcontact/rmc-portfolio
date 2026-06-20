import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const PortfolioDebugContext = createContext(false);

function isFnToggleKey(event: KeyboardEvent) {
  return (
    event.key === "Fn" ||
    event.key === "F13" ||
    event.code === "FnLeft" ||
    event.code === "FnRight"
  );
}

export function PortfolioDebugProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!isDev) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFnToggleKey(event)) return;
      event.preventDefault();
      setEnabled((value) => !value);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDev]);

  return (
    <PortfolioDebugContext.Provider value={isDev && enabled}>
      {children}
    </PortfolioDebugContext.Provider>
  );
}

export function usePortfolioDebugEnabled() {
  return useContext(PortfolioDebugContext);
}
