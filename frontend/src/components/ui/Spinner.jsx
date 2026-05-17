export default function Spinner({
  label = "Loading...",
  className = "",
  size = "md",
}) {
  const sizeClass =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
        ? "h-10 w-10 border-[3px]"
        : "h-6 w-6 border-2";

  return (
    <div className={`flex items-center justify-center gap-3 text-slate-600 ${className}`}>
      <span
        className={`${sizeClass} animate-spin rounded-full border-primary/25 border-t-primary`}
        aria-hidden="true"
      />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </div>
  );
}
