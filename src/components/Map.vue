<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allDate: null,
      mapData: {} // 获取的省份的地图矢量数据
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
    async initChatr() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      //   获取中国地图的矢量数据
      const ret = await axios.get('http://localhost:8888/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      console.log(ret)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        console.log(arg)
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        // 获取省份的地图矢量数据
        // 判断当前点击的这个省份是否存在
        if (this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            'http://localhost:8888' + provinceInfo.path
          )
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData() {
      const { data: ret } = await this.$http.get('map')
      this.allDate = ret
      console.log(this.allDate)
      this.updataChart()
    },
    updataChart() {
      // 图例数据
      const legendArr = this.allDate.map((item) => {
        return item.name
      })
      const seriesArr = this.allDate.map((item) => {
        // return的这个对象代表的是一个类别下的所有的散点数据
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          //   显示散点数据，配置 coordinateSystem:geo
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style></style>
