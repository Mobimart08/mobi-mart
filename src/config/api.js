const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DEFAULT_API_URL = "https://mobimart.onrender.com";

function getApiBaseUrl() {
  const primaryApiUrl = import.meta.env.VITE_API_URL?.trim();
  const devApiUrl = import.meta.env.VITE_API_URL_DEV?.trim();

  if (typeof window !== "undefined" && LOCAL_HOSTS.has(window.location.hostname)) {
    return devApiUrl || primaryApiUrl || DEFAULT_API_URL;
  }

  return primaryApiUrl || devApiUrl || DEFAULT_API_URL;
}

const API = getApiBaseUrl();

export default API;
