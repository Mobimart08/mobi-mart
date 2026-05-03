import { apiClient, setAdminToken } from "./apiClient";

export async function loginAdmin({ username, password }) {
  const response = await apiClient.post("/admin/login", {
    username,
    password,
  });

  if (response.data?.token) {
    console.log("Admin login token:", response.data.token);
    setAdminToken(response.data.token);
  }

  return response.data;
}

export async function getAdminMe() {
  const response = await apiClient.get("/admin/me");
  return response.data;
}

export function logoutAdmin() {
  setAdminToken(null);
}
