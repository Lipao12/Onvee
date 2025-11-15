import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useBarberShop } from "@/context/barber-shop-provider";
import { ChevronRight, Scissors } from "lucide-react";
import { useState } from "react";

/*const services_teste = [
  {
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGWgf1qLuUpgOEV7_XDnclIEgs1rhnYFa-n-b04dVpIgCSq9hGSoYgVkVzbvMTnnt_k-ayxyQDYRZkC2cQZaI1RY9MkMXqPx8IheIpuzLCFWM0bkDoIRvzsCm7ILvw-GjZaLpdN9bY1-cFTsM3IHPaZ3IBsdYQwOfjFcCs2ql9SiBDnvbKc39zZMRxHCWS8f4scOutBJx9r8BXxoZHIsp8oaIq7Ahdy1GkLcrdFEk1AcYsv6NPor2vkQA4XohM3wKRf0KuWlNFCsKS",
    name: "Corte de Cabelo",
    timeUsed: 30,
    price: 40,
    description:
      "Corte clássico ou moderno, ajustado ao seu estilo e formato de rosto. Inclui finalização com produto de alta qualidade.",
  },
  {
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxX0nnAmskKJLEnr3RDq9Jrfh-8Vo9KPstO9cSQV9Tv0gAo81-ANOhwxnwg41dL2-3tMXGhKPLaLlLugFIz7C5gPKyQ_ofPVnpf5E4d2xH1nfourB_HUdPxC5wBke0-274YUPmIplRJTA3MSNLZJ-ngokC2hasGIP2YIwXoO0jEC8VfCwrjMGJ1yAzuK-f1W9BXUK9SrwLZinTslcS9bM8BYik7NKmnF_T625bxlEu3t38w6vuOfIguVRmPzWZqVSEkuY3YbgcKujt",
    name: "Barba Completa",
    timeUsed: 20,
    price: 20,
    description:
      "Aparar, desenhar e hidratar a barba, com toalha quente e produtos premium.",
  },
  {
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDooXxTbjWalfkq_VC7IUflfpQPzlr87hV5IL_yqhlSEiBUh3oIy-cliirOWkqkG8OH0UKfttuT_JuoM7BUp2eI-vji-5yXhnqHPYsYZsFPUJvhRNUHqOJaDYY_5-6prnhzLAbRGLXh4-QIKrAy6bWEjsrgMVLDpdfggVNR124obj_aNCvsDMl4A7epOD3On8crhHTmLd7pxstRHWlaOGBq6Avq9UXjh7OX5QIfsee3b0_Gwjw9pFAiD5nUHfwDqYaZhmyGsA0-kZm0",
    name: "Cabelo + Barba",
    timeUsed: 50,
    price: 40,
  },
];*/

export default function ServicesList({
  onNext,
}: {
  onNext: (selectedService: any) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const { services } = useBarberShop();

  return (
    <main className="pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const isExpanded = expanded === index;
            const maxLength = 80;
            const description =
              service.description &&
              service.description.length > maxLength &&
              !isExpanded
                ? service.description.slice(0, maxLength) + "..."
                : service.description;

            return (
              <Card
                onClick={() => onNext(service)}
                key={index}
                className="cursor-pointer overflow-hidden bg-zinc-800 flex flex-col transition hover:shadow-lg"
              >
                <div className="relative w-full h-32 overflow-hidden">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-linear-to-br  from-[#1B263B] via-[#415A77] to-[#F8F9FA] 
                      dark:from-[#2b2b2b] dark:via-[#4a3c2b] dark:to-[#d7bfa6]"
                    >
                      <Scissors className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                <CardContent className="flex flex-col py-4 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold leading-tight text-white">
                        {service.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        {service.duration_minutes} min {" • "}R$
                        {service.price.toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                  </div>

                  {description && (
                    <p className="text-gray-300 text-sm mt-3 leading-snug">
                      {description}
                      {service.description &&
                        service.description.length > maxLength && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpanded(isExpanded ? null : index);
                            }}
                            className="text-blue-400 ml-1 hover:underline"
                          >
                            {isExpanded ? "ver menos" : "ver mais"}
                          </button>
                        )}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
