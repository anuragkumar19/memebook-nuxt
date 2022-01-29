<template>
  <v-footer class="mt-10" color="grey lighten-4" padless>
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link"
        color="black"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
      <v-col class="grey darken-2 py-4 text-center white--text" cols="12">
        &copy; {{ new Date().getFullYear() }} — <strong>Memebook</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"],
  }),
};
</script>
