<template>
  <div>
    <Post
      v-for="post in posts"
      :key="post._id"
      :post="post"
      @delete="handleDelete"
    />
  </div>
</template>

<script>
export default {
  props: ["posts"],
  methods: {
    handleDelete(id) {
      this.$emit("delete", id);
    },
  },
};
</script>
