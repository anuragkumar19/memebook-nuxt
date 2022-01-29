<template>
  <v-col sm="6" md="4">
    <v-card elevation="0" nuxt :to="`/post/${post._id}`">
      <v-img
        class="align-end"
        :src="post.media[0]"
        v-if="post.mediaType == 'image'"
        style="color: #fff"
      >
        <v-card-title v-if="post.media.length > 1">
          <v-icon style="color: #fff">mdi-image-multiple</v-icon>
        </v-card-title>
      </v-img>
      <v-img
        class="white--text align-end"
        :src="parseThumbnail(post.media[0])"
        v-else
      >
        <v-card-title>
          <v-icon style="color: #fff" v-if="post.media.length == 1"
            >mdi-play-box</v-icon
          >
          <v-icon style="color: #fff" v-else>mdi-play-box-multiple</v-icon>
        </v-card-title>
      </v-img>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "ProfilePost",
  props: ["post"],
  methods: {
    parseThumbnail(url) {
      const arr = url.split(".");
      arr[arr.length - 1] = "jpg";
      return arr.join(".");
    },
  },
};
</script>
