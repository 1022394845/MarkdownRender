<script setup>
import { useTemplateRef, h } from 'vue'
import { throttle } from '@/utils/throttle'
import { XMarkdown } from 'vue-element-plus-x'
import 'katex/dist/katex.min.css' // 数学公式样式
import Echarts from './Echarts.vue' // 图表组件
import Htmath from './Htmath.vue'

const props = defineProps({
  content: String,
  loading: {
    type: Boolean,
    default: false
  }
})
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
  echarts: (props) => h(Echarts, { option: props.raw.content }),
  htmath: (props) => h(Htmath, { content: props.raw.content })
}
</script>

<template>
  <div class="markdown-render" ref="container">
    <XMarkdown
      :markdown="content"
      :code-x-render="selfCodeXRender"
      :allow-html="true"
    />
    <div class="loading" v-if="loading">
      <span>加载中</span>
      <div class="dot" v-for="index in 3"></div>
    </div>
  </div>
</template>

<style scoped>
.markdown-render {
  scroll-behavior: smooth;
}

.loading {
  display: flex;
  align-items: center;
  color: #787878;

  .dot {
    width: 4px;
    height: 4px;
    margin: 0 4px;
    background-color: #787878;
    border-radius: 50%;
    animation: dotAppear 1.5s infinite ease-in-out;
  }

  .dot:nth-child(1) {
    animation-delay: 0s;
  }

  .dot:nth-child(2) {
    animation-delay: 0.5s;
  }

  .dot:nth-child(3) {
    animation-delay: 1s;
  }
}

@keyframes dotAppear {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
