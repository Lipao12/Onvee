// pages/onboarding/steps/Step3Services.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/onboarding-provider";
import { Scissors } from "lucide-react";

const availableSkills = [
  "Corte social",
  "Degradê",
  "Fade",
  "Navalhado",
  "Máquina",
  "Barba completa",
  "Barba modelada",
  "Sobrancelha",
  "Pigmentação",
  "Relaxamento",
  "Coloração",
  "Luzes",
  "Corte infantil",
  "Corte militar",
  "Pézinho",
  "Acabamento",
  "Hidratação",
  "Selagem",
];

export default function Step3Services() {
  const { data, setData, nextStep, prevStep } = useOnboarding();

  const toggleSkill = (skill: string) => {
    const newSkills = data.skills.includes(skill)
      ? data.skills.filter((s) => s !== skill)
      : [...data.skills, skill];

    setData({ skills: newSkills });
  };

  const canProceed = data.skills.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scissors className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Suas especialidades
        </h2>
        <p className="text-gray-600 mt-2">Quais serviços você oferece?</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {availableSkills.map((skill) => (
            <Badge
              key={skill}
              variant={data.skills.includes(skill) ? "default" : "outline"}
              className={`
                cursor-pointer py-2 px-3 text-sm font-medium transition-all
                ${
                  data.skills.includes(skill)
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                }
              `}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>

        {data.skills.length > 0 && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 text-center">
              ✅ {data.skills.length} serviço(s) selecionado(s)
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-12">
          Voltar
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
