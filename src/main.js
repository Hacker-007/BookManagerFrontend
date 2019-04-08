import Vue from "vue";
import App from "./App.vue";
import jQuery from "jquery";
import VueRouter from "vue-router";
import routes from "./routes";
import Vuex from "vuex";

Vue.use(VueRouter);
Vue.use(Vuex);
global.jQuery = require("jquery");
global.$ = jQuery;

const router = new VueRouter({
  mode: "history",
  routes
});

const store = new Vuex.Store({
  state: {
    user: {},
    token: ""
  },
  getters: {
    user: state => {
      return state.user;
    },
    token: state => {
      return state.token;
    }
  }
});

new Vue({
  el: "#app",
  store,
  computed: {
    getToken() {
      return this.$store.getters.user_token;
    }
  },
  router,
  render: h => h(App)
});
