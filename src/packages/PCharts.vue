<template>
  <p-box class="boxNode" v-on="attrsMethod" ref="boxNode">
    <slot name="title" />
    <div class="chartsNode" ref="chartsNode" />
  </p-box>
</template>

<script lang='ts'>
export default { name: 'p-charts' } 
</script>
<script setup lang='ts'>
import * as echarts from 'echarts';
import { computed, ref, useAttrs, watch } from 'vue';
import { DataPoolProvider } from '.';
const attrs = useAttrs();
const props = defineProps<{ options?: echarts.EChartsOption, dataPool?: DataPoolProvider }>();
const chartsNode = ref<HTMLDivElement & { chartsContext?: echarts.ECharts }>();
const boxNode = ref<any>();

const attrsValue = computed(() => {
  const result: any = {};
  Object.entries(attrs).map(([key, attr]: [string, any]) => {
    if (typeof attr != 'function' || key.indexOf('on') != 0) {
      result[key] = attr;
    }
  });
  return result;
});
const attrsMethod = computed(() => {
  const result: any = {};
  Object.entries(attrs).map(([key, attr]: [string, any]) => {
    if (typeof attr === 'function' && key.indexOf('on') === 0) {
      result[key] = attr;
    }
  });
  return result;
});

const resizeObserver = new ResizeObserver((entries) => {
  entries.map((v) => (v.target as HTMLDivElement & { chartsContext?: echarts.ECharts }).chartsContext?.resize())
});

const launcher = async () => {
  if (!chartsNode.value) return;
  const chartsContext = echarts.init(chartsNode.value, undefined, { renderer: 'svg' });
  resizeObserver.observe(chartsNode.value);
  let currentDataPool: { destroy: (() => void) | null; } | null = null;
  const setOptions = async () => {
    if (props.options) {
      props.options && chartsContext.setOption(props.options);
    } else if (props.dataPool) {
      if (currentDataPool && currentDataPool.destroy) currentDataPool.destroy();
      let dataPool = await props.dataPool(options => chartsContext.setOption(options));
      currentDataPool = dataPool;
    }
  }
  watch(() => props.options, setOptions);
  watch(() => props.dataPool, setOptions);
  setOptions();
  chartsNode.value.chartsContext = chartsContext
}

watch(chartsNode, () => chartsNode && launcher())

</script>

<style scoped>
.boxNode {
  display: flex;
  flex-direction: column;
}

.chartsNode {
  display: block;
  position: relative;
  transition: all 0.3s;
  flex: 1;
}
</style>