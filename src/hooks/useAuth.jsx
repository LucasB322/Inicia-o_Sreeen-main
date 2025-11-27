export function useAuth() {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return { isAuthenticated };
  }
  