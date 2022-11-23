<template>
  <p-box class="main" :w="1080" :h="720" :cols="[200, 600, 280]" :rows="[500, 220]">

    <p-box class="bg" @click="[col = '1-2', row = 1]" :col="1" :row="1"> </p-box>
    <p-box class="bg" @click="[col = 1, row = 2]" :col="1" :row="2"> </p-box>
    <p-box class="bg" @click="[col = 2, row = '1-2']" :col="2" :row="1" :z="0"> </p-box>
    <p-box class="bg" @click="[col = 2, row = 1]" :col="2" :row="1" :z="0"> </p-box>
    <p-box class="bg" @click="[col = 2, row = 2]" :col="2" :row="2"> </p-box>
    <p-box class="bg" @click="[col = 3, row = 1]" :col="3" :row="1"> </p-box>
    <p-box class="bg" @click="[col = 3, row = 2]" :col="3" :row="2"> </p-box>

    <p-charts :data-pool="exampleDataPool1" :col="'1-2'" :row="1">
      <template #title>
        <div class="title">标题</div>
      </template>
    </p-charts>

    <p-charts :data-pool="exampleDataPool2" :col="1" :row="2">
      <template #title>
        <div class="title">标题</div>
      </template>
    </p-charts>

    <!-- <p-charts :data-pool="exampleDataPool" :col="2" :row="2">
      <template #title>
        <div class="title">标题</div>
      </template>
    </p-charts> -->

  </p-box>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DataPoolProviderBuilder } from '../packages';
const col = ref<string | number>(1);
const row = ref<string | number>(1);

const exampleDataPool1 = DataPoolProviderBuilder<any>({
  created: (arg) => {
    arg.options = () => ({
      tooltip: {},
      xAxis: { data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'] },
      yAxis: {},
      series: [
        { name: '销量', type: 'bar', data: [1, 1, 1, 1, 1, 1].map(v => Math.floor(30 * Math.random())) }
      ]
    });
    return arg.options();
  },
  run: (arg) => arg.options(),
  timeout: 1000,
});

const exampleDataPool2 = DataPoolProviderBuilder<{ offset: number, data: any[], generelData: any, options: any }>({
  created: (arg) => {
    arg.generelData = (offset: number) => ({ name: offset, value: [offset, Math.floor(30 * Math.random())] });
    arg.data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, k) => arg.generelData(k));
    arg.offset = arg.data.length;
    arg.options = (data: any[]) => ({
      xAxis: {
        type: 'category', splitLine: { show: false },
        min: data.length - 12,
        max: data.length - 2
      },
      yAxis: {
        type: 'value', splitLine: { show: false }
      },
      series: [{ name: "test", type: 'line', showSymbol: false, data, smooth: true }]
    });
    return arg.options(arg.data) as any;
  },
  run: (arg) => {
    arg.data.push(arg.generelData(arg.offset++));
    return arg.options(arg.data) as any;
  },
  timeout: 1000
});

</script>

<style>
body {
  background: #333;
  overflow: hidden;
}

.main {
  background: #333;
}

.bg {
  border: #000 1px solid;
}
</style>
