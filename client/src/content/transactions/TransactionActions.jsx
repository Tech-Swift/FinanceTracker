import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";

export default function TransactionActions({
  onActionComplete,
  editData = null,
  openExternally = false,
  setCloseExternal,
}) {
  const [open, setOpen] = useState(openExternally || false);

  // Sync external open state with internal state
  useEffect(() => {
    setOpen(openExternally);
  }, [openExternally]);

  const handleSuccess = () => {
    setOpen(false);
    if (setCloseExternal) setCloseExternal(); // Close from parent (edit)
    onActionComplete(); // Refresh data
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only show the trigger button for "create" mode */}
      {!editData && (
        <div className="flex justify-end">
          <DialogTrigger asChild>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3">
              New Transaction
            </Button>
          </DialogTrigger>
        </div>
      )}

      <DialogContent className="max-w-md">
        <TransactionForm
          mode={editData ? "edit" : "create"}
          initialData={editData}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
