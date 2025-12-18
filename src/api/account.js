import axios from "axios";

export class AccountService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getAdmins() {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/admin`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get admins error:", error);
      throw error;
    }
  }

  async createAdmin(adminData) {
    try {
      const params = new URLSearchParams();
      params.append("username", adminData.username);
      params.append("password", adminData.password);
      params.append("name", adminData.name);
      if (adminData.role) {
        params.append("role", adminData.role);
      }

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/admin`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.token}`,
        },
        data: params,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Create admin error:", error);
      throw error;
    }
  }

  async deleteAdmin(adminId) {
    try {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/admin/${adminId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Delete admin error:", error);
      throw error;
    }
  }
}
