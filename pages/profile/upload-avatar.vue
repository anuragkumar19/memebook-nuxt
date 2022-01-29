<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Upload Profile Picture</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" v-if="step == 1">
              <v-file-input
                accept="image/*"
                label="Choose Image"
                v-model="file"
                :rules="fileRules"
              ></v-file-input>
            </v-form>
            <cropper
              class="cropper"
              :src="img"
              :stencil-props="{
                aspectRatio: 10 / 10,
              }"
              v-if="step == 2"
              @change="change"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            nuxt
            to="/profile"
            :loading="submitting"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!valid"
            @click="next"
            v-if="step == 1"
          >
            Next
            <v-icon right dark> mdi-chevron-right </v-icon>
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="upload"
            v-if="step == 2"
            :loading="submitting"
          >
            Upload
            <v-icon right dark> mdi-cloud-upload </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  head: {
    title: "Upload Profile Picture",
  },
  components: {
    Cropper,
  },
  data() {
    return {
      step: 1,
      valid: false,
      submitting: false,
      dialog: true,
      file: null,
      finalFile: null,
      img: null,
      image: null,
      fileRules: [
        (v) => {
          if (!v) {
            return "Please choose an image";
          } else if (!v.type.startsWith("image/")) {
            return "File must be an image";
          } else {
            return true;
          }
        },
      ],
    };
  },
  methods: {
    async next() {
      this.img = URL.createObjectURL(this.file);
      this.step = this.step + 1;
    },
    change(image) {
      this.image = image;
    },
    async upload() {
      this.image.canvas.toBlob(async (blob) => {
        blob.lastModifiedDate = new Date();
        blob.name = "profile.png";
        this.finalFile = blob;

        const formData = new FormData();

        formData.append("avatar", this.finalFile);

        try {
          this.submitting = true;
          await this.$axios.$put("/user/avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.$toast.success("Profile picture updated successfully");
          await this.$auth.fetchUser();
          this.$router.push("/profile");
        } catch (err) {
          this.$toast.error(err.response.data.message);
        } finally {
          this.submitting = false;
        }
      });
    },
  },
};
</script>
