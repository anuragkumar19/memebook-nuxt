<template>
  <div>
    <v-app-bar color="secondary" dense dark flat>
      <v-toolbar-title class="logo-text">Memebook</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon nuxt to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon nuxt to="">
        <v-icon>mdi-plus-box</v-icon>
      </v-btn>
      <v-btn icon nuxt to="">
        <v-icon>mdi-chat</v-icon>
      </v-btn>
      <v-btn icon nuxt to="">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar size="30">
              <img :src="$auth.user.avatar" alt="" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{ $auth.user.username }}</v-list-item-title>
          </v-list-item>
          <v-list-item nuxt :to="`/user/${$auth.user.username}`">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item nuxt to="/accounts/saved">
            <v-list-item-title>Saved</v-list-item-title>
          </v-list-item>
          <v-list-item nuxt @click="() => $auth.logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<style scoped>
.logo-text {
  font-family: cursive;
  font-weight: 800;
}
</style>
