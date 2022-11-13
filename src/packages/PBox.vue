<template>
    <div v-if="mounted" ref="node" v-on="attrsMethod" :style="styleMix" :stylea="styleMix" class="node">
        <slot />
        {{ styleMix }}
    </div>
</template>

<script lang='ts'>
export default { name: 'p-box' }
</script>

<script setup lang='ts'>
import { ref, onMounted, getCurrentInstance, ComponentInternalInstance, useAttrs, computed, reactive, ComputedRef, } from 'vue';
const node = ref<HTMLDivElement>();
const mounted = ref(false);
const fillUnit = (v: number | string) => typeof v === 'number' ? `${v}px` : v;
type origin = 'center' | 'leftTop' | [number | string, number | string];
type props = {
    x?: string | number, y?: string | number, origin?: origin, w?: string | number,
    width?: string | number, h?: string | number, height?: string | number,
    cols?: Array<number | string>, col?: number, rows?: Array<number | string>, row?: number,
};
const props = defineProps<props>();
const children = reactive<ComponentInternalInstance[]>([]);
const handleChild = (child: ComponentInternalInstance) => {
    children.push(child);
};
const exposed = { handleChild, grid: [(props.cols || []).map(fillUnit), (props.rows || []).map(fillUnit)] };
let context = ref<ComponentInternalInstance>();
const attrs = useAttrs();
const attrsValue = computed(() => {
    const result: any = {};
    Object.entries(attrs).map(([key, attr]: [string, any]) => {
        if (key === 'style') return;
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
const styleMix = computed(() => {
    const result: any = { ...attrsValue.value.style, ...calcStyle.value };
    return Object.entries(result).map(([k, v]) => `${k.replace(/(.)([A-Z])/, "$1-$2").toLocaleLowerCase()}: ${v}`).join(';');
});
const currentWidth = computed(() => {
    return node.value?.offsetWidth;
});
const currentHeight = computed(() => {
    return node.value?.offsetHeight;
});
const calcOrigin = computed<[string, string]>((() => {
    let [w, h] = [currentWidth.value || 0, currentHeight.value || 0];
    if (typeof props.origin === 'undefined') return ['0px', '0px'];
    if (typeof props.origin === 'string') {
        switch (props.origin) {
            default: case 'center': return [`${w / 2}px`, `${h / 2}px`];
            case 'leftTop': return ['0px', '0px'];
        }
    }
    if (typeof props.origin === 'object') {
        return props.origin.map
    }
}) as () => [string, string]);
const calcParentGrid = computed<[string[], string[]]>((() => {
    const grid = context.value && context.value.parent && context.value.parent.exposed && context.value.parent.exposed.grid;
    return grid;
}) as () => [string[], string[]]);
const styleCalcs: { [key: string]: ComputedRef<any> } = {
    postion: computed(() => {
        if (!isChild) return 'relative';
        return 'absolute';
    }),
    left: computed(() => {
        if (typeof props.x === 'undefined' && typeof props.col === 'undefined') return undefined;
        let value = '';
        if (typeof props.x != 'undefined') value = [value, fillUnit(props.x)].filter(v => v != '').join(' + ');
        if (typeof props.col != 'undefined' && calcParentGrid.value) {
            value = [value, ...calcParentGrid.value[0].slice(0, props.col - 1)].filter(v => v != '').join(' + ');
        }
        if (calcOrigin.value[0]) {
            value = [value, calcOrigin.value[0]].filter(v => v != '').join(' - ');
        }
        return `calc(${value})`;
    }),
    top: computed(() => {
        if (typeof props.y === 'undefined' && typeof props.row === 'undefined') return undefined;
        let value = '';
        if (typeof props.y != 'undefined') value = [value, fillUnit(props.y)].filter(v => v != '').join(' + ');
        if (typeof props.row != 'undefined' && calcParentGrid.value) {
            value = [value, ...calcParentGrid.value[1].slice(0, props.row - 1)].filter(v => v != '').join(' + ');
        }
        if (calcOrigin.value[1]) {
            value = [value, calcOrigin.value[1]].filter(v => v != '').join(' - ');
        }
        return `calc(${value})`;
    }),
    width: computed(() => {
        if (typeof props.w != 'undefined') return fillUnit(props.w);
        if (typeof props.width != 'undefined') return fillUnit(props.width);
        if (typeof props.col != 'undefined' && calcParentGrid.value) {
            return calcParentGrid.value[0].slice(props.col - 1, props.col)[0]
        }
        return undefined;
    }),
    height: computed(() => {
        if (typeof props.h != 'undefined') return fillUnit(props.h);
        if (typeof props.height != 'undefined') return fillUnit(props.height);
        if (typeof props.row != 'undefined' && calcParentGrid.value) {
            return calcParentGrid.value[1].slice(props.row - 1, props.row)[0]
        }
        return undefined;
    }),
};
const calcStyle = computed(() => {
    if (!mounted.value) return '';
    const result: CSSStyleDeclaration = ({} as CSSStyleDeclaration);
    Object.entries(styleCalcs).map(([key, computeder]) => {
        if (typeof computeder.value != 'undefined') (<any>result)[key] = computeder.value;
    })
    return result;
});
const isChild = computed(() => {
    return !!(context.value && context.value.parent && context.value.parent.type.name === 'p-box');
});
defineExpose(exposed);
onMounted(() => {
    context.value = <ComponentInternalInstance>getCurrentInstance();
    if (isChild.value) {
        (<typeof exposed>context.value.parent?.exposed).handleChild(context.value);
    }
    mounted.value = true;
});
</script>

<style scoped>
.node {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.3s;
}
</style>