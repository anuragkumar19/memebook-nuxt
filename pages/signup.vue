<template>
  <v-row justify="center" align="center" style="padding: 0 4rem">
    <v-row style="margin: 4rem 0" align="center" justify="center">
      <v-row class="custom-row">
        <v-col md="6" sm="12" class="d-none d-md-flex">
          <v-img src="/mockup.png" />
        </v-col>
        <v-col md="6" align-self="center" sm="12">
          <v-card>
            <v-card-text style="text-align: center">
              <h1 style="margin: 1rem 0 2rem 0; font-family: cursive">
                Memebook
              </h1>
              <v-form v-model="valid" @submit.prevent="signup">
                <v-container>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                    required
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Full Name"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    label="Username"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-container>
                <v-btn
                  type="submit"
                  color="primary"
                  block
                  :disabled="!valid"
                  :loading="submitting"
                >
                  Create Account
                </v-btn>
              </v-form>
              <p style="display: inline-block; margin: 1.2rem 0 0 0">
                By signing up, you agree to our Terms , Data Policy and Cookies
                Policy .
              </p>
            </v-card-text>
          </v-card>
          <v-card style="margin: 1rem 0">
            <v-card-text>
              <p style="text-align: center; margin: 0">
                Already have an account?
                <nuxt-link to="/login">Login</nuxt-link>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
  </v-row>
</template>

<script>
export default {
  name: "SignUpPage",
  auth: "guest",
  data() {
    return {
      email: "",
      password: "",
      username: "",
      name: "",
      valid: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password must be at least 6 characters",
      ],
      nameRules: [
        (v) => !!v || "Full Name is required",
        (v) => v.length >= 3 || "Full Name must be at least 3 characters",
      ],
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => v.length >= 3 || "Username must be at least 3 characters",
        (v) => /^[a-zA-Z0-9]+$/.test(v) || "Username must be 0-9 and a-z",
      ],
      submitting: false,
    };
  },
  methods: {
    async signup() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post("/auth/signup", {
          email: this.email,
          password: this.password,
          username: this.username,
          name: this.name,
        });

        this.$store.commit("setSignupEmail", this.email);
        this.$router.push("/verify-email");
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
.custom-row {
  max-width: 700px;
}

@media (max-width: 960px) {
  .custom-row {
    max-width: 450px;
  }
}
</style>
