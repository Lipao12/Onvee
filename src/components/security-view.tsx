// src/components/security-view.tsx
import { useSafeAreaInsets } from "@/lib/use-safe-area";
import React from "react";

export default function SecurityView({
  children,
}: {
  children: React.ReactNode;
}) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <div
      className="min-h-screen bg-zinc-900 text-white flex flex-col"
      style={{
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      {children}
    </div>
  );
}
