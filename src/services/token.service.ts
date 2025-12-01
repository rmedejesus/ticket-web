import type { IToken } from "../types/token";

class TokenService {
  getLocalAccessToken() {
    const token = JSON.parse(localStorage.getItem("token")!);
    return token;
  }

  updateLocalAccessToken(tokenData: IToken) {
    localStorage.setItem("token", JSON.stringify(tokenData));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user")!);
  }

  setUserAndToken(userData: any, tokenData: any) {
    //console.log(JSON.stringify(tokenData));
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", JSON.stringify(tokenData));
  }

  removeUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export default new TokenService();