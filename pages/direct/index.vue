<template>
  <div>
    <NavBar />
    <v-container>
      <v-list>
        <v-list-item
          v-for="user in users"
          :key="user._id"
          nuxt
          :to="`/direct/${user.username}`"
        >
          <v-list-item-avatar>
            <v-img :src="user.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ user.name }}
              <br />
            </v-list-item-title>
            <p
              :style="`font-weight: ${
                user.lastMessage.seen || user.lastMessage.from == $auth.user._id
                  ? ''
                  : 'bolder'
              }`"
            >
              {{ user.lastMessage.from == $auth.user._id ? "You" : user.name }}
              :
              {{ user.lastMessage.text }}
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "MainInbox",
  data() {
    return {
      users: [],
    };
  },
  async fetch() {
    const res = await this.$axios.$get("/direct/users");
    this.users = res.users;
  },
};
</script>
