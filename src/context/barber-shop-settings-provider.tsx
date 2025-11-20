// hooks/use-barbershop-settings.ts
import { useBarberShop } from "@/context/barber-shop-provider";
import { useCallback } from "react";

export function useBarbershopSettings() {
  const { barbershop_config, updateBarbershopConfig } = useBarberShop();

  // Função para atualizar tema
  const updateTheme = useCallback(
    async (theme: string, mainColor?: string) => {
      await updateBarbershopConfig({
        theme,
        ...(mainColor && { main_color: mainColor }),
      });
    },
    [updateBarbershopConfig]
  );

  // Função para atualizar redes sociais
  const updateSocialMedia = useCallback(
    async (instagramUrl?: string, whatsappNumber?: string) => {
      await updateBarbershopConfig({
        instagram_user: instagramUrl,
        whatsapp_number: whatsappNumber,
      });
    },
    [updateBarbershopConfig]
  );

  // Função para atualizar configurações de agendamento
  const updateAppointmentSettings = useCallback(
    async (appointmentInterval: number) => {
      await updateBarbershopConfig({
        appointment_interval: appointmentInterval,
      });
    },
    [updateBarbershopConfig]
  );

  return {
    config: barbershop_config,
    updateTheme,
    updateSocialMedia,
    updateAppointmentSettings,
  };
}
