<template>
  <div>
    <router-view></router-view>
    <div class="form">
      <ul class="tab-group">
        <li class="tab active sign-up">
          <a href="#signup" id="sign-up">Sign Up</a>
        </li>
        <li class="tab log-in">
          <a href="#login" id="log-in">Log In</a>
        </li>
      </ul>
      <div class="tab-content">
        <div id="signup">
          <h1>Sign Up for Free</h1>
          <div>
            <div class="top-row">
              <div class="field-wrap">
                <label>
                  First Name
                  <span class="req">*</span>
                </label>
                <input type="text" required autocomplete="off" v-model="firstname">
              </div>
              <div class="field-wrap">
                <label>
                  Last Name
                  <span class="req">*</span>
                </label>
                <input type="text" required autocomplete="off" v-model="lastname">
              </div>
            </div>
            <div class="top-row">
              <div class="field-wrap">
                <label>
                  Set A Username
                  <span class="req">*</span>
                </label>
                <input type="text" required autocomplete="off" v-model="username">
              </div>
              <div class="field-wrap">
                <label>
                  Set A Password
                  <span class="req">*</span>
                </label>
                <input type="password" required autocomplete="off" v-model="password">
              </div>
            </div>
            <div class="field-wrap" v-if="this.role !== 'Teacher'">
              <label>
                Teacher
                <span class="req">*</span>
              </label>
              <input type="text" required autocomplete="off" v-model="teacher">
            </div>
            <div class="person-selector">
              <input type="button" name="person" value="Teacher" @click="makeTeacher()">
              <input type="button" name="person" value="Student" @click="makeStudent()">
            </div>
            <button
              type="submit"
              class="button button-block"
              @click="signup(username, password, firstname, lastname, teacher)"
            >Get Started</button>
          </div>
        </div>
        <div id="login">
          <h1>Welcome Back!</h1>
          <div>
            <div class="field-wrap">
              <label>
                Username
                <span class="req">*</span>
              </label>
              <input type="text" required autocomplete="off" v-model="username">
            </div>
            <div class="field-wrap">
              <label>
                Password
                <span class="req">*</span>
              </label>
              <input type="password" required autocomplete="off" v-model="password">
            </div>
            <p class="forgot">
              <a href="#">Forgot Password?</a>
            </p>
            <button class="button button-block" @click="login(username, password)">Log In</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      teacher: "",
      tokenData: "",
      role: ""
    };
  },
  methods: {
    makeTeacher() {
      this.role = "Teacher";
    },
    makeStudent() {
      this.role = "Student";
    },
    signup(username, password, firstname, lastname, teacher) {
      let url =
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student";
      if (this.role === "Teacher") {
        url = url.concat("", "/teacher");
        console.log("SIGNUP URL: " + url);
      }
      console.log("SIGNUP ROLE " + this.role);
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
          firstName: firstname,
          lastName: lastname,
          teacher: teacher
        })
      })
        .then(res => {
          console.log("SIGNUP RES " + res);
          return res.json();
        })
        .then(json => {
          console.log("SIGNUP JSON " + json);
          var response = json["status"];
          if (response == "User Already Exists") {
            alert(response);
          } else {
            alert("Signed Up!");
            this.username = username;
            this.password = password;
            this.firstname = firstname;
            this.lastname = lastname;
            this.teacher = teacher;
            this.login(username, password);
          }
        });
    },
    login(username, password) {
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        }
      )
        .then(res => {
          if (res == 400 || res == 500) {
            alert("Wrong Credentials!");
          } else {
            alert("Logged In!");
            console.log("LOGIN RES " + res);
            return res.json();
          }
        })
        .then(json => {
          var _self = this;
          _self.tokenData = json["data"];
          console.log("LOGIN JSON: " + json);
          console.log(_self.tokenData);
          this.$parent.$store.state.token = this.tokenData;
          this.getUserByUsername(username);
        });
    },
    getUserByUsername(username) {
      var _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student/username/" +
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
          this.$parent.$store.state.user = {
            username: json.data.username,
            password: json.data.password,
            firstName: json.data.firstName,
            lastName: json.data.lastName,
            teacher: json.data.teacher,
            roles: undefined
          };
          console.log(this.$parent.$store.state.user);
        });
    },
    getAll() {
      var _self = this;
      fetch(
        "http://bookmanager.us-east-2.elasticbeanstalk.com/bookmanager/student",
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: "Bearer " + _self.tokenData,
            "Content-Type": "application/json"
          }
        }
      ).then(res => {
        res.json().then(a => console.log(a));
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      $(".form")
        .find("input, textarea")
        .on("keyup blur focus change", function(e) {
          var $this = $(this),
            label = $this.prev("label");
          if (e.type === "keyup") {
            if ($this.val() === "") {
              label.removeClass("active highlight");
            } else {
              label.addClass("active highlight");
            }
          } else if (e.type === "blur") {
            if ($this.val() === "") {
              label.removeClass("active highlight");
            } else {
              label.removeClass("highlight");
            }
          } else if (e.type === "focus") {
            if ($this.val() === "") {
              label.removeClass("active highlight");
            } else if ($this.val() !== "") {
              label.addClass("highlight");
            }
          } else if (e.type === "change") {
            if ($this.val() === "") {
              label.addClass("active highlight");
            } else if ($this.val() !== "") {
              label.removeClass("highlight");
            }
          }
        });
      $(".tab a").on("click", function(e) {
        var $this = $(this);
        e.preventDefault();
        $this.parent().addClass("active");
        $this
          .parent()
          .siblings("li")
          .removeClass("active");
        var target = $this.attr("href");
        $(".tab-content > div")
          .not(target)
          .hide();
        $(target).fadeIn(600);
      });
      $("#sign-up").on(
        "click",
        function(e) {
          $("#signup input").val("");
          (this.firstname = ""),
            (this.lastname = ""),
            (this.username = ""),
            (this.password = ""),
            (this.teacher = "");
          $("#login label").removeClass("active");
        }.bind(this)
      );
      $("#log-in").on(
        "click",
        function(e) {
          $("#login input").val("");
          (this.firstname = ""),
            (this.lastname = ""),
            (this.username = ""),
            (this.password = ""),
            (this.teacher = "");
          $("#signup label").removeClass("active");
        }.bind(this)
      );
    });
  }
};
</script>

