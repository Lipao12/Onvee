import { Button } from "@/components/ui/button";

export default function CalendarList({ onNext }: { onNext: () => void }) {
  return (
    <main className="pb-20 px-6">
      <Button onClick={onNext}>Ir Para O Próximo</Button>
    </main>
  );
}
