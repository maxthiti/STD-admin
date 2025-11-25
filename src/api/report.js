import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const getAttendanceReport = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}report/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start: params.start,
        end: params.end,
        role: params.role,
        name: params.name || "",
        department: params.department || "",
        userid: params.userid || "",
        page: params.page || 1,
        limit: params.limit || 20,
        grade: params.grade || "",
        classroom: params.classroom,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    throw error;
  }
};

const getLateReport = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}report/late`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date: params.date,
        role: params.role,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching late report:", error);
    throw error;
  }
};

const getMissedReport = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}report/missed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date: params.date,
        role: params.role,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching missed report:", error);
    throw error;
  }
};

const getStrangerReport = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}report/stranger`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start: params.start,
        end: params.end,
        device_sn: params.device_sn || "",
        page: params.page || 1,
        limit: params.limit || 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stranger report:", error);
    throw error;
  }
};

export default {
  getAttendanceReport,
  getLateReport,
  getMissedReport,
  getStrangerReport,
  getDailyStats: async (start, end) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}report/dailystats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { start, end },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      throw error;
    }
  },
};
