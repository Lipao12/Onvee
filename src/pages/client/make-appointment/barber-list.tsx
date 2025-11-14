import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useBarberShop } from "@/context/barber-shop-provider";
import { ChevronRight, Shuffle, User } from "lucide-react";

/*const barbers = [
  {
    id: "1",
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJk_vJkOsA7oxBUHM4Gn0okFypUTEw3gFpvAfMC-MZ8gsKQWpMhhPGM3SNxJ5JTzX8nJCI3B6GHrkWkRQHa2jo2Ei1Lti5r4x4i5h1v4YtOSDBS5ZA9t7EAOnViLEhvbBePjJTSmauWr3XmCZXBiKBjD7P2Bzf1sOIQu77hW_QvaVP2SYuu4ZM-ttwZKSvUgUHY7vM9Z7NYc_ysLdqRDlQiMQp-QGx0U3-GW81THY4CnY_FPZlZj6uurcjiJuSryP_c_UdUeL9Bo-d",
    name: "João",
  },
  {
    id: "2",
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmsYQG38aCYdEozuAckUq6D_ExdFSg0PWsMZH7bBQNAzUvroxgO3VC-7-Awfq49nKroFAeZFjJJf7lZniTO2jbH63JrvoIj8axStwWpGMw8oOIilPxRH5xrVowtFOCZw4ijUmW6DFfRUSg_NI1eu80fPnfZ3R-OlMqcWSFcPxn5q5jcKWYr8s73wOr_r_H7afh9l8YOP9IEkv9RsDJTyY6Nq9-erqaH8jYsiNRF2tEmJyTclP9l-fA9ffW2hV0gAK5UJHFUXunVjhU",
    name: "Fernando",
  },
  {
    id: "3",
    imageURL:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFKdjjmHu_Bq7_pB35CIk5wNBo4L3esEp4h6VbjpVydWuJXRb3UhyDMNQ-ohmpglWU4Vrq2huMvoT-QMk7Hki9W6c-ot7Cczkrk-L3c98XoM6lPolpfxaqRVHfptne-fXuvh0dM2844BIHnfTiUMg3SyfkKVXhqUDo1pYJ9BF_v4Z-L_cn1qtIiu3kXuF5JnC0zxiaWm-LGZr6SvKuG189T_bo7CWcnvrJPeE6trz7i_VWjXqOy-3RWeYtR2ZU3Bkn6VZN-K8SUl-5",
    name: "José",
  },
];*/

export default function BarbersList({
  onNext,
}: {
  onNext: (selectedBarber: any) => void;
  onBack: () => void;
}) {
  const { barbers } = useBarberShop();

  return (
    <main className="pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            onClick={() => {
              const random =
                barbers[Math.floor(Math.random() * barbers.length)];
              onNext(random);
            }}
            className="cursor-pointer overflow-hidden bg-zinc-800 flex flex-col transition hover:shadow-lg"
          >
            <div className="relative w-full h-32 flex items-center justify-center bg-linear-to-br from-zinc-700 to-zinc-900">
              <Shuffle className="w-12 h-12 text-white opacity-70" />
            </div>

            <CardContent className="flex flex-col py-4 px-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold leading-tight text-white">
                    Qualquer Profissional
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    Sistema seleciona um barbeiro para você
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
              </div>
            </CardContent>
          </Card>
          {barbers.map((barber, index) => {
            return (
              <Card
                onClick={() => onNext(barber)}
                key={index}
                className="cursor-pointer overflow-hidden bg-zinc-800 flex flex-col transition hover:shadow-lg"
              >
                <div className="relative w-full h-32 overflow-hidden">
                  {barber.image_url ? (
                    <img
                      src={barber.image_url}
                      alt={barber.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-linear-to-br  from-[#FFF]  to-transparent 
                      dark:from-[#2b2b2b] dark:via-[#4a3c2b] dark:to-[#d7bfa6]"
                    >
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                <CardContent className="flex flex-col py-4 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold leading-tight text-white">
                        {barber.full_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        {barber.bio || "Sem biografia disponível"}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                  </div>

                  {/*description && (
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
                  )*/}
                </CardContent>
              </Card>
              /*<Card
                key={barber.id}
                onClick={() => onNext(barber)}
                className="flex flex-row items-center cursor-pointer dark:bg-neutral-900 bg-neutral-100 
                transition-colors shadow-sm overflow-hidden"
              >
                {/* Imagem ou fallback 
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  {barber.image_url ? (
                    <img
                      src={barber.image_url}
                      alt={barber.full_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="text-zinc-500 w-8 h-8" />
                  )}
                </div>

                <CardContent className="flex flex-1 flex-col py-3 px-4 justify-center">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold ">
                      {barber.full_name}
                    </CardTitle>
                    <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>

                  {barber.bio && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {barber.bio}
                    </p>
                  )}
                </CardContent>
              </Card>*/
            );
          })}
        </div>
      </div>
    </main>
  );
}
