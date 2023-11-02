"use client";
import { Theme } from "@/types";
import React from "react";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState<Theme>("system");

  React.useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "system";
    if (
      localTheme === "dark" ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        localTheme === "system")
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within the ThemeProvider");

  return context;
};
