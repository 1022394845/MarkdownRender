<script setup>
import { useTemplateRef, h } from 'vue'
import { throttle } from '@/utils/throttle'
import { XMarkdown } from 'vue-element-plus-x'
import 'katex/dist/katex.min.css' // 数学公式样式
import Echarts from './Echarts.vue' // 图表组件

const props = defineProps({ content: String })
const containerRef = useTemplateRef('container')

const scrollToBottom = throttle(() => {
  containerRef.value.scrollTop = containerRef.value.scrollHeight
}, 200)
defineExpose({ scrollToBottom })

/**
 * 渲染自定义代码块
 */
const selfCodeXRender = {
  // 渲染自定义代码块标识符 echarts, Echarts 是自己封装的Vue组件
  echarts: (props) => h(Echarts, { option: props.raw.content })
}
</script>

<template>
  <div class="markdown-render" ref="container">
    <XMarkdown :markdown="content" :code-x-render="selfCodeXRender" />
  </div>
</template>

<style scoped>
.markdown-render {
  scroll-behavior: smooth;
}
</style>
