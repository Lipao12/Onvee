import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-neutral-900 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Comece a transformar sua barbearia hoje
            </h2>
            <p className="text-neutral-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Teste gratuitamente por 14 dias. Sem cartão, sem letras miúdas. Cancele quando quiser.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-gray-100 border-none">
                Começar teste grátis
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Falar com consultor
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-300">
                <span className="flex items-center gap-2"><Check className="h-4 w-4" /> 14 dias grátis</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Sem cartão necessário</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Setup instantâneo</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
