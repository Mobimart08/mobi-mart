import CustomDropdown from "../ui/CustomDropdown";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price Low to High", value: "low" },
  { label: "Price High to Low", value: "high" },
];

const Controls = ({ condition, setCondition, sort, setSort, search, setSearch }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
      
      {/* LEFT: TABS */}
      <div className="flex items-center gap-3">
        {["All", "New", "Used"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCondition(tab)}
            className={`rounded-xl px-4 py-2 text-sm transition-all duration-300 ${
              condition === tab
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-dark hover:bg-gray-50"
            }`}
          >
            {tab === "All" ? "All Phones" : tab}
          </button>
        ))}
      </div>

      {/* CENTER: SEARCH */}
      <div className="flex-1 w-full lg:max-w-md">
        <input
          type="text"
          placeholder="Search phones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ds-input w-full"
        />
      </div>

      {/* RIGHT: SORT DROPDOWN */}
      <div className="w-full lg:w-auto">
        <CustomDropdown value={sort} onChange={setSort} options={sortOptions} />
      </div>

    </div>
  );
};

export default Controls;