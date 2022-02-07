<template>
  <v-container>
    <h1>Saved Posts</h1>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <Posts :posts="posts" @delete="handleDelete" />
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
  name: "SavedPostPage",
  head: {
    title: `Saved Posts`,
  },
  data() {
    return {
      posts: [],
      limit: 5,
      page: 1,
      enough: false,
      loading: false,
    };
  },
  async fetch() {
    try {
      this.posts = (
        await this.$axios.$get(
          `/user/saved?limit=${this.limit}&page=${this.page}`
        )
      ).savedPosts;
      this.enough = this.posts.length < this.limit;
    } catch (err) {
      this.$toast.error(err.response.data.message);
    }
  },
  methods: {
    async getData() {
      if (this.loading) return;
      this.loading = true;
      this.page = this.page + 1;

      try {
        const res = await this.$axios.$get(
          `/user/saved?limit=${this.limit}&page=${this.page}`
        );

        this.posts = this.posts.concat(res.savedPosts);
        this.enough = res.posts.length < this.limit;
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.loading = false;
      }
    },
    handleDelete(id) {
      this.posts = this.posts.filter((post) => post._id !== id);
    },
  },
};
</script>
