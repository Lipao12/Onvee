import { Star } from "lucide-react";
import type { Testimonial } from "../types/type";

const testimonialsList: Testimonial[] = [
  {
    quote:
      "Reduzi as faltas em 40% com os lembretes automáticos. O sistema se pagou na primeira semana.",
    author: "Carlos Silva",
    role: "Proprietário",
    company: "Barbearia Urban Cut",
  },
  {
    quote:
      "Meu fluxo de clientes aumentou muito depois que passei a usar o agendamento online. Eles adoram a praticidade.",
    author: "José Almeida",
    role: "Master Barber",
    company: "Barbearia do Zé",
  },
  {
    quote:
      "Simplesmente o melhor app de gestão que já usei. O suporte é incrível e o app nunca trava.",
    author: "Ricardo Mendes",
    role: "Gerente",
    company: "The Gentleman's Club",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-white border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Aprovado por quem entende de corte
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Junte-se a centenas de barbearias que modernizaram seu atendimento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsList.map((t, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-2xl relative">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, starI) => (
                  <Star
                    key={starI}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-gray-800 font-medium text-lg mb-6 relative z-10">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold text-xl">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-600">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos Strip */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
            Parceiros de Confiança
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            {/* Simulated Logos using text for demo */}
            <span className="text-2xl font-black font-serif">URBAN CUT</span>
            <span className="text-2xl font-bold italic">BarberKing</span>
            <span className="text-2xl font-extrabold tracking-widest">
              RAZOR SHARP
            </span>
            <span className="text-2xl font-serif">The Gentlemen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
