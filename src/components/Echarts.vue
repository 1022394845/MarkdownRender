<script setup>
import 'echarts'
import VChart from 'vue-echarts'

const props = defineProps({
  option: {
    type: String,
    required: true
  }
})

// 解析JSON字符串格式的option
function parseEChartsOption(str) {
  try {
    let cleanedStr = str.replace(/^option\s*=\s*/, '').replace(/;\s*$/, '')
    cleanedStr = cleanedStr.replace(/'/g, '"')
    cleanedStr = cleanedStr.replace(/(\w+)\s*:/g, '"$1":')
    return JSON.parse(cleanedStr)
  } catch (error) {
    return null
  }
}
</script>

<template>
  <VChart
    class="chart"
    v-if="parseEChartsOption(option)"
    :option="parseEChartsOption(option)"
  ></VChart>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>
