import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronRight, Clock, Tag } from "lucide-react";

const services = [
  {
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGWgf1qLuUpgOEV7_XDnclIEgs1rhnYFa-n-b04dVpIgCSq9hGSoYgVkVzbvMTnnt_k-ayxyQDYRZkC2cQZaI1RY9MkMXqPx8IheIpuzLCFWM0bkDoIRvzsCm7ILvw-GjZaLpdN9bY1-cFTsM3IHPaZ3IBsdYQwOfjFcCs2ql9SiBDnvbKc39zZMRxHCWS8f4scOutBJx9r8BXxoZHIsp8oaIq7Ahdy1GkLcrdFEk1AcYsv6NPor2vkQA4XohM3wKRf0KuWlNFCsKS",
    name: "Corte de Cabelo",
    timeUsed: 30,
    price: 40,
  },
  {
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxX0nnAmskKJLEnr3RDq9Jrfh-8Vo9KPstO9cSQV9Tv0gAo81-ANOhwxnwg41dL2-3tMXGhKPLaLlLugFIz7C5gPKyQ_ofPVnpf5E4d2xH1nfourB_HUdPxC5wBke0-274YUPmIplRJTA3MSNLZJ-ngokC2hasGIP2YIwXoO0jEC8VfCwrjMGJ1yAzuK-f1W9BXUK9SrwLZinTslcS9bM8BYik7NKmnF_T625bxlEu3t38w6vuOfIguVRmPzWZqVSEkuY3YbgcKujt",
    name: "Barba Completa",
    timeUsed: 20,
    price: 20,
  },
  {
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDooXxTbjWalfkq_VC7IUflfpQPzlr87hV5IL_yqhlSEiBUh3oIy-cliirOWkqkG8OH0UKfttuT_JuoM7BUp2eI-vji-5yXhnqHPYsYZsFPUJvhRNUHqOJaDYY_5-6prnhzLAbRGLXh4-QIKrAy6bWEjsrgMVLDpdfggVNR124obj_aNCvsDMl4A7epOD3On8crhHTmLd7pxstRHWlaOGBq6Avq9UXjh7OX5QIfsee3b0_Gwjw9pFAiD5nUHfwDqYaZhmyGsA0-kZm0",
    name: "Cabelo + Barba",
    timeUsed: 50,
    price: 40,
  },
];

export default function ServicesList() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Escolha o seu serviço
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-zinc-300 flex flex-row"
            >
              <div className="relative w-20 overflow-hidden shrink-0">
                <img
                  src={service.imageURL}
                  alt={service.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="flex-1 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {service.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      {service.timeUsed} min
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm ">
                      <Tag className="w-4 h-4" />
                      R$ {service.price.toFixed(2).replace(".", ",")}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
