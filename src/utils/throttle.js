/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} delay - 节流延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay) {
  let lastTime = 0 // 记录上一次执行的时间
  return (...args) => {
    const now = Date.now()
    // 如果当前时间与上一次执行时间的间隔 >= delay，则执行函数
    if (now - lastTime >= delay) {
      func.apply(this, args)
      lastTime = now // 更新上一次执行时间
    }
  }
}
