import { supabase } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "client" | "barber" | "owner" | "unauthenticated";

interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  barbershop_id?: string;
  profile_id?: string;
}

interface AuthContextType {
  user: User | AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          // Check for client session (phone auth)
          const clientSession = localStorage.getItem("client_session");
          if (clientSession) {
            const clientData = JSON.parse(clientSession);
            setAuthState({
              user: {
                id: clientData.phone,
                phone: clientData.phone,
                role: "client",
                barbershop_id: clientData.barbershop_id,
              },
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }

          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        // User is authenticated via email/password
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profile) {
          setAuthState({
            user: session.user,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        // Determine role
        //let role: UserRole = "barber";
        let barbershop_id: string | undefined;

        // Check if user is a barber
        const { data: barber } = await supabase
          .from("barbers")
          .select("id, barbershop_id")
          .eq("profile_id", profile.id)
          .single();

        if (barber) {
          //role = "barber";
          barbershop_id = barber.barbershop_id;

          // Check if barber is also owner
          const { data: barbershop } = await supabase
            .from("barbershops")
            .select("admin_id")
            .eq("id", barbershop_id)
            .single();

          if (barbershop?.admin_id === session.user.id) {
            //role = "owner";
            // Override profile role if owner
            profile.app_role = "owner";
          }
        }

        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email,
            role: profile.app_role,
            barbershop_id,
            profile_id: profile.id,
          },
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth event:", event);

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("client_session");
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Re-initialize auth to get role and details
        initializeAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
