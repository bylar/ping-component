//组件都写在这个数组中方便管理
const componentList: any[] = []

import PBox from './PBox.vue';
componentList.push(PBox);
import PMap from './PMap.vue';
componentList.push(PMap);
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
export interface MapSDK { CopyrightControl: BMapGL.CopyrightControl; ScaleControl: BMapGL.ScaleControl; MapTypeControl: BMapGL.MapTypeControl; ZoomControl: BMapGL.ZoomControl; DistanceTool: BMapGL.DistanceTool; ContextMenu: BMapGL.ContextMenu; MenuItem: BMapGL.MenuItem; Animation: BMapGL.Animation; Geolocation: BMapGL.Geolocation; Geocoder: BMapGL.Geocoder; Boundary: BMapGL.Boundary; LocalCity: BMapGL.LocalCity; LocalSearch: BMapGL.LocalSearch; Autocomplete: BMapGL.Autocomplete; BusLineSearch: BMapGL.BusLineSearch; WalkingRoute: BMapGL.WalkingRoute; DrivingRoute: BMapGL.DrivingRoute; TransitRoute: BMapGL.TransitRoute; PanoramaControl: BMapGL.PanoramaControl; PanoramaService: BMapGL.PanoramaService; PanoramaLabel: BMapGL.PanoramaLabel; Panorama: BMapGL.Panorama; NavigationControl: BMapGL.NavigationControl; Control: BMapGL.Control; Circle: BMapGL.Circle; NavigationControl3D: BMapGL.NavigationControl3D; GroundOverlay: BMapGL.GroundOverlay; Polygon: BMapGL.Polygon; Polyline: BMapGL.Polyline; Icon: BMapGL.Icon; ControlAnchor: BMapGL.ControlAnchor; Point: BMapGL.Point; Pixel: BMapGL.Pixel; Size: BMapGL.Size; Label: BMapGL.Label; Overlay: BMapGL.Overlay; Projection: BMapGL.Projection; Convertor: BMapGL.Convertor; Marker: BMapGL.Marker; Copyright: BMapGL.Copyright; TileLayer: BMapGL.TileLayer; Symbol: BMapGL.Symbol; Bounds: BMapGL.Bounds; MapType: BMapGL.MapType; SymbolShapeType: BMapGL.SymbolShapeType; Map: BMapGL.Map; };

export const loadMapSDK = async (ak: string) => {
  return await new Promise<MapSDK>((reslove) => {
    if ((window as any).BMapGL) {
      reslove((window as any).BMapGL);
    } else {
      const callback = "___BMapLoaded___";
      const ak = "4cr0zE3KYDm4FwuxvKaOVCclzIQzaUlG";
      const uri = `https://api.map.baidu.com/api?type=webgl&v=2.0&ak=${ak}&callback=${callback}`;
      (window as any)[callback] = () => reslove((window as any).BMapGL as MapSDK);
      const script = document.createElement('script');
      script.src = uri;
      document.body.append(script);
    }
  });
}
loadMapSDK('');
export default (Vue: any) => {
  componentList.forEach(com => {
    Vue.component(com.name, com)
  })
}
