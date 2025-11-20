// pages/owner/settings.tsx
import { ImageUpload } from "@/components/image-upload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBarberShop } from "@/context/barber-shop-provider";
import { Loader2, MapPin, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const THEMES = [
  { value: "default", label: "Moderno" },
  { value: "vintage", label: "Vintage" },
];

export default function SettingsPage() {
  const { shop, barbershop_config, loading, isSaving, updateBarbershopConfig } =
    useBarberShop();
  const [formData, setFormData] = useState({
    name: shop?.name || "Nome",
    address: shop?.address || "Endereço",
    image_url: shop?.image_url || "",
    main_color: barbershop_config?.main_color || "#3B82F6",
    theme: barbershop_config?.theme || "default",
    instagram_user: barbershop_config?.instagram_user || "",
    whatsapp_number: barbershop_config?.whatsapp_number || "",
    appointment_interval: barbershop_config?.appointment_interval || 30,
  });

  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  // Atualizar formData quando config mudar
  useEffect(() => {
    if (barbershop_config) {
      setFormData({
        name: shop?.name || "Nome",
        address: shop?.address || "Endereço",
        image_url: shop?.image_url || "",
        main_color: barbershop_config.main_color || "#3B82F6",
        theme: barbershop_config.theme || "default",
        instagram_user: barbershop_config.instagram_user || "",
        whatsapp_number: barbershop_config.whatsapp_number || "",
        appointment_interval: barbershop_config.appointment_interval || 30,
      });
    }
  }, [barbershop_config, shop]);

  const handleSave = async () => {
    try {
      await updateBarbershopConfig(formData);
      toast.success("Configurações salvas com sucesso! 🎉");
    } catch (error) {
      toast.error("Erro ao salvar configurações. Tente novamente.");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 pb-18">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize a aparência e comportamento da sua barbearia
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="appearance" className="gap-2">
            Aparência
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            Agendamento
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            Redes Sociais
          </TabsTrigger>
        </TabsList>

        {/* ABA DE APARÊNCIA */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nome e Logo</CardTitle>
              <CardDescription>
                Personalize o nome e a logo da sua barbearia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageChange={(imageUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        image_url: imageUrl || "",
                      }));
                    }}
                    barbershopId={shop?.id || ""}
                    folder="barbershops"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barbershop_name">Nome</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Minha Barbearia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                      <MapPin />
                    </div>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="seuusuario"
                      className="flex-1 rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>Tema e Cores</CardTitle>
              <CardDescription>
                Personalize as cores e o tema da sua barbearia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) => handleInputChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="main_color">Cor Principal</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.main_color}
                      onChange={(e) =>
                        handleInputChange("main_color", e.target.value)
                      }
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={formData.main_color}
                      onChange={(e) =>
                        handleInputChange("main_color", e.target.value)
                      }
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview do tema */}
              <div
                className={`
    p-6 rounded-xl border shadow-sm transition-all
    theme-${formData.theme}
    ${
      previewMode === "dark"
        ? "dark bg-neutral-900 border-neutral-700"
        : "bg-white"
    }
  `}
              >
                {/* Cabeçalho de Preview */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h4 className="font-semibold text-lg">Preview do Tema</h4>
                    <p className="text-sm text-muted-foreground">
                      Veja como o tema ficará para seus clientes
                    </p>
                  </div>

                  {/* Botões de Light/Dark */}
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("light")}
                      className="h-7 px-3 text-xs"
                    >
                      Light
                    </Button>
                    <Button
                      variant={previewMode === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("dark")}
                      className="h-7 px-3 text-xs"
                    >
                      Dark
                    </Button>
                  </div>
                </div>

                {/* Cartão de Preview */}
                <div
                  className={`
      rounded-xl p-5 shadow-md transition-all
      ${
        previewMode === "dark"
          ? "bg-neutral-800 border border-neutral-700"
          : "bg-white border"
      }
    `}
                >
                  {/* Cor primária */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-16 h-16 rounded-lg shadow-inner flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: formData.main_color }}
                    >
                      Cor
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="h-3 rounded bg-muted-foreground w-3/4" />
                      <div className="h-3 rounded bg-muted-foreground w-1/2" />
                      <div className="h-3 rounded bg-muted-foreground w-2/5" />
                    </div>
                  </div>

                  {/* Botão de exemplo */}
                  <Button
                    style={{ backgroundColor: formData.main_color }}
                    className="text-white font-semibold w-full py-2 shadow-md hover:opacity-90"
                  >
                    Agendar horário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA DE AGENDAMENTO */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamento</CardTitle>
              <CardDescription>
                Configure como funcionam os agendamentos na sua barbearia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appointment_interval">
                    Intervalo entre agendamentos (minutos)
                  </Label>
                  <Select
                    value={formData.appointment_interval?.toString()}
                    onValueChange={(value) =>
                      handleInputChange("appointment_interval", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="90">90 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir agendamento online</Label>
                    <div className="text-sm text-muted-foreground">
                      Clientes podem agendar diretamente pelo app
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por WhatsApp</Label>
                    <div className="text-sm text-muted-foreground">
                      Enviar lembretes de agendamento via WhatsApp
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA DE REDES SOCIAIS */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais e Contato</CardTitle>
              <CardDescription>
                Adicione suas redes sociais para os clientes te encontrarem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_user">Instagram</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                      @
                    </div>
                    <Input
                      value={formData.instagram_user}
                      onChange={(e) =>
                        handleInputChange("instagram_user", e.target.value)
                      }
                      placeholder="seuusuario"
                      className="flex-1 rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp</Label>
                  <Input
                    value={formData.whatsapp_number}
                    onChange={(e) =>
                      handleInputChange("whatsapp_number", e.target.value)
                    }
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Preview dos links */}
              {(formData.instagram_user || formData.whatsapp_number) && (
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-semibold mb-3">Preview dos Links</h4>
                  <div className="space-y-2">
                    {formData.instagram_user && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-pink-500">📷</span>
                        <span>instagram.com/{formData.instagram_user}</span>
                      </div>
                    )}
                    {formData.whatsapp_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">💬</span>
                        <span>{formData.whatsapp_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
