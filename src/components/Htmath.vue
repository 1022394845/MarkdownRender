<script setup>
import { useTemplateRef, watch, ref, nextTick } from 'vue'

const props = defineProps({ content: String })

const iframeRef = useTemplateRef('iframeRef')

// 校验 HTML 内容是否暂态完整（简单判断：存在 </html> 闭合标签）
const isHtmlComplete = (html) => {
  if (!html) return false
  // 忽略大小写，判断是否包含 </html> 闭合标签
  return /<\/html\s*>/i.test(html)
}

watch(
  () => iframeRef.value,
  (iframe) => {
    if (!iframe) return
    try {
      const iframeDoc = iframe.contentDocument

      // 清除之前的事件监听，避免重复触发
      iframe.contentWindow.onload = null

      iframeDoc.open()
      iframeDoc.writeln(props.content)
      iframeDoc.close()

      // 监听iframe内容加载完成事件
      iframe.contentWindow.onload = () => {
        let lastHeight = 0
        // 启动定时器监测高度变化
        let heightCheckTimer = setInterval(() => {
          const currentHeight = iframeDoc.documentElement.scrollHeight

          if (currentHeight !== lastHeight) {
            // 高度变化时更新
            lastHeight = currentHeight
            iframe.style.height = currentHeight + 'px'
            console.log('高度更新:', currentHeight)
          } else {
            // 高度不变时清除定时器
            clearInterval(heightCheckTimer)
            heightCheckTimer = null
            console.log('高度稳定，停止监测', currentHeight)
          }
        }, 500)
      }
    } catch (err) {
      return console.log(err)
    }
  },
  { immediate: true } // 初始加载时立即检查
)
</script>

<template>
  <iframe
    v-if="isHtmlComplete(content)"
    ref="iframeRef"
    width="100%"
    frameborder="0"
  ></iframe>
</template>
