import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

// EmptyState Component
export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
}: {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="text-center p-6 bg-card rounded-2xl border-none shadow-sm">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-secondary text-secondary-foreground">
              <Scissors className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-semibold text-foreground">{title}</h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>

            <Button onClick={onAction} className="mt-2 w-full">
              {actionText}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
