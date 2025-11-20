"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase-client";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Barber {
  id: string;
  profile_id: {
    full_name: string;
    image_url?: string;
    phone?: string;
  };
  bio: string;
  is_active: boolean;
  rating: number;
}

export default function ManageBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Barber | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const barbershop_id = localStorage.getItem("barbershop_id");

  // Buscar serviços da barbearia
  async function fetchServices() {
    if (!barbershop_id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("*, profile_id(full_name, image_url, phone)")
        .eq("barbershop_id", barbershop_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log(data);
      setBarbers(data || []);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      toast.error("Erro", {
        description: "Não foi possível carregar os serviços",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  // Upload de imagem
  const uploadImage = async (file: File): Promise<string> => {
    if (!barbershop_id) throw new Error("Barbearia não identificada");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `services/${barbershop_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("services-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("services-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Criar ou atualizar serviço
  async function handleSave() {
    if (!barbershop_id) {
      toast.error("Erro", { description: "Barbearia não identificada" });
      return;
    }

    try {
      let imageUrl = editingService?.profile_id.image_url || "";

      // Upload da nova imagem se houver
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...formData,
        barbershop_id,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Sucesso", {
          description: "Serviço atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase.from("services").insert([payload]);
        if (error) throw error;
        toast.message("Sucesso", {
          description: "Serviço criado com sucesso!",
        });
      }

      setShowDialog(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast.error("Erro", {
        description: "Não foi possível salvar o serviço",
      });
    } finally {
      setUploading(false);
    }
  }

  // Excluir serviço
  /*async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      toast.message("Sucesso", {
        description: "Serviço excluído com sucesso!",
      });
      fetchServices();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      toast.error("Erro", {
        description: "Não foi possível excluir o serviço",
      });
    }
  }*/

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingService(null);
  };

  // Abrir dialog para edição
  /*const handleEdit = (barber: Barber) => {
    setEditingService(barber);
    setFormData({
      name: barber.profile_id.full_name,
      description: barber.bio,
    });
    setImagePreview(barber.profile_id.image_url || "");
    setShowDialog(true);
  };*/

  // Manipular upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é imagem
    if (!file.type.startsWith("image/")) {
      toast.error("Erro", {
        description: "Por favor, selecione um arquivo de imagem",
      });

      return;
    }

    // Verificar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Erro", {
        description: "A imagem deve ter no máximo 5MB",
      });

      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };


  console.log("Aqui estçao os barbers: ", barbers);

  return (
    <div className="container max-w-6xl mx-auto p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Barbeiros Cadastrados na Barbearia
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os barbeiros que estão trabalhando na sua barbearia
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2" size="lg">
          <Plus className="w-4 h-4" />
          Novo Barbeiro
        </Button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : barbers.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <User className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">
                Nenhum Barbeiro Cadastrado
              </h3>
              <p className="text-muted-foreground mt-1">
                Adicione seu primeiro barbeiro à barbearia
              </p>
            </div>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Cadastrar Primeiro Trabalhador
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className="cursor-pointer overflow-hidden bg-zinc-800 flex flex-col transition hover:shadow-lg"
            >
              <div className="relative w-full h-32 overflow-hidden">
                {barber.profile_id.image_url ? (
                  <img
                    src={barber.profile_id.image_url}
                    alt={barber.profile_id.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center bg-linear-to-br  from-[#FFF]  to-transparent 
                      dark:from-[#2b2b2b] dark:via-[#4a3c2b] dark:to-[#d7bfa6]"
                  >
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              <CardContent className="flex flex-col py-4 px-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold leading-tight text-white">
                      {barber.profile_id.full_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      {barber.bio || "Sem biografia disponível"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Service Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Atualize as informações do serviço"
                : "Adicione um novo serviço à sua barbearia"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagem do Barbeiro</Label>
              <div className="relative border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/60 transition-colors">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Pré-visualização da imagem"
                      className="mx-auto h-32 w-full object-cover rounded-md shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-6"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para fazer upload de uma imagem
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Barbeiro *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Corte de Cabelo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Biografia</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o serviço oferecido..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                uploading
              }
              className="w-full gap-2"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {uploading
                ? "Salvando..."
                : editingService
                ? "Atualizar Serviço"
                : "Criar Serviço"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
