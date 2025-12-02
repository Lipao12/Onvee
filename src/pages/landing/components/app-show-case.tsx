import {
  Calendar,
  ChevronRight,
  DollarSign,
  Menu,
  Monitor,
  Scissors,
  Shuffle,
  TrendingUp,
} from "lucide-react";
import React from "react";

export const AppShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-[#111111] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-brand-500 tracking-[0.2em] uppercase mb-4">
            APPS PERSONALIZADOS
          </h2>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 relative inline-block">
            Web, iOS e Android
            {/* Highlight underline */}
            <div className="absolute bottom-2 left-0 w-full h-3 z-[-1]">
              <div className="w-full h-full bg-brand-600/30 -skew-x-12 transform origin-left scale-x-105"></div>
            </div>
          </h3>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Tenha seu próprio aplicativo. Seus clientes agendam em segundos e
            você gerencia tudo na palma da mão.
          </p>

          {/* Platform Icons */}
          <div className="flex justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-default">
              <Monitor className="h-8 w-8" />
              <span className="text-xs font-medium">Web</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-default">
              {/* Apple Icon SVG */}
              <svg
                className="h-8 w-8 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.03 1.59-.67.79-1.25 1.95-1.1 3.09 1.17.09 2.36-.73 3.06-1.57" />
              </svg>
              <span className="text-xs font-medium">iOS</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-default">
              {/* Android Icon SVG */}
              <svg
                className="h-8 w-8 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4213 13.8533 8.0854 12 8.0854s-3.5902.3359-5.1367.9644L4.841 5.5467a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
              <span className="text-xs font-medium">Android</span>
            </div>
          </div>
        </div>

        {/* Mockups Display */}
        <div className="relative mt-2 flex justify-center">
          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-900/20 rounded-full blur-[100px]"></div>

          <div className="relative w-full max-w-5xl h-[400px] sm:h-[500px] md:h-[600px] flex justify-center items-end">
            {/* Desktop/Web Background Mockup - Abstract Dashboard */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[800px] h-[300px] md:h-[500px] bg-[#1a1a1a] rounded-t-3xl border-t-8 border-x-8 border-[#2a2a2a] shadow-2xl opacity-40 transform scale-95 translate-y-10 z-0 overflow-hidden">
              <div className="w-full h-8 bg-[#2a2a2a] flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 w-64 h-4 bg-[#3a3a3a] rounded-full opacity-50"></div>
              </div>
              <div className="p-8">
                <div className="w-full h-full bg-[#111] rounded-lg opacity-50 flex flex-col gap-4 p-4">
                  <div className="w-1/3 h-8 bg-[#333] rounded mb-8"></div>
                  <div className="flex gap-4">
                    <div className="w-1/3 h-40 bg-[#333] rounded-lg"></div>
                    <div className="w-1/3 h-40 bg-[#333] rounded-lg"></div>
                    <div className="w-1/3 h-40 bg-[#333] rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Phone - iOS Style - CLIENT APP (Select Barber) */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-[110%] md:-translate-x-[140%] z-10 transform rotate-[-12deg] hover:rotate-0 transition-transform duration-500">
              <div className="w-[160px] md:w-[240px] h-[320px] md:h-[480px] bg-black rounded-[2.5rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden relative">
                {/* Dynamic Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-[#1a1a1a] rounded-b-xl z-20"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white flex flex-col pt-10 px-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Escolha o Profissional
                  </h4>
                  <p className="text-xs text-gray-500 mb-6">
                    Quem vai cuidar do seu estilo hoje?
                  </p>

                  <div className="space-y-3">
                    {/* Random Barber Card */}
                    <div className="bg-gray-900 rounded-xl p-3 flex items-center gap-3 shadow-md">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shrink-0">
                        <Shuffle className="h-5 w-5 text-white/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">
                          Qualquer um
                        </p>
                        <p className="text-[10px] text-gray-400">
                          O primeiro disponível
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>

                    {/* Barber 1 */}
                    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                          alt="Barber"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          Carlos Silva
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Especialista em degradê
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>

                    {/* Barber 2 */}
                    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                          alt="Barber"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          Ana Souza
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Barba e corte clássico
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>

                    {/* Barber 3 */}
                    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jude"
                          alt="Barber"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          Marcos O.
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Cortes modernos
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Phone - Android Style - OWNER DASHBOARD */}
            <div className="absolute bottom-[-40px] left-1/2 translate-x-[10%] md:translate-x-[40%] z-20 transform rotate-[6deg] hover:rotate-0 transition-transform duration-500">
              <div className="w-[210px] md:w-[270px] h-[420px] md:h-[540px] bg-black rounded-[2.5rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden relative">
                {/* Camera Punch Hole */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-4 bg-black rounded-full z-20"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-gray-50 flex flex-col pt-12 px-4">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Minha Barbearia
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Segunda, 25 de Nov
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <Menu className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-gray-500 font-medium">
                          Faturamento
                        </span>
                        <DollarSign className="h-3 w-3 text-green-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        R$ 1.250
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-gray-500 font-medium">
                          Agendas
                        </span>
                        <Calendar className="h-3 w-3 text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">18</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-gray-500 font-medium">
                          Ticket Médio
                        </span>
                        <TrendingUp className="h-3 w-3 text-orange-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        R$ 69,50
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-gray-500 font-medium">
                          Top Serviço
                        </span>
                        <Scissors className="h-3 w-3 text-purple-600" />
                      </div>
                      <p className="text-xs font-bold text-gray-900 truncate">
                        Corte + Barba
                      </p>
                    </div>
                  </div>

                  {/* Barber Performance List */}
                  <h5 className="text-xs font-bold text-gray-900 mb-3">
                    Desempenho Hoje
                  </h5>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded-lg border border-gray-100 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        CS
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">
                          Carlos Silva
                        </p>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full w-[85%]"></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        85%
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-gray-100 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xs">
                        AS
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">
                          Ana Souza
                        </p>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full w-[70%]"></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        70%
                      </span>
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
};
