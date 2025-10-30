export function streamReadByChar(content, chunkSize = 5, delay = 50, onChunk) {
  let timer // 存储定时器实例，用于外部清除
  let index = 0
  let currentContent = ''

  // 启动流式读取
  timer = setInterval(() => {
    const chunk = content.slice(index, index + chunkSize)
    if (chunk) {
      currentContent += chunk
      index += chunkSize
      onChunk(currentContent, false) // 实时返回内容
    } else {
      clearInterval(timer)
      onChunk(currentContent, true) // 结束
    }
  }, delay)

  // 返回清除定时器的方法（供外部调用停止）
  return () => {
    clearInterval(timer)
    onChunk(currentContent, true) // 停止时也标记为结束
  }
}
