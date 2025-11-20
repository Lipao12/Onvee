import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";

interface PhoneLoginProps {
  onLoginSuccess?: () => void;
}

export default function PhoneLogin({ onLoginSuccess }: PhoneLoginProps) {
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
      
      // Save client session for persistence if needed (though supabase handles auth)
      // But the auth provider looks for "client_session" in localStorage for phone auth?
      // Let's check auth-provider.tsx again. 
      // It checks session.user first. If not, it checks localStorage.
      // Since we are doing real auth here, session.user should be set.
      // However, to be safe and consistent with the "client" role logic in auth-provider:
      // The auth-provider sets role="client" if it finds "client_session".
      // But if we have a real supabase session, we might need to ensure the role is correct.
      // In auth-provider: if (!profile) -> role is not set in context user object explicitly unless we handle it.
      // Let's set the localStorage just in case the auth-provider logic relies on it for "client" role 
      // when there is no profile table entry for this user yet.
      
      const clientData = {
        phone,
        role: "client",
        // barbershop_id? We might not know it yet or it's global.
      };
      localStorage.setItem("client_session", JSON.stringify(clientData));

      if (onLoginSuccess) {
        onLoginSuccess();
      }
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
          <h1>Para confirmar seu agendamento, precisamos verificar seu número de telefone.</h1>
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
