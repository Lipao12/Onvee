import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      navigate("/barber/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-[url('../../public/bg1.jpeg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <Card className="w-full max-w-md relative z-10 bg-neutral-100 dark:bg-neutral-900 shadow-[0_0_25px_rgba(0,0,0,0.6)] rounded-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-amber-500 dark:text-amber-600 tracking-wide drop-shadow-md">
            Barbeiro Login
          </CardTitle>
          <p className="text-zinc-400 text-sm mt-1 uppercase tracking-widest">
            {isSignUp
              ? "Crie sua conta e entre pra irmandade"
              : "Entre na sua conta"}
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                placeholder="exemplo@dominio.com"
                onChange={(e) => setEmail(e.target.value)}
                className=" focus:ring-amber-600 focus:border-amber-600 placeholder:text-zinc-500"
              />
            </div>

            <div>
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className=" focus:ring-amber-600 focus:border-amber-600 placeholder:text-zinc-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 dark:bg-amber-700 hover:bg-amber-600 text-white font-bold uppercase tracking-wide py-2 transition-all shadow-[0_0_10px_rgba(255,170,50,0.3)]"
            >
              {loading ? "Entrando..." : isSignUp ? "Cadastrar" : "Entrar"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors uppercase"
            >
              {isSignUp ? "Já tem conta? Entrar" : "Criar nova conta"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
