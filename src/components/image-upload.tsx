import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase-client";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  barbershopId: string;
  folder?: string;
}

export function ImageUpload({
  currentImageUrl,
  onImageChange,
  barbershopId,
  folder = "barbershops",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações básicas
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("A imagem deve ter menos de 5MB");
      return;
    }

    // Criar preview local
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Fazer upload
    await handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      // Gerar nome único para o arquivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${barbershopId}/${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Fazer upload para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Nome do bucket - você precisa criar isso no Supabase
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      console.log(uploadData);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Erro ao obter URL pública da imagem");
      }

      // Atualizar o estado pai
      onImageChange(publicUrlData.publicUrl);

      toast.success("Imagem atualizada com sucesso! 🎉");
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload da imagem");
      // Reverter preview em caso de erro
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // URL para mostrar (preview temporário ou URL final)
  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-4">
      <Label htmlFor="barbershop-image">Imagem da barbearia</Label>

      {/* Preview da imagem */}
      {displayUrl ? (
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <img
              src={displayUrl}
              alt="Preview da barbearia"
              className="h-32 w-32 object-cover rounded-lg border-2 border-border shadow-sm"
            />
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleTriggerUpload}
                  disabled={uploading}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Trocar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Loading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Clique na imagem para trocar ou remover
          </p>
        </div>
      ) : (
        // Estado sem imagem
        <div className="flex flex-col items-center space-y-3">
          <div
            className="h-32 w-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/30"
            onClick={handleTriggerUpload}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">
                  Adicionar imagem
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            PNG, JPG até 5MB
          </p>
        </div>
      )}

      {/* Input de arquivo hidden */}
      <Input
        ref={fileInputRef}
        id="barbershop-image"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Botão de upload alternativo */}
      {!displayUrl && !uploading && (
        <Button
          type="button"
          variant="outline"
          onClick={handleTriggerUpload}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Selecionar imagem
        </Button>
      )}
    </div>
  );
}
