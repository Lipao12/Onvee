// pages/onboarding/steps/Step5Success.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/onboarding-provider";
import { CheckCircle, Clock, Scissors, Store, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Step5Success() {
  const { data, submitOnboarding, isSubmitting } = useOnboarding();
  const navigate = useNavigate();

  const handleComplete = async () => {
    await submitOnboarding();
    navigate("/barber/dashboard");
  };

  const getActiveDaysCount = () => {
    return Object.values(data.availability).filter((slots) => slots.length > 0)
      .length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tudo pronto!</h2>
        <p className="text-gray-600 mt-2">
          Revise suas informações antes de finalizar
        </p>
      </div>

      {/* Resumo das informações */}
      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        {/* Perfil */}
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">{data.full_name}</p>
            {data.phone && (
              <p className="text-sm text-gray-600">{data.phone}</p>
            )}
          </div>
        </div>

        {/* Barbearia */}
        <div className="flex items-center space-x-3">
          <Store className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">
              {data.barbershop_id
                ? "Vinculado a barbearia"
                : "Barbeiro autônomo"}
            </p>
          </div>
        </div>

        {/* Serviços */}
        <div className="flex items-start space-x-3">
          <Scissors className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900 mb-1">
              {data.skills.length} especialidade(s)
            </p>
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {data.skills.length > 3 && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  +{data.skills.length - 3} mais
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">
              {getActiveDaysCount()} dia(s) por semana
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800 text-center">
          🎉 Perfeito! Sua cadeira está pronta. Clique abaixo para finalizar e
          começar a receber agendamentos.
        </p>
      </div>

      <Button
        onClick={handleComplete}
        disabled={isSubmitting}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Finalizando cadastro...</span>
          </div>
        ) : (
          "Finalizar Cadastro"
        )}
      </Button>
    </div>
  );
}
