import axios from "axios";

export class StudentService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_BASE_URL;
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

  //   async createStudent(studentData) {
  //     try {
  //       const params = new URLSearchParams();
  //       Object.keys(studentData).forEach((key) => {
  //         params.append(key, studentData[key]);
  //       });

  //       let config = {
  //         method: "post",
  //         maxBodyLength: Infinity,
  //         url: `${this.baseUrl}users/student`,
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           Authorization: `Bearer ${this.token}`,
  //         },
  //         data: params,
  //       };

  //       const response = await axios.request(config);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Create student error:", error);
  //       throw error;
  //     }
  //   }

  //   // DELETE - ลบนักเรียน
  //   async deleteStudent(studentId) {
  //     try {
  //       let config = {
  //         method: "delete",
  //         maxBodyLength: Infinity,
  //         url: `${this.baseUrl}users/student/${studentId}`,
  //         headers: {
  //           Authorization: `Bearer ${this.token}`,
  //         },
  //       };

  //       const response = await axios.request(config);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Delete student error:", error);
  //       throw error;
  //     }
  //   }
}
