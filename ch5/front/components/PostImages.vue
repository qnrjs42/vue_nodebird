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
      @click="zoomImages"
    />
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
  <div v-else-if="images.length === 2" style="display: flex">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
      @click="zoomImages"
    />
    <v-img
      :src="`http://localhost:3085/${images[1].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
      @click="zoomImages"
    />
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>
  <div v-else-if="images.length > 2" style="display: flex">
    <v-img
      :src="`http://localhost:3085/${images[0].src}`"
      contain
      aspect-ratio="2"
      style="flex: 1"
      @click="zoomImages"
    />
    <div style="flex: 1; align-items: center; justify-content: center; display: flex" @click="zoomImages">
      <div style="text-align: center">
        <v-icon>mdi-dots-horizontal</v-icon>
        <div>더보기</div>
      </div>
    </div>
    <image-zoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
  </div>

</template>

<script>
  import ImageZoom from './ImageZoom';

  export default {
    components: {
      ImageZoom,
    },

    props: {
      images: {
        type: Array,
        required: true,
      }
    },

    data() {
      return {
        imageZoomed: false,
      };
    },

    methods: {
      closeModal() {
        this.imageZoomed = false;
      },
      zoomImages() {
        this.imageZoomed = true;
      }
    },
  }
</script>
