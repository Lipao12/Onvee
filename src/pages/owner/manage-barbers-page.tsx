"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock,
  DollarSign,
  Edit,
  Image as ImageIcon,
  Loader2,
  Plus,
  Scissors,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
}

export default function ManageBarbersPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "30",
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
        .select("*")
        .eq("barbershop_id", barbershop_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
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
      let imageUrl = editingService?.image_url || "";

      // Upload da nova imagem se houver
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes),
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
  async function handleDelete(id: string) {
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
  }

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration_minutes: "30",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingService(null);
  };

  // Abrir dialog para edição
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration_minutes: String(service.duration_minutes),
    });
    setImagePreview(service.image_url || "");
    setShowDialog(true);
  };

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

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Serviços da Barbearia
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os serviços oferecidos pela sua barbearia
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2" size="lg">
          <Plus className="w-4 h-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : services.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <Scissors className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">
                Nenhum serviço cadastrado
              </h3>
              <p className="text-muted-foreground mt-1">
                Comece adicionando seu primeiro serviço à barbearia
              </p>
            </div>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-lg transition-shadow active:scale-98"
            >
              {/* Container da imagem com badge */}
              <div className="aspect-5/3 relative bg-muted">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-800 to-amber-600">
                    <Scissors className="w-8 h-8 text-white" />
                  </div>
                )}

                {/* Badge de duração melhorado */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-black/80 text-white backdrop-blur-sm px-2 py-1"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {service.duration_minutes}min
                  </Badge>
                </div>
              </div>

              {/* Conteúdo do card */}
              <CardContent className="p-3">
                {/* Cabeçalho com nome e preço */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base leading-tight flex-1 mr-2">
                    {service.name}
                  </h3>
                  <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                    {formatPrice(service.price)}
                  </span>
                </div>

                {/* Descrição (se existir) */}
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                )}

                {/* Rodapé com ações */}
                <div className="flex items-center justify-between">
                  {/* Indicador visual de duração (redundante mas útil) */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration_minutes} minutos</span>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
              <Label>Imagem do Serviço</Label>
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
              <Label htmlFor="name">Nome do Serviço *</Label>
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
              <Label htmlFor="description">Descrição</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="pl-9"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min) *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: e.target.value,
                      })
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                !formData.price ||
                !formData.duration_minutes ||
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
