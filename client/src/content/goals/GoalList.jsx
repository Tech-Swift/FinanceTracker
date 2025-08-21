// GoalList.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2 } from "lucide-react";

export default function GoalList({ goals, onEdit, onDelete }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No goals found. Start by creating one!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Target Amount</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => {
            const progress = Math.min(
              ((goal.currentAmount || 0) / goal.targetAmount) * 100,
              100
            );

            return (
              <TableRow key={goal._id}>
                <TableCell className="font-medium">{goal.title}</TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {goal.description || "—"}
                </TableCell>
                <TableCell>KES {goal.targetAmount.toLocaleString()}</TableCell>
                <TableCell>
                  {goal.deadline
                    ? new Date(goal.deadline).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell className="w-48">
                  <Progress value={progress} />
                  <span className="text-xs text-gray-500">
                    {goal.currentAmount || 0} / {goal.targetAmount}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(goal._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
