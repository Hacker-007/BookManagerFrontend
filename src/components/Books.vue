<template>
  <div>
    <router-view></router-view>
    <div v-if="ifRolesPresent()">
      <div v-if="ifTeacher()">
        <h1>See All of Your Students</h1>
        <ul>
          <li
            v-for="(student, index) in students"
            :key="index"
          >{{student.firstName}} {{student.lastName}}</li>
        </ul>
        <input type="text" v-model="student">
        <button
          @click="addNewStudent($parent.$store.state.user.username, student)"
        >Add A New Student</button>
        <h1>Add a New Book</h1>
        <h3>Title:</h3>
        <input type="text" v-model="title">
        <h3>Author</h3>
        <input type="text" v-model="author">
        <h3>Isbn</h3>
        <input type="text" v-model="isbn">
        <button @click="addNewBook(title, author, isbn)">Add A New Book</button>
      </div>
      <div v-else>
        <h1>See All Of Your Books</h1>
        <ul>
          <li v-for="(book, index) in books" :key="index">{{book.title}}</li>
        </ul>
        <h1>Title:</h1>
        <input type="text" v-model="title">
        <button @click="checkOut($parent.$store.state.user.username, title)">Checkout A New Book</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      user: {},
      title: "",
      students: [],
      student: "",
      roles: {},
      author: "",
      isbn: null
    };
  },
  methods: {
    ifTeacher() {
      let roles = this.roles;
      if (roles == null || roles == undefined) {
        return false;
      }
      for (var i = 0; i < roles.length; i++) {
        if (
          roles[i].roleName == "ROLE_TEACHER" ||
          roles[i].roleName == "ROLE_ADMIN"
        ) {
          return true;
        }
      }
      return false;
    },
    ifRolesPresent() {
      let roles = this.roles;
      if (roles == undefined || roles == null) {
        return false;
      }
      return true;
    },
    getAllBooks(username) {
      let _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student/allBooks/" +
          username,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(json => {
          console.log("Books: " + json);
          _self.books = json;
        });
    },
    getRoles(username) {
      let _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student/roles/" +
          username,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(json => {
          console.log(json);
          this.user.roles = json;
          this.roles = json;
        });
    },
    checkOut(username, title) {
      let _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student/checkout/" +
          username +
          "/" +
          title,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$parent.$store.getters.token
          }
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          console.log(json);
          this.getAllBooks(username);
        });
    },
    getAllStudents(teacher) {
      let _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/class/allStudents/" +
          teacher,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$parent.$store.getters.token
          }
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          console.log(json);
          _self.students = json.data;
        });
    },
    addNewStudent(teacher, student) {
      let _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/class/addStudent/" +
          teacher +
          "/" +
          student,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$parent.$store.getters.token
          }
        }
      )
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(json => {
          console.log(json);
          alert("Added the student.");
          _self.getAllStudents(teacher);
        });
    },
    addNewBook(title, author, isbn) {
      let _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/book",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$parent.$store.getters.token
          },
          body: JSON.stringify({
            title: title,
            author: author,
            isbn: isbn
          })
        }
      )
        .then(res => {
          return res.json();
        })
        .then(json => {
          console.log(json);
          alert("Added a New Book");
        });
    }
  },
  mounted() {
    this.user = this.$parent.$store.state.user;
    this.getAllBooks(this.user.username);
    this.getRoles(this.user.username);
    if (this.ifTeacher()) {
      this.getAllStudents(this.user.username);
    }
  }
};
</script>

<style>
</style>
