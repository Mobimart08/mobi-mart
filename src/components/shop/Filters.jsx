import CustomDropdown from "../ui/CustomDropdown";

export default function Filters({
  brand,
  setBrand,
  brandOptions,
  condition,
  setCondition,
  conditionOptions,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  resetFilters,
  onApply,
  className = "",
  showActions = false,
}) {
  return (
    <div className={`rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <p className="mt-1 text-sm text-slate-600">
          Refine by brand, condition, and price range.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Brand</label>
          <CustomDropdown value={brand} onChange={setBrand} options={brandOptions} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Condition</label>
          <CustomDropdown
            value={condition}
            onChange={setCondition}
            options={conditionOptions}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Min Price</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
              className="mm-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Max Price</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Any"
              className="mm-input"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {showActions ? (
          <button type="button" onClick={onApply} className="ds-btn-primary w-full py-3">
            Apply Filters
          </button>
        ) : null}
        <button type="button" onClick={resetFilters} className="ds-btn-secondary w-full py-3">
          Reset Filters
        </button>
      </div>
    </div>
  );
}
