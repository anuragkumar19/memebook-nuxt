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
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click.prevent icon v-bind="attrs" v-on="on" Dropdown>
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item nuxt :to="`/post/${post._id}`">
              <v-list-item-title>Go to post</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Copy Link</v-list-item-title>
            </v-list-item>
            <template v-if="post.user.username == $auth.user.username">
              <v-list-item @click="deletePost">
                <v-list-item-title style="color: red">Delete</v-list-item-title>
              </v-list-item>
              <v-list-item @click="modal = true">
                <v-list-item-title>Edit Caption</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
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

      <v-card-text v-if="post.caption" @dblclick="like" style="color: #000">
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
      <v-row justify="center" v-if="post.user.username == $auth.user.username">
        <v-dialog v-model="modal" persistent max-width="500">
          <v-card>
            <v-card-title class="text-h5"> Edit Caption </v-card-title>
            <v-card-text>
              <v-textarea
                label="Caption"
                auto-grow
                v-model="caption"
                :disabled="submitting3"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="modal = false"
                :loading="submitting3"
              >
                Close
              </v-btn>
              <v-btn
                color="secondary"
                text
                @click="updatePost"
                :disabled="post.caption == caption"
                :loading="submitting3"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
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
      modal: false,
      caption: this.post.caption,
      submitting: false,
      submitting2: false,
      submitting3: false,
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
    async deletePost() {
      if (!confirm("Are you sure you want to delete this post?")) return;

      try {
        this.$toast.show("Deleting post...");
        const res = await this.$axios.$delete(`/post/${this.post._id}`);
        this.$toast.success(res.message);
        this.$emit("delete", this.post._id);
      } catch (err) {
        this.$toast.error(err.response.data.message);
      }
    },
    async updatePost() {
      try {
        this.submitting3 = true;
        this.$toast.show("Updating post...");
        const res = await this.$axios.$put(`/post/${this.post._id}`, {
          caption: this.caption,
        });
        this.$toast.success(res.message);
        this.post.caption = this.caption;
        this.modal = false;
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting3 = false;
      }
    },
  },
};
</script>
