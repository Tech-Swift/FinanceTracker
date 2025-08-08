export const BudgetFilter = ({ categories, onFilter }) => {
  return (
    <div className="mb-4">
      <label htmlFor="filter" className="mr-2">Filter by category:</label>
      <select
        id="filter"
        onChange={(e) => onFilter(e.target.value)}
        className="border rounded p-2"
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};
