import axios from "axios";

class ModelingService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getModelings(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        role: params.role || "student",
        name: params.name || "",
        department: params.department || "",
        userid: params.userid || "",
        status: params.status || "all",
        page: params.page || 1,
        limit: params.limit || 10,
        grade: params.grade || "",
        classroom: params.classroom || "0"
      });
      const response = await axios.get(
        `${this.baseUrl}modeling?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching modelings:", error);
      throw error;
    }
  }

  async createModeling(data) {
    try {
      const response = await axios.post(`${this.baseUrl}modeling`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating modeling:", error);
      throw error;
    }
  }

  async updateModeling(modelingId) {
    try {
      const response = await axios.patch(
        `${this.baseUrl}modeling/${modelingId}/remodeling`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating modeling:", error);
      throw error;
    }
  }

  async deleteModeling(modelingId) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}modeling/${modelingId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting modeling:", error);
      throw error;
    }
  }
}

export default new ModelingService();
