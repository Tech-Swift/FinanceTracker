import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BudgetSummary({ totalBudgeted, totalSpent, totalRemaining }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Total Budgeted</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base md:text-lg font-semibold">
            Kes {totalBudgeted}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Total Spent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base md:text-lg font-semibold">
            Kes {totalSpent}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Remaining</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base md:text-lg font-semibold">
            Kes {totalRemaining}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
