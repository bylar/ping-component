<template>
  <p-box class="boxNode" v-on="attrsMethod" ref="boxNode">
    <slot name="title" />
    <div :style="{ opacity: opacity }" class="mapNode" ref="mapNode" />
  </p-box>
</template>

<script lang='ts'>
export default { name: 'p-map' } 
</script>
<script setup lang='ts'>
import { computed, ref, useAttrs, watch, onMounted } from 'vue';
import { loadMapSDK, MapSDK } from '.';
const attrs = useAttrs();
const opacity = ref(0);
const mapNode = ref<HTMLDivElement & { chartsContext?: echarts.ECharts }>();
const attrsMethod = computed(() => {
  const result: any = {};
  Object.entries(attrs).map(([key, attr]: [string, any]) => {
    if (typeof attr === 'function' && key.indexOf('on') === 0) {
      result[key] = attr;
    }
  });
  return result;
});
const launcher = async () => {
  if (!mapNode.value) return;
  const BMap = await loadMapSDK('');
  setTimeout(() => {
    const map = (new BMap.Map(mapNode.value, { coordsType: 5 }));
    map.setMapStyleV2({ styleId: 'c587479d4e9f6c9fced23bb82688e3f9' });
    const point = new BMap.Point(116.404, 39.915);
    map.loadMapStyleFiles(() => opacity.value = 1);
    map.centerAndZoom(point, 15);
  });
}
onMounted(async () => {


});
watch(mapNode, () => mapNode && launcher())


</script>

<style scoped>
.boxNode {
  display: flex;
  flex-direction: column;
}

::v-deep .anchorBL {
  opacity: 0;
}

::v-deep .mapNode {
  background: none !important;
}




.mapNode {
  display: block;
  position: relative;
  transition: all 0.3s;
  flex: 1;
}
</style>