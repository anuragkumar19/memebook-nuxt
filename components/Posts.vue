<template>
  <div>
    <Post v-for="post in posts" :key="post._id" :post="post" />
  </div>
</template>

<script>
export default {
  props: ["posts"],
};
</script>
