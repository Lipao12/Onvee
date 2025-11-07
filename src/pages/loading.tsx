import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Afiando as tesouras...",
  "Preparando a cadeira...",
  "Polindo os espelhos...",
  "Carregando barbeiros e serviços...",
  "Deixando tudo pronto para você 💈",
];

export default function LoadingPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-zinc-100 dark:bg-zinc-900 transition-colors duration-500">
      {/* Animação de círculo pulsante */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-12 h-12 border-4 border-zinc-400 border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Mensagem rotativa */}
      <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200 text-center px-4 transition-all duration-500">
        {LOADING_MESSAGES[index]}
      </p>

      {/* Detalhe sutil */}
      <span className="text-sm text-zinc-400 dark:text-zinc-500 mt-4">
        BarberApp está se preparando...
      </span>
    </div>
  );
}
