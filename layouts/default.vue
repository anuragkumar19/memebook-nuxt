<template>
  <v-app>
    <NavBar v-if="$auth.loggedIn" />
    <Nuxt keep-alive />
    <Footer />
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
};
</script>

<style>
.v-application {
  background-color: #fafafa !important;
}
</style>
