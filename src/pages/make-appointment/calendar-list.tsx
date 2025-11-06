import { Button } from "@/components/ui/button";

export default function CalendarList({
  onNext,
}: {
  onNext: (selectedDate: Date) => void;
}) {
  return (
    <main className="pb-20 px-6">
      <Button
        onClick={() => {
          onNext(new Date());
        }}
      >
        Ir Para O Próximo
      </Button>
    </main>
  );
}
