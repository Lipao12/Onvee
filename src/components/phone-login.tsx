import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 1️⃣ Enviar o SMS
  const handleSendOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setMessage("Código enviado! Verifique seu SMS.");
      setStep("verify");
    } catch (err: any) {
      setMessage(`Erro ao enviar código: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verificar o código
  const handleVerifyOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });
      if (error) throw error;
      setMessage("Login realizado com sucesso!");
    } catch (err: any) {
      setMessage(`Erro ao verificar código: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[340px] p-4">
        <CardHeader>
          <h1>Você não está autenticado, por favor, siga os passos</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" && (
            <>
              <div>
                <Label htmlFor="phone">Número de celular</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+55 11 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={loading || !phone}
                className="w-full"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </Button>
            </>
          )}

          {step === "verify" && (
            <>
              <div>
                <Label htmlFor="otp">Código recebido</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full"
              >
                {loading ? "Verificando..." : "Confirmar código"}
              </Button>
            </>
          )}

          {message && (
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
