import { createRouter, createWebHistory } from "vue-router";

const Login = () => import("../views/Login.vue");
const AdminLayout = () => import("../layouts/AdminLayout.vue");
const Home = () => import("../views/Admin/Home.vue");
const Teacher = () => import("../views/Admin/Teacher.vue");
const Student = () => import("../views/Admin/Student.vue");
const Account = () => import("../views/Admin/Account.vue");
const Department = () => import("../views/Admin/Department.vue");
const Position = () => import("../views/Admin/Position.vue");
const ClassRoom = () => import("../views/Admin/ClassRoom.vue");
const Device = () => import("../views/Admin/Device.vue");
const Modeling = () => import("../views/Admin/Modeling.vue");
const TableReport = () => import("../views/Admin/report/Attendance.vue");
const LateReport = () => import("../views/Admin/report/Late.vue");
const MissedReport = () => import("../views/Admin/report/Missed.vue");
const StrangerReport = () => import("../views/Admin/report/Stranger.vue");
const StatsView = () => import("../views/Admin/report/StatsView.vue");

const routes = [
  { path: "/", name: "login", component: Login },
  {
    path: "/home",
    name: "AdminHome",
    component: AdminLayout,
    redirect: "/home/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Home,
      },
      {
        path: "teacher",
        name: "Teacher",
        component: Teacher,
      },
      {
        path: "student",
        name: "Student",
        component: Student,
      },
      {
        path: "account",
        name: "Account",
        component: Account,
      },
      {
        path: "department",
        name: "Department",
        component: Department,
      },
      {
        path: "position",
        name: "Position",
        component: Position,
      },
      {
        path: "device",
        name: "Device",
        component: Device,
      },
      {
        path: "model",
        name: "Modeling",
        component: Modeling,
      },
      {
        path: "classroom",
        name: "ClassRoom",
        component: ClassRoom,
      },
      {
        path: "report",
        name: "TableReport",
        component: TableReport,
      },
      {
        path: "report/late",
        name: "LateReport",
        component: LateReport,
      },
      {
        path: "report/missed",
        name: "MissedReport",
        component: MissedReport,
      },
      {
        path: "report/stranger",
        name: "StrangerReport",
        component: StrangerReport,
      },
      {
        path: "report/stats",
        name: "StatsView",
        component: StatsView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
