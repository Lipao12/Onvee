import { supabase } from "./supabase-client";

export interface WorkingHour {
  id?: string;
  day_of_week: number; // 0 = domingo, 6 = sábado
  start_time: string; // formato "HH:mm"
  end_time: string; // formato "HH:mm"
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BreakTime {
  id?: string;
  start_time: string; // ISO string (timestamptz)
  end_time: string; // ISO string
  reason?: string;
  created_at?: string;
  updated_at?: string;
}

// 🔹 Buscar horários de trabalho
export async function fetchWorkingHours(
  barber_id: string,
): Promise<WorkingHour[]> {
  const { data, error } = await supabase
    .from("working_hours")
    .select("*")
    .eq("barber_id", barber_id)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("Erro ao buscar working_hours:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
}

// 🔹 Criar ou atualizar horários de trabalho (com tratamento de dias ativos/inativos)
export async function upsertWorkingHours(
  barber_id: string,
  workTimes: WorkingHour[],
): Promise<void> {
  if (workTimes.length === 0) return;

  try {
    // Primeiro, deleta todos os horários existentes para este barbeiro
    // para evitar conflitos com dias que foram desativados
    const { error: deleteError } = await supabase
      .from("working_hours")
      .delete()
      .eq("barber_id", barber_id);

    if (deleteError) throw deleteError;

    // Filtra apenas os dias ativos e prepara o payload
    const activeWorkTimes = workTimes.filter((wh) => wh.is_active);

    if (activeWorkTimes.length === 0) return;

    const payload = activeWorkTimes.map((w) => ({
      barber_id,
      day_of_week: w.day_of_week,
      start_time: w.start_time,
      end_time: w.end_time,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("working_hours")
      .insert(payload);

    if (insertError) {
      console.error("Erro ao salvar working_hours:", insertError.message);
      throw new Error(insertError.message);
    }
  } catch (error) {
    console.error("Erro ao salvar working_hours:", error);
    throw error;
  }
}

// 🔹 Deletar todos horários de um barbeiro
export async function deleteWorkingHours(barber_id: string): Promise<void> {
  const { error } = await supabase
    .from("working_hours")
    .delete()
    .eq("barber_id", barber_id);

  if (error) {
    console.error("Erro ao deletar working_hours:", error.message);
    throw new Error(error.message);
  }
}

/* ---------------------------------------------------------
 * Breaks
 * --------------------------------------------------------- */

// 🔹 Buscar intervalos de um barbeiro
export async function fetchBreaks(barber_id: string): Promise<BreakTime[]> {
  const { data, error } = await supabase
    .from("breaks")
    .select("*")
    .eq("barber_id", barber_id)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Erro ao buscar breaks:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
}

// 🔹 Criar múltiplos intervalos
export async function createBreak(
  barber_id: string,
  breaksData: BreakTime[],
): Promise<void> {
  if (breaksData.length === 0) return;

  try {
    // Primeiro, deleta todos os breaks existentes para evitar duplicações
    const { error: deleteError } = await supabase
      .from("breaks")
      .delete()
      .eq("barber_id", barber_id);

    if (deleteError) throw deleteError;

    // Prepara o payload para inserção
    const payload = breaksData.map((breakItem) => ({
      barber_id,
      start_time: convertToISOTimestamp(breakItem.start_time),
      end_time: convertToISOTimestamp(breakItem.end_time),
      reason: breakItem.reason || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("breaks")
      .insert(payload);

    if (insertError) {
      console.error("Erro ao criar breaks:", insertError.message);
      throw new Error(insertError.message);
    }
  } catch (error) {
    console.error("Erro ao criar breaks:", error);
    throw error;
  }
}

// 🔹 Deletar um intervalo
export async function deleteBreak(breakId: string): Promise<void> {
  const { error } = await supabase.from("breaks").delete().eq("id", breakId);

  if (error) {
    console.error("Erro ao deletar break:", error.message);
    throw new Error(error.message);
  }
}

// 🔹 Função auxiliar para converter datetime-local para ISO timestamp
function convertToISOTimestamp(datetimeString: string): string {
  // Se já estiver em formato ISO, retorna como está
  if (datetimeString.includes("T") && datetimeString.includes(":")) {
    return datetimeString;
  }

  // Se for apenas time (HH:mm), adiciona uma data padrão
  if (datetimeString.length === 5 && datetimeString.includes(":")) {
    const today = new Date().toISOString().split("T")[0];
    return `${today}T${datetimeString}:00`;
  }

  // Para strings do datetime-local (YYYY-MM-DDTHH:mm)
  if (datetimeString.length === 16) {
    return `${datetimeString}:00`;
  }

  return datetimeString;
}

// 🔹 Atualizar um intervalo existente
export async function updateBreak(
  breakId: string,
  updates: Partial<BreakTime>,
): Promise<void> {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // Converte as strings de tempo se necessário
  if (updates.start_time) {
    payload.start_time = convertToISOTimestamp(updates.start_time);
  }
  if (updates.end_time) {
    payload.end_time = convertToISOTimestamp(updates.end_time);
  }

  const { error } = await supabase
    .from("breaks")
    .update(payload)
    .eq("id", breakId);

  if (error) {
    console.error("Erro ao atualizar break:", error.message);
    throw new Error(error.message);
  }
}
