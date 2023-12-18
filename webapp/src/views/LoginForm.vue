<template>
  <div>
    <input type="username" v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import LoginService from "../services/LoginService";
import { defineComponent } from "vue";

const loginService = new LoginService();

export default defineComponent({
  name: "LoginForm",
  data() {
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

<style scoped></style>
