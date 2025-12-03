import axios from "axios";

export class UserService {
  async revokeRefreshToken() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${this.baseUrl}users/revokerefreshtoken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (e) {
      // ไม่ต้อง throw error
    }
    localStorage.removeItem("refresh_token");
  }
  async refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token found");

    let config = {
      method: "post",
      url: `${this.baseUrl}users/refreshtoken`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { refresh_token: refreshToken },
    };

    const response = await axios.request(config);
    if (response.data && response.data.data) {
      const {
        access_token,
        token_type,
        refresh_token: newRefreshToken,
      } = response.data.data;
      if (access_token) {
        localStorage.setItem("token", access_token);
        this.token = access_token;
        axios.defaults.headers.common[
          "Authorization"
        ] = `${token_type} ${access_token}`;
      }
      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }
      return response.data;
    }
    throw new Error("Failed to refresh token");
  }
  constructor(context) {
    this.context = context;
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async SignIn(Userdata) {
    try {
      const params = new URLSearchParams();
      params.append("username", Userdata.username);
      params.append("password", Userdata.password);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/login`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: params,
      };

      const response = await axios.request(config);

      if (response.data && response.data.data) {
        const { access_token, token_type } = response.data.data;

        if (access_token) {
          localStorage.setItem("token", access_token);
          this.token = access_token;

          axios.defaults.headers.common[
            "Authorization"
          ] = `${token_type} ${access_token}`;
        }

        return response.data;
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    await this.revokeRefreshToken();
    localStorage.removeItem("token");
    this.token = null;
    delete axios.defaults.headers.common["Authorization"];
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

export default UserService;