<style lang="scss">
$body-bg: #283845;
$form-bg: #13232f;
$white: #ffffff;

$main: #1ab188;
$main-light: lighten($main, 5%);
$main-dark: darken($main, 5%);

$gray-light: #a0b3b0;
$gray: #ddd;

$thin: 300;
$normal: 400;
$bold: 600;
$br: 4px;

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  overflow-y: scroll;
}

body {
  background: $body-bg;
}

a {
  text-decoration: none;
  color: $main;
  transition: 0.5s ease;
  &:hover {
    color: $main-dark;
  }
}

.form {
  background: rgba($form-bg, 0.9);
  padding: 40px;
  max-width: 600px;
  margin: 40px auto;
  border-radius: $br;
  box-shadow: 0 4px 10px 4px rgba($form-bg, 0.3);
}

.tab-group {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  li a {
    display: block;
    text-decoration: none;
    padding: 15px;
    background: rgba($gray-light, 0.25);
    color: $gray-light;
    font-size: 20px;
    float: left;
    width: 50%;
    text-align: center;
    cursor: pointer;
    transition: 0.5s ease;
    &:hover {
      background: $main-dark;
      color: $white;
    }
  }
  .active a {
    background: $main;
    color: $white;
  }
}

.tab-content > div:last-child {
  display: none;
}

h1 {
  text-align: center;
  color: $white;
  font-weight: $thin;
  margin: 0 0 40px;
}

label {
  position: absolute;
  transform: translateY(6px);
  left: 13px;
  color: rgba($white, 0.5);
  transition: all 0.25s ease;
  -webkit-backface-visibility: hidden;
  pointer-events: none;
  font-size: 22px;
  .req {
    margin: 2px;
    color: $main;
  }
}

label.active {
  transform: translateY(50px);
  left: 2px;
  font-size: 14px;
  .req {
    opacity: 0;
  }
}

label.highlight {
  color: $white;
}

input,
textarea {
  font-size: 22px;
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  background: none;
  background-image: none;
  border: 1px solid $gray-light;
  color: $white;
  border-radius: 0;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  &:focus {
    outline: 0;
    border-color: $main;
  }
}

textarea {
  border: 2px solid $gray-light;
  resize: vertical;
}

.field-wrap {
  position: relative;
  margin-bottom: 40px;
}

.top-row {
  &:after {
    content: "";
    display: table;
    clear: both;
  }

  > div {
    float: left;
    width: 48%;
    margin-right: 4%;
    &:last-child {
      margin: 0;
    }
  }
}

.button {
  border: 0;
  outline: none;
  border-radius: 0;
  padding: 15px 0;
  font-size: 2rem;
  font-weight: $bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: $main;
  color: $white;
  transition: all.5s ease;
  -webkit-appearance: none;
  &:hover,
  &:focus {
    background: $main-dark;
  }
}

.button-block {
  display: block;
  width: 100%;
}

.forgot {
  margin-top: -20px;
  text-align: right;
}
</style>
