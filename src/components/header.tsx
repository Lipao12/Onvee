import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function Header({
  title,
  logo_url,
}: {
  title?: string;
  logo_url?: string;
}) {
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
    <header className="fixed z-50 w-full flex items-center justify-between px-5 py-3 transform duration-500 backdrop-blur-2xl  transition-colors duration-300">
      <div className="flex items-center gap-3">
        {logo_url ? (
          <img
            src={logo_url}
            alt={`${title} logo`}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
        {title ? (
          <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            {title}
          </h1>
        ) : (
          <Skeleton className="h-4 w-[150px]" />
        )}
      </div>

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
