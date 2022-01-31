<template>
  <v-container>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <Post
      v-if="!$fetchState.pending && post"
      :post="post"
      :emitComment="true"
      @comment="addComment"
    />
    <NotFound v-else-if="!$fetchState.pending" />
    <Comments :comments="comments" v-if="post" @delete="deleteComment" />
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
  data() {
    return {
      post: null,
      comments: [],
      enough: false,
      limit: 10,
      page: 1,
      loading: false,
    };
  },
  methods: {
    addComment(comment) {
      this.comments.unshift(comment);
    },
    deleteComment(comment) {
      this.comments = this.comments.filter((c) => c._id !== comment);
    },
    async getData() {
      if (this.loading) return;
      this.loading = true;
      this.page = this.page + 1;

      try {
        const res = await this.$axios.$get(
          `/post/${this.post._id}/comments?page=${this.page}&limit=${this.limit}`
        );

        this.comments = this.comments.concat(res.comments);
        this.enough = res.comments.length < this.limit;
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.loading = false;
      }
    },
  },
  head: {
    title: `Post`,
  },
  async fetch() {
    try {
      this.post = (
        await this.$axios.$get(`/post/${this.$route.params.id}`)
      ).post;

      this.comments = (
        await this.$axios.$get(
          `/post/${this.post._id}/comments?limit=${this.limit}&page=${this.page}`
        )
      ).comments;

      this.enough = this.comments.length < this.limit;
    } catch (err) {
      return;
    }
  },
  head() {
    return {
      title: `${this.post?.user?.username}'s Post - Profile`,
    };
  },
};
</script>
