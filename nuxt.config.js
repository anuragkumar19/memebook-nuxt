import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - Memebook",
    title: "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "A social media platform for memelovers",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/moment",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/toast",
    "@nuxtjs/auth-next",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "https://memebookv1.herokuapp.com/api/v1/",
  },

  toast: {
    position: "bottom-right",
    duration: 3000,
  },

  auth: {
    cookie: {
      options: {
        maxAge: 60 * 60 * 24 * 365 * 50, // 50 years
      },
    },
    redirect: {
      logout: "/login",
    },
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          property: "tokens.accessToken",
          maxAge: 60 * 9, // 9 minutes
          global: true,
          type: "Bearer",
        },
        refreshToken: {
          property: "tokens.refreshToken",
          data: "refreshToken",
          maxAge: 60 * 60 * 24 * 30 * 12 * 50, // 50 years
        },
        user: {
          property: "user",
          autoFetch: true,
        },
        endpoints: {
          login: { url: "/auth/login", method: "post" },
          refresh: { url: "/auth/refresh", method: "post" },
          user: { url: "/user", method: "get" },
          logout: false,
        },
        // autoLogout: false
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      theme_color: "#a435f0",
      background_color: "#fff",
      display: "fullscreen",
      scope: "/",
      start_url: "/",
      description: "A social media platform for memelovers",
      short_name: "Memebook",
      name: "Memebook",
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#a435f0",
          accent: colors.grey.darken3,
          secondary: "#4d007c",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    middleware: ["auth"],
  },
};
