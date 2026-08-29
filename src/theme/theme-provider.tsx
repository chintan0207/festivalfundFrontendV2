/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ModuleTheme =
  | "module-dashboard"
  | "module-contributors"
  | "module-contributions"
  | "module-expenses"
  | "module-reports"
  | "module-tasksnotes"
  | "module-tasks-notes";

type ThemeProviderState = {
  theme: Theme;
  module: ModuleTheme;
  toggleTheme: () => void;
  setModule: (module: ModuleTheme) => void;
};

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const [module, setModule] = useState<ModuleTheme>("module-dashboard");

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        module,
        toggleTheme,
        setModule,
      }}
    >
      <div className={`${module} min-h-screen bg-background text-foreground`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
