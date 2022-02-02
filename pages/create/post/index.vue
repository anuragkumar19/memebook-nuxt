<template>
  <v-row justify="center" align="center">
    <v-container class="d-flex justify-center">
      <v-card max-width="500px" width="100%">
        <v-card-text class="px-4 py-5">
          <h2 class="text-center mb-4">Create Post with</h2>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-card nuxt to="/create/post/images">
                  <v-img src="/image.jpg" />
                  <v-card-text>
                    <h3 class="text-center">Images</h3>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card nuxt to="/create/post/videos">
                  <v-img src="/video.jpg" />
                  <v-card-text>
                    <h3 class="text-center">Videos</h3>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-container>
  </v-row>
</template>
<script>
export default {
  head: {
    title: "Create Post",
  },
};
</script>
