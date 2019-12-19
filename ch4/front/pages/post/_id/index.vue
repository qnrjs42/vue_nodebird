<template>
  <v-container v-if="post">
    <post-card :post="post" />
  </v-container>
  <div v-else>
    해당 아이디의 게시글이 존재하지 않습니다.
  </div>
</template>


<script>
/*
  pages/post/_id.vue는 URL에 'post'만 입력해도 매칭이 되는 문제가 있고(메인 페이지가 아니라 해당 게시글을 지목)
  pages/post/_id/index.vue는 URL에 'post'만 입력하면 메인페이지가 나온다
*/
  import PostCard from '~/components/PostCard';
  export default {
    components: {
      PostCard,
    },

    computed: {
      post() {
        return this.$store.state.posts.mainPosts.find(v => v.id === parseInt(this.$route.params.id, 10));
      }
    }
  }
</script>
