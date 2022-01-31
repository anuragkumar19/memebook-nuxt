<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
      <v-card>
        <v-card-title>Followings</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list>
            <template v-for="(following, index) in followings">
              <v-list-item
                nuxt
                :to="`/user/${following.username}`"
                :key="index"
              >
                <v-list-item-avatar>
                  <v-img :src="following.avatar"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{
                    following.username
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    following.name
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
            v-if="!$fetchState.pending && followings.length == 0"
            class="text-center py-4"
          >
            No followings
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
  name: "FollwingsPage",
  data() {
    return {
      dialog: true,
      followings: [],
    };
  },
  async fetch() {
    try {
      const res = await this.$axios.$get(
        `/user/${this.$route.params.username}/following`
      );

      this.followings = res.following;
    } catch (err) {
      this.$toast.error(err.response.data.message);
    }
  },
  head() {
    return {
      title: `${this.$route.params?.username}'s Followings - Profile`,
    };
  },
};
</script>
