<template>
  <v-row>
    <ProfilePost
      sm="6"
      md="4"
      v-for="post in posts"
      :key="post._id"
      :post="post"
    />
  </v-row>
</template>

<script>
export default {
  props: ["posts"],
};
</script>
