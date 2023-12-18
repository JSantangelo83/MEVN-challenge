<template>
  <div class="usersTable">
    <div class="usersTable__header">
      <span class="usersTable__header__title">Username</span>
      <span class="usersTable__header__title">Created At</span>
      <span class="usersTable__header__title">Is Admin</span>
      <span class="usersTable__header__title__actions">Actions</span>
    </div>
    <div class="usersTable__item" v-for="user in users">
      <span class="usersTable__item__text">{{ user.username }}</span>
      <span class="usersTable__item__text">{{ user.createdAt }}</span>
      <span
        class="usersTable__item__icon"
        :class="{
          'usersTable__item__icon--green': user.isAdmin,
          'usersTable__item__icon--red': !user.isAdmin,
        }"
      >
        <font-awesome-icon :icon="user.isAdmin ? 'check' : 'xmark'" />
      </span>
      <div class="usersTable__item__actions">
        <span 
        @click="onEditUser(user)"
        class="usersTable__item__btn usersTable__item__btn--blue"
        title="Edit User"
        >
          <font-awesome-icon icon="pen-to-square" />
        </span>
        <span 
        @click="onDeleteUser(user)"
        class="usersTable__item__btn usersTable__item__btn--red"
        title="Delete user"
        >
          <font-awesome-icon icon="trash" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CurrentUser } from "../services/LoginService";
import { User } from "../services/UsersService";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  name: "UsersTable",
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
    currentUser: {
      type: Object as PropType<CurrentUser>,
      required: true,
    },
    onDeleteUser: {
      type: Function as PropType<(user: User) => void>,
      required: true,
    },
    onEditUser: {
      type: Function as PropType<(user: User) => void>,
      required: true,
    },
  },
});
</script>

<style scoped>
.usersTable {
  background-color: #e6e3e3;
  border-radius: 3px;
}

.usersTable__item,
.usersTable__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1em 1em;
}

.usersTable__header {
  border-bottom: 1px solid #000;
  font-weight: bold;
}

.usersTable__header__title,
.usersTable__item__text,
.usersTable__item__actions,
.usersTable__item__icon {
  flex: 1;
  text-align: center;
}

.usersTable__header__title__actions {
  flex: 1;
  text-align: right;
}
.usersTable__item {
  transition: background-color 0.15s;
}
.usersTable__item:hover {
  /* cursor: pointer; */
  background-color: #d3d3d3;
}

.usersTable__item__icon {
  font-size: 1.5em;
}

.usersTable__item__icon--green {
  color: #28a745;
}

.usersTable__item__icon--red {
  color: #dc3545;
}

.usersTable__item__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.usersTable__item__btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  transition: background-color 0.15s;
}
.usersTable__item__btn--blue:hover {
  background-color: #bfbfbf;
}

.usersTable__item__btn--red:hover {
  background-color: #f35262;
}
</style>
