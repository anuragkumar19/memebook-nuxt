<template>
  <main>
    {{ JSON.stringify(users) }}
  </main>
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
