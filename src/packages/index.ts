//组件都写在这个数组中方便管理
const componentList: any[] = []

import PBox from './PBox.vue';
componentList.push(PBox);

import ECharts from './PCharts.vue';
componentList.push(ECharts);
import * as echarts from 'echarts';
export type DataPoolProvider = (reslove: (options: echarts.EChartsOption) => void) => Promise<{ destroy: null | (() => void) } | null>;
export function DataPoolProviderBuilder<T>(param: {
  created?: (args: T) => Promise<echarts.EChartsOption> | echarts.EChartsOption,
  run?: (args: T) => echarts.EChartsOption,
  timeout?: number,
  destroy?: (args: T) => void,
}) {
  return async (reslove: (options: echarts.EChartsOption) => void) => {
    let args: any = {};
    let interval: number | undefined = undefined;
    const tryReslove = async (options: echarts.EChartsOption | Promise<echarts.EChartsOption>) => {
      if (options instanceof Promise) options = await options;
      if (options) reslove(options);
    }
    param.created && await tryReslove(param.created(args));
    param.run && (interval = setInterval(async () => {
      if (!param.run) return;
      await tryReslove(param.run(args));
    }, param.timeout || 0));
    const destroy = () => {
      param.destroy && param.destroy(args);
      typeof interval === 'number' && clearInterval(interval);
    }
    return { destroy };
  }
}
export default (Vue: any) => {
  componentList.forEach(com => {
    Vue.component(com.name, com)
  })
}
