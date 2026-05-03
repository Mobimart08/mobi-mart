import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../components/ui/CustomDropdown";

const conditionOptions = [
  { label: "All Condition", value: "All" },
  { label: "New", value: "New" },
  { label: "Used", value: "Used" },
];

export default function ProductFilters({
  searchTerm,
  onSearchTermChange,
  condition,
  onConditionChange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by name, brand..."
            className="mm-input pl-11"
          />
        </div>

        <CustomDropdown
          value={condition}
          onChange={onConditionChange}
          options={conditionOptions}
          className="min-w-[170px]"
        />
      </div>
    </div>
  );
}
