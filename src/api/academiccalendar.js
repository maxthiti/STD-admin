import axios from "axios";

export class AcademicCalendarService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getAcademicCalendar() {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}academiccalendar`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get academic calendar error:", error);
      throw error;
    }
  }

  async getAcademicCalendarByYear(year) {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}academiccalendar/${year}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get academic calendar by year error:", error);
      throw error;
    }
  }

  async createAcademicCalendar(data) {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}academiccalendar`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data: JSON.stringify(data),
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Create academic calendar error:", error);
      throw error;
    }
  }

  async updateAcademicCalendar(year, data) {
    try {
      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}academiccalendar/${year}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data: JSON.stringify(data),
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Update academic calendar error:", error);
      throw error;
    }
  }

  async deleteAcademicCalendar(year) {
    try {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}academiccalendar/${year}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Delete academic calendar error:", error);
      throw error;
    }
  }
}
