<template>
  <div>
    <nav>
      <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/profile">Profile</nuxt-link>
      <nuxt-link to="/signup">Signup</nuxt-link>
    </nav>
    <nuxt />
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: 'NodeBird',
      }
    },
  }
</script>

<style>

</style>
