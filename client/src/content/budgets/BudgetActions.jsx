import { Button } from "@/components/ui/button";

export default function BudgetActions({ onAdd }) {
  return (
    <div className="flex justify-end mb-4">
      <Button onClick={onAdd}>Add Budget</Button>
    </div>
  );
}
