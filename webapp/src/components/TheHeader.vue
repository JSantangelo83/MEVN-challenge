<template>
  <header class="header">
    <h2 class="header__msg">Welcome back, {{ currentUser.username }}!</h2>
    <button class="header__logoutBtn" @click="logout">Logout</button>
  </header>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { CurrentUser } from "../services/LoginService";

export default defineComponent({
  name: "TheHeader",
  props: {
    currentUser: {
      type: Object as PropType<CurrentUser>,
      required: true,
    },
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2em;
  background-color: #e6e3e3;
}
</style>
