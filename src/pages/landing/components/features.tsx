import {
  Bell,
  Calendar,
  CreditCard,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import type { FeatureItem } from "../types/type";

const featuresList: FeatureItem[] = [
  {
    title: "Agenda Inteligente",
    description:
      "Organize horários e evite conflitos automaticamente. O sistema gerencia as lacunas para você.",
    icon: Calendar,
  },
  {
    title: "Lembretes Automáticos",
    description:
      "Reduza faltas em até 40% com notificações enviadas ao cliente via WhatsApp e SMS.",
    icon: Bell,
  },
  {
    title: "Perfil do Barbeiro",
    description:
      "Mostre seu portfólio, lista de serviços atualizada e seus melhores cortes para atrair clientes.",
    icon: User,
  },
  {
    title: "Pagamentos Integrados",
    description:
      "Receba online para diminuir o no-show e garantir o compromisso financeiro do cliente.",
    icon: CreditCard,
  },
];

const advancedFeatures: FeatureItem[] = [
  {
    title: "Dashboard Diário",
    description: "Visão clara do seu faturamento e agendamentos do dia.",
    icon: TrendingUp,
  },
  {
    title: "Gestão do Time",
    description: "Controle a agenda de múltiplos barbeiros em uma única conta.",
    icon: Users,
  },
  {
    title: "Cadastro de Clientes",
    description: "Histórico completo de cortes e preferências de cada cliente.",
    icon: ShieldCheck,
  },
  {
    title: "App para o Cliente",
    description: "Experiência nativa para seu cliente agendar em segundos.",
    icon: Smartphone,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Value Props */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-neutral-600 font-semibold tracking-wide uppercase mb-2">
            Por que usar o BarberBook?
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
            Gerencie sua barbearia com maestria
          </p>
          <p className="text-lg text-gray-600">
            Ferramentas pensadas para quem vive a rotina da barbearia. Simples,
            direto e eficiente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="text-neutral-200 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary Advanced Features List */}
        <div className="bg-neutral-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-neutral-700 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-neutral-700 rounded-full opacity-20"></div>

          <div className="relative z-10">
            <div className="mb-12 border-b border-neutral-700 pb-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Funcionalidades para quem quer crescer
              </h3>
              <p className="text-neutral-200 max-w-2xl">
                Não é apenas uma agenda. É um sistema completo de gestão para
                levar sua barbearia ao próximo nível.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {advancedFeatures.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 mb-1">
                    <item.icon className="h-5 w-5 text-neutral-300" />
                    <h4 className="font-bold text-lg">{item.title}</h4>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
