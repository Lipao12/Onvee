import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase-client";
import { ScanQrCode } from "lucide-react";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import "../barber-code.css";

export default function UserBarberCode() {
  const [barberCode, setBarberCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const handleSubmit = async () => {
    const code = qrResult || barberCode;
    if (!code) {
      alert("Por favor, insira ou escaneie o código da barbearia.");
      return;
    }
    setLoading(true);

    try {
      // 🔍 Busca a barbearia pelo código
      const { data, error } = await supabase
        .from("barbershops")
        .select("*")
        .eq("access_code", code)
        .single();

      if (error || !data) {
        alert("Código inválido. Verifique e tente novamente.");
        console.error(error);
        return;
      }

      localStorage.setItem("barbershop_id", data.id);

      // Navega para a página de serviços da barbearia
      navigator(`/newappointment?shop=${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao verificar o código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="barber-code-background relative min-h-screen flex items-end justify-center bg-gray-900 p-6">
      <Card className="w-full max-w-md mb-10 shadow-xl border-none bg-transparent text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Entre com o código da Barbearia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="barberCode" className="text-gray-300">
                Código da Barbearia
              </Label>
              <Input
                className="h-12 text-md mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400"
                id="barberCode"
                placeholder="Ex: 12345"
                value={barberCode}
                onChange={(e) => setBarberCode(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="h-12 text-md bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>

            <p className="text-gray-300 text-sm font-normal leading-normal py-2 text-center">
              — OU —
            </p>

            {!isScanning ? (
              <Button
                variant="outline"
                onClick={() => setIsScanning(true)}
                className="text-md h-12 text-gray-800 bg-neutral-100"
              >
                <ScanQrCode className="h-4 w-4 text-gray-800" /> Escanear QR
                Code
              </Button>
            ) : (
              <div className="relative">
                <QrReader
                  onResult={(result) => {
                    if (result) {
                      setQrResult(result.getText());
                      setIsScanning(false);
                    }
                  }}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%" }}
                />
                <Button
                  variant="destructive"
                  onClick={() => setIsScanning(false)}
                  className="absolute top-2 right-2"
                >
                  Fechar
                </Button>
              </div>
            )}

            {qrResult && (
              <div className="text-sm text-emerald-400 font-medium text-center">
                Código escaneado: {qrResult}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
