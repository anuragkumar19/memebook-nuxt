<template>
  <nuxt-child @sendMessage="sendMessage" :keep-alive="false" />
</template>

<script>
export default {
  name: "DirectHomePage",
  layout: "direct",
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
    },
  },
};
</script>
