// pages/onboarding/steps/Step1Profile.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-provider";
import { useOnboarding } from "@/context/onboarding-provider";
import { supabase } from "@/lib/supabase-client";
import { Camera, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Step1Profile() {
  const { data, setData, nextStep } = useOnboarding();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validar arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter menos de 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setData({ image_url: publicUrl });
      toast.success("Foto atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const canProceed = data.full_name.trim().length > 2;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Complete seu perfil</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Vamos personalizar sua experiência na plataforma
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload de foto */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-border overflow-hidden bg-muted">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-background text-primary p-2 rounded-full cursor-pointer hover:bg-amber-700 transition-colors shadow-lg">
              <Camera className="w-4 h-4" />
              <input
                aria-label="input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Nome completo */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium">
            Nome completo *
          </Label>
          <Input
            id="full_name"
            value={data.full_name}
            onChange={(e) => setData({ full_name: e.target.value })}
            placeholder="Como você gostaria de ser chamado"
            className="h-12"
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Telefone
          </Label>
          <Input
            id="phone"
            value={data.phone || ""}
            onChange={(e) => setData({ phone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="h-12"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium">
            Sobre você
          </Label>
          <Textarea
            id="bio"
            value={data.bio || ""}
            onChange={(e) => setData({ bio: e.target.value })}
            placeholder="Conte um pouco sobre sua experiência e especialidades..."
            rows={3}
          />
        </div>
      </div>

      <Button
        onClick={nextStep}
        disabled={!canProceed || uploading}
        className="w-full h-12  font-semibold"
      >
        {uploading ? "Enviando foto..." : "Continuar"}
      </Button>
    </div>
  );
}
