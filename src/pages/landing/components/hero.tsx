import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Play } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-50 text-neutral-900 text-sm font-semibold mb-6 border border-neutral-100">
              <span className="flex h-2 w-2 rounded-full bg-neutral-900 mr-2"></span>
              Novo jeito de agendar
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6">
              Agendamentos sem erro.{" "}
              <span className="text-neutral-500">Clientes sem espera.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Um app simples e rápido para barbearias organizarem sua agenda,
              evitarem no-show e aumentarem a recorrência do negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button size="lg" className="group">
                Começar gratuitamente
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary" className="group">
                <Play className="mr-2 h-5 w-5 text-neutral-900" />
                Ver demonstração
              </Button>
            </div>

            <div className="space-y-3 max-w-md mx-auto lg:mx-0 text-left">
              {[
                "Clientes marcam sozinhos: menos ligações.",
                "Tudo em um só lugar: agenda e finanças.",
                "Suporte direto pelo WhatsApp.",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center text-gray-600">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Content - Phone/Dashboard Mockup */}
          <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-neutral-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

            <div className="relative mx-auto w-full max-w-[400px] lg:max-w-full">
              {/* Mockup Container */}
              <div className="relative rounded-3xl bg-gray-900 p-2 sm:p-4 shadow-2xl ring-1 ring-gray-900/10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                <div className="relative rounded-2xl overflow-hidden bg-white aspect-[9/16] sm:aspect-[4/5] lg:aspect-square">
                  {/* Simulated App Interface */}
                  <img
                    src="https://picsum.photos/800/1000?grayscale"
                    alt="App Interface"
                    className="object-cover w-full h-full opacity-90"
                  />

                  {/* Floating Card 1 */}
                  <div className="absolute top-1/4 -left-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-64 hidden sm:block animate-[bounce_3s_infinite]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Agendamento Confirmado
                        </p>
                        <p className="font-bold text-gray-900">Corte + Barba</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 2 */}
                  <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-64 hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        JD
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">João D.</p>
                        <p className="text-xs text-green-600 font-semibold">
                          Cliente Recorrente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
