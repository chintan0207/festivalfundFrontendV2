import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/theme-provider";
import { AppButton } from "@/components/common/AppButton";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppButton variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </AppButton>
  );
}
