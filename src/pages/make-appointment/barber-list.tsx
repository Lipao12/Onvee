import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const barbers = [
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
];

export default function BarbersList({
  onNext,
  onBack,
}: {
  onNext: (selectedBarber: any) => void;
  onBack: () => void;
}) {
  return (
    <main className="pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber, index) => {
            return (
              <Card
                key={index}
                className="overflow-hidden bg-zinc-300 flex flex-row cursor-pointer"
                onClick={() => onNext(barber)}
              >
                {" "}
                <div className="relative w-20 overflow-hidden shrink-0">
                  {" "}
                  <img
                    src={barber.imageURL}
                    alt={barber.name}
                    className="object-cover w-full h-full"
                  />{" "}
                </div>{" "}
                <CardContent className="flex-1 py-2 items-center flex">
                  {" "}
                  <div className="flex grow justify-between items-center">
                    {" "}
                    <div>
                      {" "}
                      <CardTitle className="text-lg font-semibold leading-tight">
                        {" "}
                        {barber.name}{" "}
                      </CardTitle>{" "}
                    </div>{" "}
                    <ChevronRight className="w-5 h-5 text-gray-500" />{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
