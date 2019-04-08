import navigationBar from "./components/NavigationBar.vue";
import signUp from "./components/SignupLogin.vue";
import books from "./components/Books.vue";
import homePage from "./components/Homepage.vue";

export default [
  {
    path: "/",
    component: homePage,
    children: [{ path: "", component: navigationBar }]
  },
  {
    path: "/signuplogin",
    component: signUp,
    children: [{ path: "", component: navigationBar }]
  },
  {
    path: "/books",
    component: books,
    children: [{ path: "", component: navigationBar }]
  }
];
