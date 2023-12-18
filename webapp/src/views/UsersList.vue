<template>
  <TheHeader />
  <h1>This is the Users list!</h1>
  <div>
    Users list
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.username }} - {{ user.isAdmin }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UsersService, { User } from "../services/UsersService";
import TheHeader from "../components/TheHeader.vue";

const usersService = new UsersService();

interface ComponentData {
  users: User[];
}

export default defineComponent({
  name: "LoginForm",
  data(): ComponentData {
    return {
      users: [],
    };
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    async getAllUsers() {
      this.users = await usersService.getAllUsers();
    },
  },
  components: { TheHeader },
});
</script>

<style scoped></style>
