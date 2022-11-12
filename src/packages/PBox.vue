<template>
    <div ref="node" v-bind="attrsValue" v-on="attrsMethod" :style="styleMix" class="node">
        <slot />
    </div>
</template>

<script lang='ts'>
export default { name: 'p-box' }
</script>

<script setup lang='ts'>
import { ref, onMounted, getCurrentInstance, ComponentInternalInstance, useAttrs, computed, reactive, ComputedRef, } from 'vue';
const node = ref<HTMLDivElement>();
type origin = 'center' | 'leftTop' | [number | string, number | string];
const props = defineProps<{ x?: string | number, y?: string | number, origin?: origin }>();
const children = reactive<ComponentInternalInstance[]>([]);
const handleChild = (child: ComponentInternalInstance) => {
    children.push(child);
};
const exposed = { handleChild };


let context = ref<ComponentInternalInstance>();
const attrs = useAttrs();
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
const styleMix = computed(() => {
    const result: any = { ...attrsValue.value.style, ...calcStyle.value };
    return result;
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
const styleCalcs: { [key: string]: ComputedRef<any> } = {
    postion: computed(() => {
        if (!isChild) return 'relative';
        if (props.x || props.y || props.origin) return 'absolute';
        return 'relative';
    }),
    left: computed(() => {
        if (typeof props.x === 'undefined') return undefined;
        let value = typeof props.x === 'number' ? `${props.x}px` : props.x;
        return `calc(${value} - ${calcOrigin.value[0]})`;
    }),
    top: computed(() => {
        if (typeof props.y === 'undefined') return undefined;
        let value = typeof props.y === 'number' ? `${props.y}px` : props.y;
        return `calc(${value} - ${calcOrigin.value[1]})`;
    })
};
const calcStyle = computed(() => {
    const result: CSSStyleDeclaration = ({} as CSSStyleDeclaration);
    Object.entries(styleCalcs).map(([key, computeder]) => {
        if (typeof computeder.value != 'undefined') (<any>result)[key] = computeder.value;
    })
    console.log('calcStyle invoke', { result });
    return result;
});
const isChild = computed(() => {
    console.log("isChild invoke", !!(context.value && context.value.parent && context.value.parent.type.name === 'p-box'))
    return !!(context.value && context.value.parent && context.value.parent.type.name === 'p-box');
});
defineExpose(exposed);
onMounted(() => {
    context.value = <ComponentInternalInstance>getCurrentInstance();
    console.log('onMounted');
    if (isChild.value) {
        (<typeof exposed>context.value.parent?.exposed).handleChild(context.value);
    }
});
</script>

<style scoped>
.node {
    display: block;
    position: relative;
}
</style>