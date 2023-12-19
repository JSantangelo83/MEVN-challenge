<template>
  <form class="loginForm" @submit.prevent="login">
    <img class="loginForm__logo" src="../assets/js-icon.png" />
    <input class="loginForm__input" type="username" v-model="username" placeholder="Username" />
    <input class="loginForm__input" type="password" v-model="password" placeholder="Password" />
    <button type="submit" class="loginForm__btn">Login</button>
  </form>
</template>

<script lang="ts">
import LoginService from "../services/LoginService";
import { defineComponent } from "vue";

const loginService = new LoginService();

interface ComponentData {
  username: string;
  password: string;
}

export default defineComponent({
  name: "LoginForm",
  data(): ComponentData {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      let data = await loginService.login({
        username: this.username,
        password: this.password,
      });

      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.currentUser));
        this.$router.push("/users");
      }
    },
  },
});
</script>

<style scoped>
.loginForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loginForm__logo {
  background-color: #202020;
  width: 100px;
  height: 100px;
  border-radius: 30%;
  margin-bottom: 4em;
}

.loginForm__input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  background-color: white;
}
</style>
