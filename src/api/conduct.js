import axios from "axios";
import qs from "qs";

export class ConductService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getStudentConduct(studentId) {
    try {
      let config = {
        method: "get",
        url: `${this.baseUrl}conduct/student/${studentId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get student conduct error:", error);
      throw error;
    }
  }

  async createConduct(data) {
    try {
      const params = qs.stringify(data);
      let config = {
        method: "post",
        url: `${this.baseUrl}conduct`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.token}`,
        },
        data: params,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Create conduct error:", error);
      throw error;
    }
  }

  async deleteConduct(id) {
    try {
      let config = {
        method: "delete",
        url: `${this.baseUrl}conduct/${id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Delete conduct error:", error);
      throw error;
    }
  }
}
