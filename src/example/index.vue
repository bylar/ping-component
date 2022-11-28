<template>
  <p-box class="main" :w="1080" :h="720" :cols="[240, 600, 240]" :rows="[480, 240]">

    <p-map :col="'1-3'" :row="'1-2'" :z="1"> </p-map>

    <p-charts :shrink="5" class="item" :data-pool="exampleDataPool3" :col="1" :row="2" :z="2">
      <template #title>
        <div class="title">饼状图</div>
      </template>
    </p-charts>

    <p-charts :shrink="5" class="item" :data-pool="exampleDataPool1" :col="3" :row="1" :z="2">
      <template #title>
        <div class="title">柱状图</div>
      </template>
    </p-charts>

    <p-charts :shrink="5" class="item" :data-pool="exampleDataPool2" :col="2" :row="2" :z="2">
      <template #title>
        <div class="title">折线图</div>
      </template>
    </p-charts>

    <p-charts :shrink="5" class="item" :data-pool="exampleDataPool4" :col="3" :row="2" :z="2">
      <template #title>
        <div class="title">环状图</div>
      </template>
    </p-charts>

  </p-box>
</template>

<script setup lang="ts">
import { DataPoolProviderBuilder } from '../packages';

const exampleDataPool1 = DataPoolProviderBuilder<any>({
  created: (arg) => {
    arg.options = () => ({
      darkMode: 'auto',
      tooltip: {},
      xAxis: { data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'] },
      yAxis: {},
      series: [
        { name: '销量', type: 'bar', data: [1, 1, 1, 1, 1, 1].map(v => Math.floor(30 * Math.random())), color: "rgb(42 180 174)" }
      ]
    });
    return arg.options();
  },
  run: (arg) => arg.options(),
  timeout: 1000,
});

const exampleDataPool2 = DataPoolProviderBuilder<{ offset: number, data: any[], generelData: any, options: any }>({
  created: (arg) => {
    arg.generelData = (offset: number) => ({ name: offset, value: [offset, Math.floor(30 * Math.random())], });
    arg.data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, k) => arg.generelData(k));
    arg.offset = arg.data.length;
    arg.options = (data: any[]) => ({
      darkMode: 'auto',
      xAxis: {
        type: 'category', splitLine: { show: false },
        min: data.length - 12,
        max: data.length - 2
      },
      yAxis: {
        type: 'value', splitLine: { show: false }
      },
      series: [{ name: "test", type: 'line', showSymbol: false, data, smooth: true, color: "rgb(42 180 174)" }]
    });
    return arg.options(arg.data) as any;
  },
  run: (arg) => {
    arg.data.push(arg.generelData(arg.offset++));
    return arg.options(arg.data) as any;
  },
  timeout: 1000
});

const exampleDataPool3 = DataPoolProviderBuilder<{ offset: number, data: any[], generelData: any, options: any }>({
  created: (arg) => {
    arg.options = (data: any[]) => ({
      darkMode: 'auto',
      legend: { top: '5%', left: 'center', textStyle: { color: "rgb(42, 180, 174)" } },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          color: ['#e3cb20', 'rgb(42, 180, 174)'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 5, },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: '28', color: "#fff" } },
          labelLine: { show: false },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    });
    return arg.options(arg.data) as any;
  },
});

const exampleDataPool4 = DataPoolProviderBuilder<{ offset: number, data: any[], generelData: any, options: any }>({
  created: (arg) => {
    arg.data = [
      {
        value: 20,
        name: 'Perfect',
        title: {
          offsetCenter: ['0%', '-30%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '-20%']
        }
      },
      {
        value: 40,
        name: 'Good',
        title: {
          offsetCenter: ['0%', '0%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '10%']
        }
      },
      {
        value: 60,
        name: 'Commonly',
        title: {
          offsetCenter: ['0%', '30%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '40%']
        }
      }
    ];
    arg.options = (data: any[]) => ({
      darkMode: 'auto',
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: {} },
          axisLine: { show: false, lineStyle: { width: 13 } },
          splitLine: { show: false, distance: 0, length: 10 },
          axisTick: { show: false },
          axisLabel: { show: false, distance: 50 },
          data: arg.data,
          title: { fontSize: 12, color: "#fff", },
          detail: { fontSize: 12, color: 'auto', borderColor: 'auto', borderRadius: 20, formatter: '{value}%' }
        }
      ]
    });
    return arg.options(arg.data) as any;
  },
  run: (arg) => {
    arg.data[0].value = +(Math.random() * 100).toFixed(2);
    arg.data[1].value = +(Math.random() * 100).toFixed(2);
    arg.data[2].value = +(Math.random() * 100).toFixed(2);
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

.item {
  background: linear-gradient(45deg, #66ccff1c, transparent, #66ccff1c);
  background-color: rgb(0 0 0 / 78%);
  border-radius: 5px;
  overflow: hidden;
}

.title {
  width: 100%;
  display: flex;
  justify-content: center;
  color: rgb(42, 180, 174);
  font-weight: 900;
  height: 32px;
  font-size: 1.2em;
  align-items: center;
  background: linear-gradient(45deg, #66ccff1c, transparent, #66ccff1c);
  background-color: #2ab4ae21;
}
</style>
