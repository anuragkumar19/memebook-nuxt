<template>
  <v-row justify="center" align="center" style="padding: 0 4rem">
    <v-row style="margin: 4rem 0" align="center" justify="center">
      <v-row style="max-width: 700px">
        <v-col md="6" sm="12" class="d-none d-md-flex">
          <v-img src="/mockup.png" />
        </v-col>
        <v-col md="6" align-self="center" sm="12">
          <v-card>
            <v-card-text style="text-align: center">
              <h1 style="margin: 1rem 0 2rem 0; font-family: cursive">
                Memebook
              </h1>
              <v-form v-model="valid" @submit.prevent="login">
                <v-container>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                    required
                    type="email"
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
                  Login
                </v-btn>
              </v-form>
              <nuxt-link
                to="/forgot-password"
                style="display: inline-block; margin: 1.2rem 0 0 0"
              >
                Forget password?
              </nuxt-link>
            </v-card-text>
          </v-card>
          <v-card style="margin: 1rem 0">
            <v-card-text>
              <p style="text-align: center; margin: 0">
                Don't have an account?
                <nuxt-link to="/signup">Sign Up</nuxt-link>
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
  name: "LoginPage",
  head: {
    title: "Login",
  },
  auth: "guest",
  data() {
    return {
      email: "",
      password: "",
      valid: false,
      submitting: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password must be at least 6 characters",
      ],
    };
  },
  methods: {
    async login() {
      try {
        this.submitting = true;

        const res = await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        });

        console.log(res);
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
