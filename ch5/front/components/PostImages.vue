<template>
  <div v-if="images.length === 0"></div>
  <div v-else-if="images.length === 1">
    <!--
      contain -> 비율이 딱 맞게 들어가고 남는 공간이 생김
      cover -> 남는 공간이 없고 이미지가 잘릴 수 있음
    -->
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
    />
  </div>
  <div v-else-if="images.length === 2" style="display: flex">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
    />
    <v-img
      :src="`http://localhost:3085/${images[1].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
    />
  </div>
  <div v-else-if="images.length > 2" style="display: flex">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
    />
    <div style="flex: 1; align-items: center; justify-content: center; display: flex">
      <div style="text-align: center">
        <v-icon>mdi-dots-horizontal</v-icon>
        <div>
          더보기
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  export default {
    props: {
      images: {
        type: Array,
        required: true,
      }
    }
  }
</script>
