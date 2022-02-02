<template>
  <v-row justify="center" align="center">
    <v-container class="d-flex justify-center">
      <v-card max-width="500px" width="100%" class="mt-5">
        <v-card-text class="px-4 py-5" v-if="step == 1">
          <h2>Select Images</h2>
          <v-form v-model="valid" @submit.prevent="addImages">
            <v-file-input
              multiple
              accept="image/*"
              label="Choose Image"
              v-model="files"
              :rules="fileRules"
              full-width
            ></v-file-input>
            <div style="text-align: right">
              <v-btn
                color="primary"
                :disabled="!valid || files.length == 0"
                type="submit"
              >
                Add
              </v-btn>
            </div>
          </v-form>
          <v-row class="my-3">
            <v-col cols="6" md="4" v-for="(image, i) in images" :key="i">
              <v-card flat>
                <v-img :src="createUrl(image)" />
                <v-card-actions class="del-btn">
                  <v-btn
                    dark
                    color="red darken-1"
                    small
                    @click="removeImage(i)"
                  >
                    <v-icon> mdi-close </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-if="step == 2">
          <v-carousel hide-delimiters height="auto" v-if="images.length > 1">
            <v-carousel-item v-for="(image, i) in images" :key="`ci-${i}`">
              <cropper
                class="cropper"
                :src="createUrl(image)"
                :stencil-props="{
                  aspectRatio: 5 / 4,
                }"
                @change="(img) => change(img, i)"
              />
            </v-carousel-item>
          </v-carousel>
          <cropper
            v-else
            class="cropper"
            :src="createUrl(images[0])"
            :stencil-props="{
              aspectRatio: 5 / 4,
            }"
            @change="(img) => change(img, 0)"
          />
        </v-card-text>
        <v-card-text v-if="step == 3">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            nuxt
            :to="`/user/${$auth.user.username}`"
            :loading="submitting"
          >
            Back to Profile
          </v-btn>
          <v-btn
            color="primary"
            text
            :disabled="images.length == 0"
            @click="next"
            v-if="step != 3"
          >
            Next
            <v-icon right dark> mdi-chevron-right </v-icon>
          </v-btn>
          <v-btn v-else color="primary" :disabled="submitting" @click="upload">
            <v-icon left dark> mdi-cloud-upload </v-icon>
            <span v-if="submitting"> Uploading... </span>
            <span v-else> Upload </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-row>
</template>
<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  head: {
    title: "Create Post with Images",
  },
  components: {
    Cropper,
  },
  data() {
    return {
      files: [],
      images: [],
      croppedImage: {},
      blobs: [],
      caption: "",
      progress: 0,
      step: 1,
      cropStep: 1,
      fileRules: [
        (v) => {
          const arr = v.filter((file) => !file.type.startsWith("image/"));
          if (arr.length > 0) {
            return "Please select images only";
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
    addImages() {
      this.images = [...this.files, ...this.images];
      this.files = [];
    },
    createUrl(file) {
      return URL.createObjectURL(file);
    },
    removeImage(i) {
      this.images.splice(i, 1);
    },
    back() {
      this.step = this.step - 1;
    },
    next() {
      if (this.step == 2) {
        for (let key in this.croppedImage) {
          this.croppedImage[key].canvas.toBlob((blob) => {
            blob.lastModifiedDate = new Date();
            blob.name = `post-${key}.png`;
            this.blobs.push(blob);
          });
        }
      }
      this.step = this.step + 1;
    },
    change(img, i) {
      this.croppedImage[i] = img;
    },
    async upload() {
      try {
        this.submitting = true;
        const formData = new FormData();

        formData.append("caption", this.caption);

        for (let i = 0; i < this.blobs.length; i++) {
          formData.append("images", this.blobs[i]);
        }

        const res = await this.$axios.$post("/post/image", formData, {
          onUploadProgress: (progressEvent) => {
            this.progress = (progressEvent.loaded / progressEvent.total) * 100;
          },
        });

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
<style scoped>
.del-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
