<template>
  <v-container>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <Posts :posts="posts" @delete="handleDelete" />
    <p v-if="!$fetchState.pending && posts.length == 0">
      Start following people to see posts
    </p>
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
  name: "IndexPage",
  head: {
    title: "Home",
  },
  data() {
    return {
      posts: [],
      limit: 10,
      page: 1,
      enough: false,
      loading: false,
    };
  },
  methods: {
    async getData() {
      if (this.loading) return;
      this.loading = true;
      this.page = this.page + 1;

      try {
        const res = await this.$axios.$get(
          `/post/feed?page=${this.page}&limit=${this.limit}`
        );

        this.posts = this.posts.concat(res.posts);
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
  async fetch() {
    const res = await this.$axios.$get(
      `/post/feed?limit=${this.limit}&page=${this.page}`
    );
    this.posts = res.posts;
    this.enough = res.posts.length < this.limit;
  },
  scrollToTop: false,
};
</script>
