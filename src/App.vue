<script setup>
import { ref, useTemplateRef, nextTick } from 'vue'
import { streamReadByChar } from '@/utils/streamReader'
import MarkdownRender from '@/components/MarkdownRender.vue'

const streamedContent = ref('')
// 标记是否正在读取
const loading = ref(false)
// 存储停止函数的引用（关键）
let stopFunction = null
const containerRef = useTemplateRef('renderContainer')

// 读取本地 Markdown 文件
const loadLocalMarkdown = async () => {
  const response = await fetch('/test2.md')
  return response.text()
}

// 开始流式读取
const startStream = async () => {
  loading.value = true
  streamedContent.value = '' // 重置内容

  // 1. 读取完整内容
  const fullContent = await loadLocalMarkdown()

  // 2. 启动流式读取，并保存停止函数
  stopFunction = streamReadByChar(
    fullContent,
    20, // 每次读取字符数
    10, // 间隔时间（ms）
    (content, isEnd) => {
      streamedContent.value = content
      if (isEnd) {
        loading.value = false
        stopFunction = null // 结束后清空停止函数
      }
      nextTick(() => {
        containerRef.value.scrollToBottom()
      })
    }
  )
}

// 停止流式读取
const stopStream = () => {
  if (stopFunction) {
    stopFunction() // 调用工具函数返回的停止方法
    loading.value = false
    stopFunction = null // 清空停止函数
  }
}
</script>

<template>
  <main>
    <div class="option">
      <button @click="startStream" :disabled="loading">开始流式读取</button>
      <button
        @click="stopStream"
        :disabled="!loading"
        style="margin-left: 10px"
      >
        停止读取
      </button>
    </div>
    <markdown-render
      class="markdown-render"
      ref="renderContainer"
      :content="streamedContent"
      :loading="loading"
    ></markdown-render>
  </main>
</template>

<style scoped>
main {
  width: 800px;
  height: 100%;
  margin: 50px auto 0;

  .option {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px auto;
  }

  .markdown-render {
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    scrollbar-width: thin;
  }
}
</style>
