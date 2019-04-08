<template>
  <header>
    <div class="headerContainer">
      <h1 class="logo"></h1>
      <nav>
        <ul>
          <li v-for="(tab, index) in tabs" v-bind:key="index">
            <router-link :to="tab.path">{{tab.name}}</router-link>
          </li>
          <li>
            <a href @click="signout()">Sign Out</a>
          </li>
          <li v-for="(tab, index) in authenticatedTabs" v-bind:key="index">
            <router-link :to="tab.path" v-if="authenticated()">{{tab.name}}</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { path: "/", name: "Home" },
        { path: "signuplogin", name: "Sign Up / Login" }
      ],
      authenticatedTabs: [{ path: "books", name: "Manage" }]
    };
  },
  methods: {
    authenticated() {
      return this.$parent.$store.getters.token != "";
    },
    signout() {
      console.log(this.$parent.$store.getters.token);
      this.$parent.$store.getters.token == "";
      console.log(this.$parent.$store.getters.token);
    }
  }
};
</script>

<style>
body {
  margin: 0;
  background-color: #283845;
  font-family: monospace;
  font-weight: 600;
}

.headerContainer {
  width: 80%;
  margin: 0 auto;
}

header {
  background: rgba(192, 192, 192, 1);
}

header::after {
  content: "";
  display: table;
  clear: both;
}

.logo {
  float: left;
  padding: 10px 0;
}

nav {
  float: right;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;
  margin-left: 70px;
  padding-top: 23px;

  position: relative;
}

nav a {
  color: #000;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
}

nav a:hover {
  color: #000;
}

nav a::before {
  content: "";
  display: block;
  height: 5px;
  background-color: #000;

  position: absolute;
  top: 0;
  width: 0%;

  transition: all ease-in-out 300ms;
}

nav a:hover::before {
  width: 100%;
}
</style>