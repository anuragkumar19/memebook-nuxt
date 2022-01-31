<template>
  <v-col cols="12">
    <v-card elevation="2" :loading="submitting">
      <v-list-item nuxt :to="`/user/${post.user.username}`">
        <v-list-item-avatar>
          <v-img :src="post.user.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ post.user.username }}</v-list-item-title>
        </v-list-item-content>
        <v-spacer></v-spacer>
        <v-btn icon @click.prevent="">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
      </v-list-item>
      <div @dblclick="like">
        <v-img
          v-if="post.mediaType == 'image' && post.media.length == 1"
          :src="post.media[0]"
        ></v-img>
        <v-carousel
          v-model="model"
          v-if="post.mediaType == 'image' && post.media.length > 1"
          hide-delimiter-background
        >
          <v-carousel-item
            v-for="(image, i) in post.media"
            :key="i"
            :src="image"
          />
        </v-carousel>
        <v-carousel
          v-model="model"
          v-if="post.mediaType == 'video' && post.media.length > 1"
          hide-delimiter-background
        >
          <v-carousel-item v-for="(video, i) in post.media" :key="i">
            <VideoPlayer :video="video" />
          </v-carousel-item>
        </v-carousel>
        <VideoPlayer
          v-if="post.mediaType == 'video' && post.media.length == 1"
          :video="post.media[0]"
        />
      </div>

      <v-card-text v-if="post.caption" @dblclick="like">
        {{ post.caption }}
      </v-card-text>
      <v-card-actions>
        <v-btn
          :loading="submitting"
          icon
          @click="post.isLiked ? unlike() : like()"
        >
          <v-icon v-if="!post.isLiked">mdi-heart-outline</v-icon>
          <v-icon v-else color="red">mdi-heart</v-icon>
        </v-btn>
        <v-btn icon nuxt :to="`/post/${post._id}#comments`">
          <v-icon>mdi-comment-outline</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          :loading="submitting2"
          @click="post.isSaved ? unsave() : save()"
        >
          <v-icon v-if="!post.isSaved">mdi-bookmark-outline</v-icon>
          <v-icon v-else>mdi-bookmark</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-text class="py-2 mt-0">
        {{ post.likes }} Likes • {{ post.comments }} Comments
        <br />
        {{ $moment(post.createdAt).fromNow() }}
        <Comments :comments="comments" @delete="deleteComment" />
        <CommentForm :post="post" @comment="addComment" />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "ProfilePost",
  props: ["post", "emitComment"],
  data() {
    return {
      model: 0,
      submitting: false,
      submitting2: false,
      comments: [],
    };
  },
  methods: {
    parseThumbnail(url) {
      const arr = url.split(".");
      arr[arr.length - 1] = "jpg";
      return arr.join(".");
    },
    async like() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post(`/post/${this.post._id}/like`);

        this.post.isLiked = res.post.isLiked;
        this.post.likes = res.post.likes;
      } catch (err) {
        //this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    async unlike() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post(`/post/${this.post._id}/unlike`);

        this.post.isLiked = res.post.isLiked;
        this.post.likes = res.post.likes;
      } catch (err) {
        // this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    async save() {
      try {
        this.submitting2 = true;
        const res = await this.$axios.$post(`/post/${this.post._id}/save`);

        this.post.isSaved = true;
        this.$toast.success(res.message);
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting2 = false;
      }
    },
    async unsave() {
      try {
        this.submitting2 = true;
        const res = await this.$axios.$post(`/post/${this.post._id}/unsave`);

        this.post.isSaved = false;
        this.$toast.success(res.message);
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting2 = false;
      }
    },
    addComment(comment) {
      if (this.emitComment) {
        this.$emit("comment", comment);
        return;
      }
      this.comments.push(comment);
    },
    deleteComment(comment) {
      this.comments = this.comments.filter((c) => c._id !== comment);
    },
  },
};
</script>
