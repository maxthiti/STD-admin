import axios from "axios";

export class ClassRoomService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getClassRooms() {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}classroom`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get classrooms error:", error);
      throw error;
    }
  }

  async createClassRoom(data) {
    try {
      const payload = { ...data };
      if (!payload.adviser2) delete payload.adviser2;
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}classroom`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data: JSON.stringify(payload),
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Create classroom error:", error);
      throw error;
    }
  }

  async deleteClassRoom(id) {
    try {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}classroom/${id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Delete classroom error:", error);
      throw error;
    }
  }

  async updateClassRoom(id, data) {
    try {
      const params = new URLSearchParams();
      params.append("adviser", data.adviser);
      if (data.adviser2 !== undefined) params.append("adviser2", data.adviser2);

      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}classroom/${id}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.token}`,
        },
        data: params,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Update classroom error:", error);
      throw error;
    }
  }
}
