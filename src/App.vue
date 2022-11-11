<script setup lang="ts">
import PBox from './components/PBox/index.vue';
</script>
<template>
  <p-box style="height: 100px;background-color: aqua;width: 100px;">
    <p-box :origin="'center'" :x="'50%'" :y="'50%'" style="height: 100px;background-color: aquamarine;width: 60px;">
    </p-box>
  </p-box>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
