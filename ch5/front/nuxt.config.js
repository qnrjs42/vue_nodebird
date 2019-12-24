export default {
  head: {
    title: 'NodeBird',
  },

  modules: [
    '@nuxtjs/axios',
  ],

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  vuetify: {

  },

  axios: {
    browserBaseURL: 'http://localhost:3085', // 클라이언트에서 서버로 요청
    baseURL: 'http://localhost:3085', // 서버에서 클라이언트로 요청
    https: false,
  },
}
