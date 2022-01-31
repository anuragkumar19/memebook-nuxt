<template>
  <v-list id="comments">
    <Comment
      v-for="comment in comments"
      :key="comment._id"
      :comment="comment"
      @delete="deleteComment"
    />
  </v-list>
</template>
<script>
export default {
  props: ["comments"],
  methods: {
    deleteComment(comment) {
      this.$emit("delete", comment);
    },
  },
};
</script>
