<template>
  <v-form @submit.prevent="comment">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="text"
            :loading="submitting"
            :append-outer-icon="text ? 'mdi-send' : ''"
            prepend-icon="mdi-comment-text-outline"
            clear-icon="mdi-close-circle"
            clearable
            label="Write a comment..."
            type="text"
            :disabled:append-outer-icon="!!text"
            @click:append-outer="comment"
            @click:clear="clear"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  name: "CommentForm",

  props: ["post"],
  data: () => ({
    text: "",
    submitting: false,
  }),

  methods: {
    clear() {
      this.text = "";
    },
    async comment() {
      try {
        this.submitting = true;

        const res = await this.$axios.$post(`/post/${this.post._id}/comment`, {
          text: this.text,
        });
        this.text = "";
        this.post.comments = this.post.comments + 1;
        this.$emit("comment", res.comment);
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
