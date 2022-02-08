<template>
  <v-container>
    <nuxt-child @sendMessage="sendMessage" :keep-alive="false" />
  </v-container>
</template>

<script>
export default {
  name: "DirectHomePage",
  data() {
    return {
      socket: null,
    };
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: "home",
      channel: "/",
      autoConnect: true,
      auth: {
        token: this.$auth.strategy.token.get(),
      },
    });
  },
  methods: {
    sendMessage(data, to) {
      this.socket.emit("sendMessage", data);
      this.$store.commit("messages/setMessages", {
        user: to._id,
        messages: [
          ...this.$store.state.messages.users[data.to].messages,
          {
            from: {
              username: this.$auth.user.username,
              name: this.$auth.user.name,
              avatar: this.$auth.user.avatar,
            },
            to: to,
            text: data.text,
            createdAt: new Date(),
          },
        ],
      });
    },
  },
};
</script>
