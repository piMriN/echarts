<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice"
        >☟</span
      >
      <div class="sekect-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstane: null,
      allData: null,
      showChoice: false, // 是否显示可选项
      choiceType: 'map', // 显示的数据类型
      titleFontSize: 0 // 指明标题的字体大小
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    selectTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart() {
      this.chartInstane = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstane.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('trend')
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      //   x 轴
      const timeArr = this.allData.common.month
      //   y轴
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.updateChart,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      //   图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        itemWidht: this.titleFontSize,
        itemHeight: this.titleFontSize,
        itemGap: this.titleFontSize,
        textStyle: {
          fontSize: this.titleFontSize / 2
        }
      }
      this.chartInstane.setOption(adapterOption)
      this.chartInstane.resize()
    },
    handleSelect(currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 15px;
    cursor: pointer;
  }
  .sekect-con {
    background-color: #222733;
  }
}
</style>
