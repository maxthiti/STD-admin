import axios from "axios";

export class StudentService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
    this.imgBaseUrl = import.meta.env.VITE_APP_IMG_URL;
    this.token = localStorage.getItem("token");
  }

  async getStudents(grade, classroom) {
    try {
      const params = new URLSearchParams();
      if (grade) params.append("grade", grade);
      if (classroom) params.append("classroom", classroom);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/student?${params.toString()}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Get students error:", error);
      throw error;
    }
  }

  async createStudent(formData) {
    try {
      const data = new FormData();
      data.append("userid", formData.userid);
      data.append("pre_name", formData.pre_name);
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("grade", formData.grade);
      data.append("classroom", formData.classroom);

      if (formData.picture) {
        data.append("picture", formData.picture);
      }

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/student`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.token}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Create student error:", error);
      throw error;
    }
  }

  async updateStudent(id, formData) {
    try {
      const data = new FormData();
      if (formData.userid) data.append("userid", formData.userid);
      if (formData.pre_name) data.append("pre_name", formData.pre_name);
      if (formData.first_name) data.append("first_name", formData.first_name);
      if (formData.last_name) data.append("last_name", formData.last_name);
      if (formData.grade) data.append("grade", formData.grade);
      if (formData.classroom) data.append("classroom", formData.classroom);
      if (formData.picture) data.append("picture", formData.picture);

      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/student/${id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.token}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Update student error:", error);
      throw error;
    }
  }

  async deleteStudent(studentId) {
    try {
      this.token = localStorage.getItem("token");
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${this.baseUrl}users/student/${studentId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Delete student error:", error);
      throw error;
    }
  }
}
