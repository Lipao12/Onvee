// pages/onboarding/OnboardingWizard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/onboarding-provider";
import { ChevronLeft } from "lucide-react";
import Step1Profile from "./step1-profile";
import Step2BarberInfo from "./step2-barbershop-info";
import Step3Services from "./step3-services";
import Step4Availability from "./step4-workhour";
import Step5Success from "./step5-sucess";

export default function OnboardingWizard() {
  const { currentStep, prevStep } = useOnboarding();

  const getProgressPercentage = () => {
    return (currentStep / 5) * 100;
  };
  // bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden">
        {/* Header com progresso */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStep}
                className="text-gray-500 hover:text-gray-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-primary">
                {currentStep === 1 && "Bem-vindo!"}
                {currentStep === 2 && "Sua Barbearia"}
                {currentStep === 3 && "Especialidades"}
                {currentStep === 4 && "Disponibilidade"}
                {currentStep === 5 && "Tudo Pronto!"}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Passo {currentStep} de 5
              </p>
            </div>
            {currentStep > 1 && <div className="w-9" />}{" "}
            {/* Spacer para alinhamento */}
          </div>

          {/* Barra de progresso */}
          <div className="w-full bg-[#f5f5f5] dark:bg-[#737373] rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Conteúdo das etapas */}
        <div className="px-6 pb-8">
          {currentStep === 1 && <Step1Profile />}
          {currentStep === 2 && <Step2BarberInfo />}
          {currentStep === 3 && <Step3Services />}
          {currentStep === 4 && <Step4Availability />}
          {currentStep === 5 && <Step5Success />}
        </div>
      </div>
    </div>
  );
}
