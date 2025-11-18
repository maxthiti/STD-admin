import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export class PositionService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async getPositions() {
    try {
      const response = await this.api.get("/position");
      return response.data;
    } catch (error) {
      console.error("Get positions error:", error);
      throw error;
    }
  }

  async createPosition(name) {
    try {
      const response = await this.api.post("/position", { name });
      return response.data;
    } catch (error) {
      console.error("Create position error:", error);
      throw error;
    }
  }

  async updatePosition(id, name) {
    try {
      const response = await this.api.put(`/position/${id}`, { name });
      return response.data;
    } catch (error) {
      console.error("Update position error:", error);
      throw error;
    }
  }

  async deletePosition(id) {
    try {
      const response = await this.api.delete(`/position/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete position error:", error);
      throw error;
    }
  }
}
