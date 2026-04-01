import axios from "axios";

export class MeritService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getMeritTypes() {
    try {
      let config = {
        method: "get",
        url: `${this.baseUrl}merittype`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get merittype error:", error);
      throw error;
    }
  }

  async createMeritType(data) {
    try {
      const params = new URLSearchParams();
      params.append("name", data.name);
      params.append("score", data.score);
      let config = {
        method: "post",
        url: `${this.baseUrl}merittype`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.token}`,
        },
        data: params,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Create merittype error:", error);
      throw error;
    }
  }

  async updateMeritType(id, data) {
    try {
      const params = new URLSearchParams();
      params.append("name", data.name);
      params.append("score", data.score);
      let config = {
        method: "put",
        url: `${this.baseUrl}merittype/${id}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.token}`,
        },
        data: params,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Update merittype error:", error);
      throw error;
    }
  }

    async deleteMeritType(id) {
    try {
      let config = {
        method: "delete",
        url: `${this.baseUrl}merittype/${id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Delete merittype error:", error);
      throw error;
    }
  }
}
