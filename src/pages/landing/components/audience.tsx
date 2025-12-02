import { Scissors, UserCircle } from "lucide-react";
import { useState } from "react";

export function Audience() {
  const [activeTab, setActiveTab] = useState<"barber" | "client">("barber");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Feito para os dois lados do balcão
          </h2>
          <p className="text-gray-600">
            Melhore a vida do profissional e a experiência do cliente.
          </p>
        </div>

        {/* Custom Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setActiveTab("barber")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "barber"
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Scissors className="h-4 w-4" />
              Para Barbeiros
            </button>
            <button
              onClick={() => setActiveTab("client")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "client"
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserCircle className="h-4 w-4" />
              Para Clientes
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {activeTab === "barber" ? (
            <>
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-900">
                  Controle total do seu negócio
                </h3>
                <p className="text-gray-600">
                  Foque no que você faz de melhor: cortar cabelo. Deixe a parte
                  chata de agendamentos com a gente.
                </p>
                <ul className="space-y-4">
                  {[
                    "Agenda 100% organizada",
                    "Menos no-show com cobrança antecipada",
                    "Histórico completo de cada cliente",
                    "Mais profissionalismo para sua marca",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700 font-medium"
                    >
                      <div className="h-6 w-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 text-xs">
                        ✓
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <img
                  src="https://picsum.photos/id/453/800/600"
                  alt="Barber Working"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white font-bold text-lg">
                    "Minha rotina mudou da água para o vinho."
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-900">
                  Zero fila, zero estresse
                </h3>
                <p className="text-gray-600">
                  Para seu cliente, a melhor experiência possível. Agendamento
                  rápido sem precisar ligar ou mandar zap.
                </p>
                <ul className="space-y-4">
                  {[
                    "Zero tempo de espera na barbearia",
                    "Reagendamento rápido pelo celular",
                    "Lembretes para não esquecer",
                    "Pagamento fácil e seguro",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700 font-medium"
                    >
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs">
                        ✓
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <img
                  src="https://picsum.photos/id/804/800/600"
                  alt="Happy Client"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white font-bold text-lg">
                    "Consigo marcar meu corte no intervalo do trabalho."
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
