<template>
  <video :src="video" controls></video>
</template>

<script>
export default {
  props: ["video"],
};
</script>

<style scoped>
video {
  width: 100% !important;
}
</style>
