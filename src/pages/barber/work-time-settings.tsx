"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createBreak,
  deleteBreak,
  fetchBreaks,
  fetchWorkingHours,
  upsertWorkingHours,
} from "@/lib/barber-working-time";
import { supabase } from "@/lib/supabase-client";
import { Clock, Coffee, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

interface WorkingHour {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

interface BreakTime {
  id?: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

const daysOfWeek = [
  { name: "Domingo", short: "DOM" },
  { name: "Segunda-feira", short: "SEG" },
  { name: "Terça-feira", short: "TER" },
  { name: "Quarta-feira", short: "QUA" },
  { name: "Quinta-feira", short: "QUI" },
  { name: "Sexta-feira", short: "SEX" },
  { name: "Sábado", short: "SAB" },
];

export default function WorkingHoursPage() {
  const [barberId, setBarberId] = useState<string | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [breaks, setBreaks] = useState<BreakTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Carrega dados do barbeiro e horários
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Usuário não autenticado:", userError);
          setLoading(false);
          return;
        }

        const { data: barber, error: barberError } = await supabase
          .from("barbers")
          .select(
            `
             *
            `
          )
          .eq("profile_id", user.id)
          .single();
        if (barberError || !barber) {
          console.error("Barbeiro não encontrado:", barberError);
          setLoading(false);
          return;
        }

        setBarberId(barber.id);
        console.log(barber);

        const [wh, br] = await Promise.all([
          fetchWorkingHours(barber.id),
          fetchBreaks(barber.id),
        ]);

        // CORREÇÃO: Inicializa todos os dias da semana com base nos dados do banco
        const initializedHours = daysOfWeek.map((_, index) => {
          const existing = wh.find((item) => item.day_of_week === index);
          // Se existe horário cadastrado para este dia, marca como ativo
          if (existing) {
            return {
              ...existing,
              is_active: true, // CORREÇÃO: Dias com horários no banco ficam ativos
            };
          } else {
            return {
              day_of_week: index,
              start_time: "09:00",
              end_time: "17:00",
              is_active: false, // Dias sem horários no banco ficam inativos
            };
          }
        });

        setWorkingHours(initializedHours);

        // CORREÇÃO: Formata os breaks para o formato datetime-local
        const formattedBreaks = br.map((breakItem) => ({
          ...breakItem,
          start_time: breakItem.start_time.slice(0, 16), // Converte para "YYYY-MM-DDTHH:mm"
          end_time: breakItem.end_time.slice(0, 16),
        }));

        setBreaks(formattedBreaks);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleDayActive = (index: number) => {
    setWorkingHours((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, is_active: !item.is_active } : item
      )
    );
  };

  // 🔹 Adicionar novo intervalo
  const handleAddBreak = () => {
    // CORREÇÃO: Usa data atual formatada corretamente
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    setBreaks([
      ...breaks,
      {
        start_time: `${today}T12:00`,
        end_time: `${today}T13:00`,
        reason: "Almoço",
      },
    ]);
  };

  // 🔹 Remover intervalo
  const handleRemoveBreak = async (index: number, breakId?: string) => {
    if (breakId) {
      try {
        await deleteBreak(breakId);
        setBreaks((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Erro ao remover intervalo:", error);
      }
    } else {
      setBreaks((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 🔹 Salvar no Supabase
  const handleSave = async () => {
    if (!barberId) {
      console.error("Barbeiro não identificado");
      return;
    }

    setSaving(true);
    try {
      // Filtrar apenas dias ativos
      const activeHours = workingHours.filter((wh) => wh.is_active);

      await Promise.all([
        upsertWorkingHours(barberId, activeHours),
        createBreak(barberId, breaks),
      ]);

      console.log("Horários salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar horários:", err);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Formatar hora para exibição
  const formatTime = (time: string) => {
    // CORREÇÃO: Lida com diferentes formatos de tempo
    if (time.includes("T")) {
      // Se for formato ISO (YYYY-MM-DDTHH:mm), extrai apenas a hora
      return time.slice(11, 16);
    }
    // Se já for formato HH:mm, retorna como está
    return time.length >= 5 ? time.slice(0, 5) : time;
  };

  // 🔹 Formatar badge para mostrar horário ativo
  const getBadgeContent = (wh: WorkingHour) => {
    if (!wh.is_active) {
      return "Fechado";
    }

    const startTime = formatTime(wh.start_time);
    const endTime = formatTime(wh.end_time);

    return `${startTime} - ${endTime}`;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container max-w-4xl mx-auto pb-20 px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Horários de Trabalho
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure seus horários de atendimento e intervalos
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      {/* Horários de Trabalho */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5" />
            Horários de Trabalho Semanais
          </CardTitle>
          <CardDescription>
            {`Dias ativos: ${
              workingHours.filter((wh) => wh.is_active).length
            } de 7`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workingHours.map((wh, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border transition-colors bg-muted/30 border-muted`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Switch
                  checked={wh.is_active}
                  onCheckedChange={() => toggleDayActive(index)}
                />
                <div className="min-w-[120px]">
                  <Label
                    className={`font-medium ${
                      wh.is_active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {daysOfWeek[wh.day_of_week].name}
                  </Label>
                  <div className="text-sm text-muted-foreground sm:hidden">
                    {daysOfWeek[wh.day_of_week].short}
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity ${
                  !wh.is_active && "opacity-50"
                }`}
              >
                <div className="space-y-2">
                  <Label htmlFor={`start-${index}`} className="text-sm">
                    Horário de início
                  </Label>
                  <Input
                    id={`start-${index}`}
                    type="time"
                    value={formatTime(wh.start_time)}
                    onChange={(e) =>
                      setWorkingHours((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? { ...item, start_time: e.target.value }
                            : item
                        )
                      )
                    }
                    disabled={!wh.is_active}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`end-${index}`} className="text-sm">
                    Horário de término
                  </Label>
                  <Input
                    id={`end-${index}`}
                    type="time"
                    value={formatTime(wh.end_time)}
                    onChange={(e) =>
                      setWorkingHours((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? { ...item, end_time: e.target.value }
                            : item
                        )
                      )
                    }
                    disabled={!wh.is_active}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <Badge
                  variant={wh.is_active ? "default" : "secondary"}
                  className={`w-full sm:w-auto justify-center ${
                    wh.is_active
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-100 dark:bg-neutral-100 dark:text-neutral-800"
                      : ""
                  }`}
                >
                  {getBadgeContent(wh)}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Intervalos */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Coffee className="w-5 h-5" />
            Intervalos e Pausas
          </CardTitle>
          <CardDescription>
            Adicione intervalos específicos onde você não estará disponível
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {breaks.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Coffee className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum intervalo cadastrado
              </p>
              <Button onClick={handleAddBreak} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Intervalo
              </Button>
            </div>
          ) : (
            <>
              {breaks.map((b, index) => (
                <div
                  key={b.id || index}
                  className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`break-start-${index}`}
                        className="text-sm"
                      >
                        Data e Hora de Início
                      </Label>
                      <Input
                        id={`break-start-${index}`}
                        type="datetime-local"
                        value={b.start_time}
                        onChange={(e) =>
                          setBreaks((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, start_time: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`break-end-${index}`} className="text-sm">
                        Data e Hora de Término
                      </Label>
                      <Input
                        id={`break-end-${index}`}
                        type="datetime-local"
                        value={b.end_time}
                        onChange={(e) =>
                          setBreaks((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, end_time: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <Label
                        htmlFor={`break-reason-${index}`}
                        className="text-sm"
                      >
                        Motivo do Intervalo
                      </Label>
                      <Input
                        id={`break-reason-${index}`}
                        type="text"
                        value={b.reason}
                        placeholder="Ex: Almoço, Reunião, Folga..."
                        onChange={(e) =>
                          setBreaks((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, reason: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveBreak(index, b.id)}
                    className="lg:self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                onClick={handleAddBreak}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Intervalo
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button Mobile
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t lg:hidden">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="w-full gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div> */}
    </div>
  );
}
