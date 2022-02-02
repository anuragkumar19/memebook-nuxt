<template>
  <v-row justify="center" align="center">
    <v-container class="d-flex justify-center">
      <v-card max-width="500px" width="100%" class="mt-5">
        <v-card-text class="px-4 py-5">
          <h2>Select Video(s)</h2>
          <v-form v-model="valid" @submit.prevent="addImages">
            <v-file-input
              multiple
              accept="video/*"
              label="Choose Video(s)"
              v-model="files"
              :rules="fileRules"
              full-width
              :disabled="submitting"
            ></v-file-input>
            <v-textarea
              label="Caption"
              auto-grow
              v-model="caption"
              :disabled="submitting"
            ></v-textarea>
            <v-progress-linear
              :value="progress"
              color="primary"
              class="mb-0"
              v-if="submitting"
            ></v-progress-linear>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="submitting"
            :disabled="!valid || files.length == 0"
            @click="upload"
          >
            <v-icon left dark> mdi-cloud-upload </v-icon>
            <span> Upload </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-row>
</template>
<script>
export default {
  head: {
    title: "Create Post with Videos",
  },
  data() {
    return {
      files: [],
      progress: 0,
      caption: "",
      fileRules: [
        (v) => {
          const arr = v.filter((file) => !file.type.startsWith("video/"));
          if (arr.length > 0) {
            return "Please select videos only";
          } else {
            return true;
          }
        },
      ],
      valid: false,
      submitting: false,
    };
  },
  methods: {
    async upload() {
      try {
        this.submitting = true;
        const formData = new FormData();

        formData.append("caption", this.caption);

        this.files.map((file) => {
          formData.append("videos", file);
        });

        const res = await this.$axios.$post("/post/video", formData, {
          onUploadProgress: (progressEvent) => {
            this.progress = (progressEvent.loaded / progressEvent.total) * 100;
          },
        });

        this.files = [];
        this.caption = "";
        this.progress = 0;

        this.$router.push(`/post/${res.post._id}`);
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
