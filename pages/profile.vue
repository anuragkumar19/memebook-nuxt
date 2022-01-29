<template>
  <v-container>
    <v-row class="px-6 py-6">
      <v-col cols="4" class="text-center">
        <v-img :src="$auth.user.avatar" style="border-radius: 50%" />
        <v-btn color="secondary" icon nuxt to="/profile/upload-avatar"
          ><v-icon>mdi-camera</v-icon></v-btn
        >
      </v-col>
      <v-col cols="8">
        <h1 style="font-weight: 300" class="mb-3">
          {{ $auth.user.username }}
          <v-btn nuxt class="ml-3" small outlined to="/profile/edit"
            >Edit Profile</v-btn
          >
          <v-btn class="ml-3" small icon>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </h1>
        <h4 class="mb-3">
          <span>{{ $auth.user.postsCount }} Posts</span>
          <v-btn text>{{ $auth.user.followers }} Followers</v-btn>
          <v-btn text>{{ $auth.user.following }} Following</v-btn>
        </h4>
        <h3>
          {{ $auth.user.name }}
        </h3>
        <pre>{{ $auth.user.bio }}</pre>
        <a :href="$auth.user.website" v-if="$auth.user.website">{{
          $auth.user.website
        }}</a>
      </v-col>
    </v-row>
    <v-divider class="mt-4" />
    <h2 class="my-3">Posts</h2>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <ProfilePosts :posts="posts" v-else />
    <nuxt-child />
  </v-container>
</template>

<script>
export default {
  name: "ProfilePage",
  head: {
    title: "Profile",
  },
  data() {
    return {
      posts: [],
    };
  },
  async fetch() {
    this.posts = (
      await this.$axios.$get(`/user/${this.$auth.user.username}/posts`)
    ).posts;
  },
};
</script>
