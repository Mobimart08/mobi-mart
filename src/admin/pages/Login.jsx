import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useAdminAuth } from "../context/useAdminAuth";

const fieldMotion = {
  rest: { scale: 1 },
  focus: { scale: 1.01 },
};

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form.username.trim(), form.password);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/admin/dashboard");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AdminLayout
      title="Welcome Back!"
      subtitle="Sign in to access your admin dashboard"
      sideTagline="Manage your inventory smarter with a workspace built for faster decisions."
      sideNote="Track stock, review updates, and keep your storefront moving with less friction."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <motion.label
          initial="rest"
          whileFocus="focus"
          className="block"
          variants={fieldMotion}
        >
          <span className="mb-2.5 block text-sm font-medium text-slate-700">
            Username
          </span>
          <div className="mm-input-shell">
            <FiUser className="mr-3 text-[18px] text-slate-400" aria-hidden="true" />
            <input
              className="mm-input-shell-field"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </motion.label>

        <motion.label
          initial="rest"
          whileFocus="focus"
          className="block"
          variants={fieldMotion}
        >
          <span className="mb-2.5 block text-sm font-medium text-slate-700">
            Password
          </span>
          <div className="mm-input-shell">
            <FiLock className="mr-3 text-[18px] text-slate-400" aria-hidden="true" />
            <input
              className="mm-input-shell-field"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </motion.label>

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <p className="pt-1 text-sm text-slate-600">
          Contact developer if password is lost.
        </p>

        <motion.button
          whileHover={{ scale: 1.015, y: -1 }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-[linear-gradient(180deg,#1e365f_0%,#102c57_100%)] py-4 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105"
        >
          {isLoading ? "Signing in..." : "Login to Dashboard"}
        </motion.button>
      </form>
    </AdminLayout>
  );
}
