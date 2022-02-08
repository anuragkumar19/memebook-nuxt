<template>
  <div>
    <div>
      <v-app-bar color="primary" dense dark>
        <v-toolbar-title>
          <nuxt-link
            style="color: #fff !important"
            :to="`/user/${!user ? '' : user.username}`"
          >
            {{ !user ? "" : user.name }}
          </nuxt-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon nuxt to="/direct">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-container>
      <div class="text-center" v-if="$fetchState.pending">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <NotFound v-else-if="!user" />
      <div v-else class="pt-15">
        <div
          v-for="message in $store.state.messages.users[user._id].messages"
          :key="message._id"
          :class="`msg ${
            message.from._id == $auth.user._id ? 'right' : 'left'
          }`"
        >
          <div class="data-meta">
            <span class="meta-name">{{
              message.from._id == $auth.user._id ? "You" : message.from.name
            }}</span
            ><span class="meta-time">
              {{ "   " }}
              {{ $moment(message.createdAt).format("h:mm a") }}
            </span>
          </div>
          <div>{{ message.text }}</div>
        </div>
        <div class="fixed">
          <v-text-field
            v-model="text"
            :append-outer-icon="text ? 'mdi-send' : ''"
            clear-icon="mdi-close-circle"
            clearable
            label="Message"
            type="text"
            filled
            :disabled:append-outer-icon="!!text"
            @click:append-outer="sendMessage"
            @click:clear="clear"
            @keypress.enter="sendMessage"
            class="input-full-width mb-0"
          ></v-text-field>
        </div>
      </div>
      <div class="msg right bg-white" style="height: 100px"></div>
    </v-container>
  </div>
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

        await this.$axios.$post(`/direct/${this.user._id}`);
      }
    } catch (err) {
      return;
    }
  },
  methods: {
    sendMessage() {
      const text = this.text.trim();

      if (!text) return;

      this.$emit(
        "sendMessage",
        { to: this.user._id, text: this.text },
        this.user
      );
      this.text = "";
    },
    clear() {
      this.text = "";
    },
  },
  watch: {
    "$store.state.messages.users": {
      handler() {
        const body = this.$el.querySelector("body");
        if (body) {
          body.scrollTop = body.scrollHeight;
        }
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  padding: 0 1rem;
  background: #fff;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.msg {
  margin-bottom: 8px;
  padding: 0.6rem 1rem;
  max-width: 90%;
  text-align: justify;
  border-radius: 0 4px 4px 4px;
  letter-spacing: 0.4px;
  word-wrap: break-word;
  animation-name: appear;
  animation-iteration-count: 1;
  animation-duration: 0.4s;
  animation-timing-function: linear;
}

.msg.left {
  background: #a435f0;
  border-radius: 0 4px 4px 4px;
  color: #fff;
  margin-left: 5px;
  float: left;
  clear: both;
  transform-origin: top left;
}

.msg.right {
  background: #ccc;
  border-radius: 4px 4px 0 4px;
  color: #000;
  margin-right: 5px;
  float: right;
  clear: both;
  transform-origin: bottom right;
}

.msg .data-meta {
  margin-bottom: 5px;
  font-size: 13px;
}

.msg .data-meta .meta-name {
  font-weight: bold;
}

.msg .data-meta .meta-time {
  color: #000;
}

.bg-white {
  background: #fafafa !important;
}
</style>
