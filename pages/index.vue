<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Index page</h1>
      {{ $auth.loggedIn }}
      <v-btn @click="$auth.logout()">LogOut</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "IndexPage",
  methods: {
    async getUser() {
      debugger;
    },
  },
};
</script>
