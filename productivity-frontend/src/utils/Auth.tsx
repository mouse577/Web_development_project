import { jwtDecode } from "jwt-decode";

class AuthService {
// Gets the token from local storage, decodes and returns the decoded token
  getUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<{ data: { id: number; email: string; first_name?: string; last_name?: string } }>(token);
      return decoded.data;
    } catch (error) {
      // ... or throw an error if something goes worng
      console.error("Invalid Token:", error);
      return null;
    }
  }

// Returns true or false, good for quick checks
  loggedIn(): boolean {
    return !!this.getUser();
  }

// Retrieves the token from local storage
  getToken(): string | null {
    return localStorage.getItem("id_token");
  }

// Sets the token in local storage, then redirects
  login(idToken: string): void {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/productivity-frontend");
  }
// Removes the token from local storage, then redirects
logout(): void {
    localStorage.removeItem("id_token");
    window.location.assign("/productivity-frontend");
  }
}

export default new AuthService();
