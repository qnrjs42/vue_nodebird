<template>
    <v-card style="margin-bottom: 20px">
      <v-image />
      <v-card-text>
        <div>
          <h3>zecho</h3>
          <div>안녕하신가?</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="orange"><v-icon>mdi-twitter-retweet</v-icon></v-btn>
        <v-btn text color="orange"><v-icon>mdi-heart-outline</v-icon></v-btn>
        <v-btn text color="orange"><v-icon>mdi-comment-outline</v-icon></v-btn>
        <v-btn text color="orange"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
        name: 'Nuxt.js',
      }
    },
  }
</script>

<style>
</style>
