<template>
  <main>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <NotFound v-else-if="!user" />
    <template v-else>
      <p
        v-for="msg in $store.state.messages.users[user._id].messages"
        :key="msg._id"
      >
        to:{{ msg.to.username }} <br />
        from: {{ msg.from.username }} <br />
        message: {{ msg.text }}
      </p>

      <input
        type="text"
        v-model="text"
        required
        @keypress.enter="sendMessage"
      />
    </template>
  </main>
</template>
<script>
export default {
  name: "PrivateChat",
  data() {
    return {
      user: null,
      messages: [],
      text: "",
      socket: null,
    };
  },
  async fetch() {
    try {
      if (this.$route.params.username !== this.$auth.user.username) {
        const res = await this.$axios.$get(
          `/user/${this.$route.params.username}`
        );

        this.user = res.user;

        const messages = (
          await this.$axios.$get(`/direct/${this.user._id}/messages`)
        ).messages;

        this.$store.commit("messages/setMessages", {
          user: this.user._id,
          messages,
        });
      }
    } catch (err) {
      return;
    }
  },
  methods: {
    sendMessage() {
      this.$emit(
        "sendMessage",
        { to: this.user._id, text: this.text },
        this.user
      );
    },
  },
};
</script>
