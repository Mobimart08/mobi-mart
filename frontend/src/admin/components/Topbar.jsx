import { useAdminAuth } from "../context/useAdminAuth";

export default function Topbar() {
  const { admin } = useAdminAuth();

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full max-w-md">
        
      </div>
      <div
        className="flex items-center gap-3 rounded-2xl border border-gray-200 shadow-sm bg-white px-3 py-2 text-sm text-dark"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-white">
          {admin?.username?.[0]?.toUpperCase() || "A"}
        </span>
        <span className="font-medium">{admin?.username || "Admin"}</span>
      </div>
    </header>
  );
}
