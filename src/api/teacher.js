import axios from "axios";

export class TeacherService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  async getTeachers(searchQuery = "", department = "", position = "") {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/teacher`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);

      if (response.data && response.data.data) {
        let filtered = response.data.data;

        if (searchQuery) {
          filtered = filtered.filter(
            (teacher) =>
              teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              teacher.userid?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (department) {
          filtered = filtered.filter(
            (teacher) => teacher.department === department
          );
        }

        if (position) {
          filtered = filtered.filter(
            (teacher) => teacher.position === position
          );
        }

        return { ...response.data, data: filtered };
      }

      return response.data;
    } catch (error) {
      console.error("Get teachers error:", error);
      throw error;
    }
  }
}
