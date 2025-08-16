import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TransactionActions({ onNew }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Transactions</h2>
      <div className="flex gap-2">
        <Button onClick={onNew} className="flex items-center gap-2">
          <Plus size={16} />
          New Transaction
        </Button>
        {/* Future actions e.g. export */}
      </div>
    </div>
  );
}
