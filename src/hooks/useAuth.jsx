export function useAuth() {
  const authToken = localStorage.getItem("authToken");
  return { authToken };
}
