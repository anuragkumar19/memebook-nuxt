<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
      <v-card>
        <v-card-title>Followers</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list>
            <template v-for="(follower, index) in followers">
              <v-list-item nuxt :to="`/user/${follower.username}`" :key="index">
                <v-list-item-avatar>
                  <v-img :src="follower.avatar"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ follower.username }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    follower.name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
          <div class="text-center" v-if="$fetchState.pending">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <h1
            v-if="!$fetchState.pending && followers.length == 0"
            class="text-center py-4"
          >
            No followers
          </h1>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            nuxt
            :to="`/user/${$route.params.username}`"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "FollwersPage",
  data() {
    return {
      dialog: true,
      followers: [],
    };
  },
  async fetch() {
    try {
      const res = await this.$axios.$get(
        `/user/${this.$route.params.username}/followers`
      );

      this.followers = res.followers;
    } catch (err) {
      this.$toast.error(err.response.data.message);
    }
  },
  head() {
    return {
      title: `${this.$route.params?.username}'s Followers - Profile`,
    };
  },
};
</script>
