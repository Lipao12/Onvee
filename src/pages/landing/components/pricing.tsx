import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Star, Zap } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-neutral-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            </span>
            Planos Flexíveis
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Investimento que se paga <span className="text-neutral-600 relative">
              no primeiro dia
              <svg className="absolute w-full h-2 -bottom-1 left-0 text-neutral-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Escolha o período que melhor se adapta ao seu fluxo de caixa. Todos os planos incluem acesso completo a todas as funcionalidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Mensal */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-neutral-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-24 h-24 text-gray-900" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Mensal</h4>
              <p className="text-gray-500 text-sm mb-8">Flexibilidade total sem fidelidade.</p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight">R$ 89</span>
                <span className="text-gray-500 font-medium text-lg">/mês</span>
              </div>
              
              <Button variant="outline" className="w-full mb-8 py-6 text-base font-semibold border-gray-200 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-700 transition-all">
                Começar agora
              </Button>
              
              <div className="space-y-5 flex-1">
                {[
                  'Agenda Ilimitada', 
                  'Link de Agendamento', 
                  'Gestão Financeira Básica',
                  'Suporte por Email'
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="bg-gray-100 p-1 rounded-full flex-shrink-0 mt-0.5 group-hover:bg-neutral-100 group-hover:text-neutral-700 transition-colors">
                      <Check className="h-3 w-3" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semestral - Highlighted */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-neutral-600 relative transform md:-translate-y-4 z-10 flex flex-col h-full">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-neutral-600 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                <Star className="h-4 w-4 fill-current" /> Mais Popular
            </div>
            
            <div className="flex flex-col h-full pt-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Semestral</h4>
              <p className="text-gray-500 text-sm mb-8">O equilíbrio ideal para crescer.</p>
              
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-6xl font-extrabold text-neutral-600 tracking-tight">R$ 79</span>
                <span className="text-gray-500 font-medium text-lg">/mês</span>
              </div>
              <p className="text-xs text-neutral-700 font-semibold mb-8 bg-neutral-50 inline-block px-3 py-1.5 rounded-lg self-start border border-neutral-100">
                  Cobrado R$ 474 a cada 6 meses
              </p>
              
              <Button size="lg" className="w-full mb-8 py-7 text-base font-bold shadow-lg shadow-neutral-600/20 hover:shadow-neutral-600/40 transition-all">
                Começar teste grátis
              </Button>
              
              <div className="space-y-5 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tudo do Mensal, mais:</p>
                {[
                  'Lembretes WhatsApp Automáticos',
                  'Painel de Gestão de Time', 
                  'Suporte Prioritário',
                  'Desconto de 11%'
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-900 font-medium">
                    <div className="bg-neutral-100 p-1 rounded-full flex-shrink-0 mt-0.5 text-neutral-700">
                      <Check className="h-3 w-3" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anual */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-neutral-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-gray-900" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Anual</h4>
              <p className="text-gray-500 text-sm mb-8">Máxima economia e lucro.</p>
              
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight">R$ 69</span>
                <span className="text-gray-500 font-medium text-lg">/mês</span>
              </div>
              <p className="text-xs text-green-700 font-semibold mb-8 bg-green-50 inline-block px-3 py-1.5 rounded-lg self-start border border-green-100">
                  Economize R$ 240/ano
              </p>
              
              <Button variant="outline" className="w-full mb-8 py-6 text-base font-semibold border-gray-200 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-700 transition-all">
                Garantir oferta
              </Button>
              
              <div className="space-y-5 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tudo do Semestral, mais:</p>
                {[
                  'Site Personalizado Grátis',
                  'Consultoria de Marketing',
                  '2 meses grátis (vs mensal)'
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="bg-gray-100 p-1 rounded-full flex-shrink-0 mt-0.5 group-hover:bg-neutral-100 group-hover:text-neutral-700 transition-colors">
                      <Check className="h-3 w-3" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-24 flex flex-col items-center justify-center gap-8">
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-yellow-100 rounded-full text-yellow-600">
                    <Zap className="h-3 w-3 fill-current" />
                  </div>
                  <span>Ativação imediata</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded-full text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Cancele quando quiser</span>
            </div>
            
            {/* Payment Icons */}
            <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Simple SVG Representations of card brands */}
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">VISA</div>
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">MASTER</div>
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">PIX</div>
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">AMEX</div>
            </div>
        </div>

      </div>
    </section>
  );
}
