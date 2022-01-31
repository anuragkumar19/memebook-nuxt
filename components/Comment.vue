<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img :src="comment.user.avatar"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>
        <nuxt-link :to="`/user/${comment.user.username}`">{{
          comment.user.username
        }}</nuxt-link>
        <br />
      </v-list-item-title>
      {{ comment.text }}
      <v-list-item-subtitle>
        {{ comment.likes }} likes - {{ $moment(comment.createdAt).fromNow() }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <div class="text-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
          v-if="comment.user.username == $auth.user.username"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="comment.user.username == $auth.user.username"
              icon
              @click="() => ''"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="text"
                      :loading="submitting"
                      label="Edit comment"
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="menu = false" :loading="submitting2">
                Close
              </v-btn>
              <v-btn
                text
                color="red"
                @click="deleteComment"
                :loading="submitting2"
              >
                Delete
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="updateComment"
                :disabled="comment.text == text || !text"
                :loading="submitting2"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

      <v-btn
        :loading="submitting"
        icon
        @click="comment.isLiked ? unlike() : like()"
      >
        <v-icon v-if="!comment.isLiked">mdi-heart-outline</v-icon>
        <v-icon v-else color="red">mdi-heart</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
  props: ["comment"],
  data() {
    return {
      submitting: false,
      menu: false,
      text: this.comment.text,
      submitting2: false,
    };
  },
  methods: {
    async like() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post(
          `/comment/${this.comment._id}/like`
        );

        this.comment.isLiked = res.comment.isLiked;
        this.comment.likes = res.comment.likes;
      } catch (err) {
        //this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    async unlike() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post(
          `/comment/${this.comment._id}/unlike`
        );

        this.comment.isLiked = res.comment.isLiked;
        this.comment.likes = res.comment.likes;
      } catch (err) {
        //this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    async updateComment() {
      try {
        this.submitting2 = true;
        const res = await this.$axios.$put(`/comment/${this.comment._id}`, {
          text: this.text,
        });

        this.comment.text = res.comment.text;
        this.menu = false;
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting2 = false;
      }
    },
    async deleteComment() {
      if (confirm("Are you sure you want to delete this comment?")) {
        try {
          this.submitting2 = true;
          await this.$axios.$delete(`/comment/${this.comment._id}`);
          this.$emit("delete", this.comment._id);
        } catch (err) {
          this.$toast.error(err.response.data.message);
        }
      } else {
        this.menu = false;
      }
    },
  },
};
</script>
