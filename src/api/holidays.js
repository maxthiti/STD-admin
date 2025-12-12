import axios from "axios";

class HolidaysAPI {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async createHoliday(holidays) {
    try {
      const response = await axios.post(`${this.baseUrl}dayoff`, holidays, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getHolidaysByRange(start, end) {
    try {
      const response = await axios.get(`${this.baseUrl}dayoff`, {
        params: { start, end },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteHoliday(id) {
    try {
      const response = await axios.delete(`${this.baseUrl}dayoff/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export async function fetchExternalHolidays() {
  const axios = require("axios");
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://www.myhora.com/calendar/ical/holiday.aspx?latest.json",
    headers: {
      Cookie: "ASP.NET_SessionId=hepmj5x2z0hnrggqak2um0rv",
    },
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default new HolidaysAPI();
