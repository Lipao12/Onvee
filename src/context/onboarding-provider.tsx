import { supabase } from "@/lib/supabase-client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-provider";

interface OnboardingData {
  // Step 1: Profile
  full_name: string;
  image_url: string;

  // Step 2: Barber Info
  barbershop_id?: string | null;
  bio?: string;
  phone?: string;

  // Step 3: Skills
  skills: string[];

  // Step 4: Availability
  availability: {
    [key: string]: string[];
  };
}

interface OnboardingContextType {
  currentStep: number;
  data: OnboardingData;
  setData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitOnboarding: () => Promise<void>;
  isSubmitting: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  console.log("usuario: ", user);

  const [data, setData] = useState<OnboardingData>({
    full_name: "",
    image_url: "",
    barbershop_id: null,
    bio: "",
    phone: "",
    skills: [],
    availability: {
      monday: ["08:00-12:00", "13:00-18:00"],
      tuesday: ["08:00-12:00", "13:00-18:00"],
      wednesday: ["08:00-12:00", "13:00-18:00"],
      thursday: ["08:00-12:00", "13:00-18:00"],
      friday: ["08:00-12:00", "13:00-18:00"],
      saturday: ["08:00-12:00", "13:00-17:00"],
      sunday: [],
    },
  });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const submitOnboarding = async () => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: data.full_name,
          image_url: data.image_url,
          app_role: "barber",
          phone: data.phone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Step 2: Create barber record
      const { error: barberError } = await supabase.from("barbers").insert({
        profile_id: user.id,
        barbershop_id: data.barbershop_id,
        bio: data.bio,
        //skills: data.skills,
        rating: 5.0, // Default rating
        is_active: true,
      });
      if (barberError) throw barberError;
      console.log("fdhsjkl");

      toast.success("Perfil criado com sucesso!");

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/barber/dashboard";
      }, 1500);
    } catch (error: any) {
      console.error("Erro no onboarding:", error);
      toast.error(error.message || "Erro ao criar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        data,
        setData: updateData,
        nextStep,
        prevStep,
        submitOnboarding,
        isSubmitting,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
