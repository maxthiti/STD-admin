import { createRouter, createWebHistory } from "vue-router";

const Login = () => import("../views/Login.vue");
const AdminLayout = () => import("../layouts/AdminLayout.vue");
const Home = () => import("../views/Admin/Home.vue");
const Teacher = () => import("../views/Admin/Teacher.vue");
const Student = () => import("../views/Admin/Student.vue");
const Account = () => import("../views/Admin/Account.vue");
const Department = () => import("../views/Admin/Department.vue");
const Position = () => import("../views/Admin/Position.vue");

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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
