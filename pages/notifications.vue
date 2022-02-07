<template>
  <v-container>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <main v-if="!$fetchState.pending">
      <div class="text-center" v-if="notifications.length == 0">
        <h2>No Notifications</h2>
      </div>
      <h1>Notifications</h1>
      <v-list>
        <Notification
          v-for="notification in notifications"
          :key="notification._id"
          :notification="notification"
        />
      </v-list>
    </main>
    <div class="text-center">
      <v-btn
        text
        color="primary"
        :loading="loading"
        v-if="!enough"
        @click="getData"
        class="mt-3"
      >
        Load More
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Notifications",
  head: {
    title: "Notifications",
  },
  data() {
    return {
      notifications: [],
      limit: 10,
      page: 1,
      enough: false,
      loading: false,
    };
  },
  async fetch() {
    try {
      const res = await this.$axios.$get(
        `/notification?limit=${this.limit}&page=${this.page}`
      );

      this.notifications = res.notifications;

      this.enough = this.notifications.length < this.limit;
    } catch (err) {
      this.$toast.error(err.response.data.message);
    }
  },
  methods: {
    async getData() {
      try {
        this.page = this.page + 1;
        this.loading = true;
        const res = await this.$axios.$get(
          `/notification?limit=${this.limit}&page=${this.page}`
        );

        this.notifications = this.notifications.concat(res.notifications);
        this.enough = res.notifications.length < this.limit;
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
