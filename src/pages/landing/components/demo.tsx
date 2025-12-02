import { Button } from "@/components/ui/button";

export function Demo() {
  return (
    <section
      id="demo"
      className="py-24 bg-neutral-900 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
              <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white text-gray-900">
                {/* Fake App UI - Booking Flow */}
                <div className="flex flex-col h-full">
                  <div className="bg-neutral-900 p-6 pt-12 text-white">
                    <h4 className="font-bold text-lg">Barbearia Elite</h4>
                    <p className="text-xs text-gray-300">
                      Selecione um serviço
                    </p>
                  </div>
                  <div className="p-4 space-y-4 flex-1 bg-gray-50">
                    {[
                      {
                        name: "Corte de Cabelo",
                        price: "R$ 45,00",
                        time: "30 min",
                      },
                      {
                        name: "Barba Completa",
                        price: "R$ 35,00",
                        time: "25 min",
                      },
                      {
                        name: "Combo (Corte + Barba)",
                        price: "R$ 70,00",
                        time: "50 min",
                      },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${i === 2 ? "border-neutral-900 bg-neutral-50" : "border-gray-200 bg-white shadow-sm"}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold">{s.name}</span>
                          <span className="font-semibold">{s.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{s.time}</span>
                          {i === 2 && (
                            <div className="h-4 w-4 rounded-full bg-neutral-900 flex items-center justify-center">
                              <div className="h-2 w-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white border-t border-gray-100">
                    <button className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-transform">
                      Agendar Horário
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              A experiência perfeita de agendamento
            </h2>
            <p className="text-neutral-200 text-lg mb-8 leading-relaxed">
              Veja como é fácil para o seu cliente agendar. Sem cadastro
              complicado, sem senhas esquecidas. Apenas 3 toques e o horário
              está garantido.
            </p>

            <div className="space-y-8">
              {[
                {
                  title: "Escolha",
                  desc: "Cliente escolhe o serviço e o barbeiro de preferência.",
                },
                {
                  title: "Confirmação",
                  desc: "Barbeiro recebe notificação instantânea e aceita.",
                },
                {
                  title: "Lembrete",
                  desc: "O sistema envia lembretes automáticos para garantir a presença.",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-white flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                    <p className="text-neutral-300">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button variant="secondary" size="lg">
                Criar conta grátis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
