import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export default function Header({ title }: { title?: string }) {
  //const [isDark, setIsDark] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Mantém o tema entre sessões
  /*useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);*/

  /*const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };*/

  return (
    <header className="w-full flex items-center justify-between px-5 py-3  bg-transparent transition-colors duration-300">
      <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
        {title || "BarberApp"}
      </h1>

      <div className="flex items-center gap-2">
        {/* Botão de alternar tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
        >
          {!isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
