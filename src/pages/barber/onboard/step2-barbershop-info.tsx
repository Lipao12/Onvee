// pages/onboarding/steps/Step2BarberInfo.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOnboarding } from "@/context/onboarding-provider";
import { supabase } from "@/lib/supabase-client";
import { Store } from "lucide-react";
import { useEffect, useState } from "react";

interface Barbershop {
  id: string;
  name: string;
  address: string;
}

export default function Step2BarberInfo() {
  const { data, setData, nextStep, prevStep } = useOnboarding();
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionType, setSelectionType] = useState<
    "existing" | "new" | "none"
  >("existing");

  useEffect(() => {
    fetchBarbershops();
  }, []);

  const fetchBarbershops = async () => {
    try {
      const { data: shops, error } = await supabase
        .from("barbershops")
        .select("id, name, address")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setBarbershops(shops || []);
    } catch (error) {
      console.error("Erro ao buscar barbearias:", error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed =
    selectionType === "existing"
      ? !!data.barbershop_id
      : selectionType === "new" || selectionType === "none";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sua barbearia</h2>
        <p className="text-gray-600 mt-2">
          Onde você vai atender seus clientes?
        </p>
      </div>

      <div className="space-y-6">
        <RadioGroup
          value={selectionType}
          onValueChange={(value: any) => setSelectionType(value)}
        >
          {/* Barbearia existente */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="font-medium">
                Trabalho em uma barbearia existente
              </Label>
            </div>

            {selectionType === "existing" && (
              <div className="ml-6 space-y-2">
                {loading ? (
                  <div className="text-sm text-gray-500">
                    Carregando barbearias...
                  </div>
                ) : barbershops.length > 0 ? (
                  <select
                    value={data.barbershop_id || ""}
                    onChange={(e) => setData({ barbershop_id: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma barbearia</option>
                    {barbershops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name} - {shop.address}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-500">
                    Nenhuma barbearia cadastrada no momento
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Criar nova barbearia */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new" className="font-medium">
              Sou dono e vou criar minha barbearia
            </Label>
          </div>

          {/* Ainda não tenho barbearia */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="font-medium">
              Ainda não tenho uma barbearia fixa
            </Label>
          </div>
        </RadioGroup>

        {selectionType === "new" && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              🎉 Perfeito! Após completar seu cadastro, você poderá criar sua
              barbearia diretamente no dashboard.
            </p>
          </div>
        )}

        {selectionType === "none" && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              💡 Sem problemas! Você pode começar a atender como barbeiro
              autônomo e posteriormente vincular-se a uma barbearia.
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
          className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
