<template>
  <TheHeader :currentUser="currentUser" />
  <div class="usersList">
    <div class="usersList__header">
      <h1 class="usersList__header__title">Users list</h1>
      <span class="usersList__header__btn" title="Create a new User" @click="createUser">
        <font-awesome-icon icon="plus" />
      </span>
    </div>
    <UsersTable :users="users" :currentUser="currentUser" :onDeleteUser="deleteUser" :onEditUser="editUser" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UsersService, { User } from "../services/UsersService";
import TheHeader from "../components/TheHeader.vue";
import { CurrentUser } from "../services/LoginService";
import { UnauthorizedError } from "../utils/Errors";
import UsersTable from "../components/UsersTable.vue";
import { swalConfirm, swalUserForm } from "../helpers/SwalHelper";

const usersService = new UsersService();

interface ComponentData {
  users: User[];
  currentUser: CurrentUser;
}

export default defineComponent({
  name: "LoginForm",
  data(): ComponentData {
    return {
      users: [],
      currentUser: {} as CurrentUser,
    };
  },
  created() {
    this.updateUsersList();
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!this.currentUser) {
      throw new UnauthorizedError("You must be logged in to view this page.");
    }
  },
  methods: {
    async updateUsersList() {
      this.users = await usersService.getAllUsers();
    },
    async deleteUser(user: User) {
      if (await swalConfirm("This action will permanently delete the user")) {
        await usersService.deleteUser(user);
        this.updateUsersList();
      }
    },
    async editUser(user: User) {
      let newUser = await swalUserForm(user);
      if (!newUser) return;
      await usersService.updateUser(newUser);
      this.updateUsersList();
    },
    async createUser() {
      let newUser = await swalUserForm();
      if (!newUser) return;
      await usersService.createUser(newUser);
      this.updateUsersList();
    },
  },
  components: { TheHeader, UsersTable },
});
</script>

<style scoped>
.usersList {
  padding: 1em 2em;
}
.usersList__title {
  margin-bottom: 0.5em;
}

.usersList__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1em 1em;
}

.usersList__header__btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  transition: background-color 0.15s;
}

.usersList__header__btn:hover {
  background-color: #d3d3d3;
}
</style>
