import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export class DepartmentService {
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

  async getDepartments() {
    try {
      const response = await this.api.get("/department");
      return response.data;
    } catch (error) {
      console.error("Get departments error:", error);
      throw error;
    }
  }

  async createDepartment(name) {
    try {
      const response = await this.api.post("/department", { name });
      return response.data;
    } catch (error) {
      console.error("Create department error:", error);
      throw error;
    }
  }

  async updateDepartment(id, name) {
    try {
      const response = await this.api.put(`/department/${id}`, { name });
      return response.data;
    } catch (error) {
      console.error("Update department error:", error);
      throw error;
    }
  }

  async deleteDepartment(id) {
    try {
      const response = await this.api.delete(`/department/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete department error:", error);
      throw error;
    }
  }
}
