<template>
  <header class="header">
    <h1>Welcome, {{ currentUser.username }}!</h1>
    <button @click="logout">Logout</button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UnauthorizedError } from "../utils/Errors";
import { CurrentUser } from "../services/LoginService";

interface ComponentData {
  currentUser: CurrentUser;
}

export default defineComponent({
  name: "TheHeader",
  data(): ComponentData {
    return {
      currentUser: {} as CurrentUser,
    };
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!this.currentUser) {
      throw new UnauthorizedError("You must be logged in to view this page.");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      this.$router.push("/login");
    },
  },
});
</script>

<style scoped>
</style>
