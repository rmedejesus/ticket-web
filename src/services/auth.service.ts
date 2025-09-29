import api from "./api";
import TokenService from "./token.service";

class AuthService {
  login(email: string, password: string) {
    return api
      .post("/login", {
        email,
        password
      })
      .then(response => {
        if (response.data) {
          TokenService.setUser(response.data);
        }

        return response.data;
      })
      .catch(error => {
        return error.response.data.error;
      });
  }

  logout() {
    TokenService.removeUser();
  }

  register(firstName: string, middleName: string, lastName: string, username: string, email: string, password: string, role: string) {
    return api.post("/register", {
      firstName,
      middleName,
      lastName,
      username,
      email,
      password,
      role
    });
  }

  getCurrentUser() {
    return TokenService.getUser();
  }
}

export default new AuthService();