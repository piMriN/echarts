<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allDate: null
    }
  },
  mounted() {
    this.initChatr()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initnChatr() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref)
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    async getData() {
      // 获取服务器的数据
      this.updataChart()
    },
    updataChart() {
      // 处理图表需要的数据
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped></style>
