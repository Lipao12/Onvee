// pages/onboarding/steps/Step4Availability.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useOnboarding } from "@/context/onboarding-provider";
import { Clock } from "lucide-react";

const daysOfWeek = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const timeSlots = ["08:00-12:00", "13:00-18:00", "18:00-22:00"];

export default function Step4Availability() {
  const { data, setData, nextStep, prevStep } = useOnboarding();

  const toggleDay = (dayKey: string) => {
    const currentAvailability = data.availability[dayKey];
    const newAvailability = { ...data.availability };

    if (currentAvailability.length > 0) {
      // Desativar dia
      newAvailability[dayKey] = [];
    } else {
      // Ativar dia com horário padrão
      newAvailability[dayKey] = ["08:00-12:00", "13:00-18:00"];
    }

    setData({ availability: newAvailability });
  };

  const toggleTimeSlot = (dayKey: string, timeSlot: string) => {
    const currentSlots = data.availability[dayKey];
    const newSlots = currentSlots.includes(timeSlot)
      ? currentSlots.filter((slot) => slot !== timeSlot)
      : [...currentSlots, timeSlot];

    const newAvailability = {
      ...data.availability,
      [dayKey]: newSlots,
    };

    setData({ availability: newAvailability });
  };

  const getActiveDaysCount = () => {
    return Object.values(data.availability).filter((slots) => slots.length > 0)
      .length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Sua disponibilidade
        </h2>
        <p className="text-gray-600 mt-2">
          Quando você está disponível para atender?
        </p>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const isDayActive = data.availability[day.key].length > 0;

          return (
            <div key={day.key} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={day.key} className="font-medium text-base">
                  {day.label}
                </Label>
                <Switch
                  id={day.key}
                  checked={isDayActive}
                  onCheckedChange={() => toggleDay(day.key)}
                />
              </div>

              {isDayActive && (
                <div className="grid grid-cols-1 gap-2 ml-4">
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${day.key}-${timeSlot}`}
                        checked={data.availability[day.key].includes(timeSlot)}
                        onChange={() => toggleTimeSlot(day.key, timeSlot)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <Label
                        htmlFor={`${day.key}-${timeSlot}`}
                        className="text-sm cursor-pointer"
                      >
                        {timeSlot}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800 text-center">
            📅 {getActiveDaysCount()} dia(s) disponível(eis) por semana
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-12">
          Voltar
        </Button>
        <Button
          onClick={nextStep}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700"
        >
          Revisar
        </Button>
      </div>
    </div>
  );
}
