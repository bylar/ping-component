//组件都写在这个数组中方便管理
const componentList: any[] = []

import PBox from './PBox.vue';
componentList.push(PBox);

export default (Vue: any) => {
  componentList.forEach(com => {
    Vue.component(com.name, com)
  })
}
