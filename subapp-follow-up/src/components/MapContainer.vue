<template>
  <div class="map">
    <el-autocomplete
      class="inline-input"
      v-model="addressText"
      :fetch-suggestions="querySearch"
      placeholder=""
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
    <div id="map-container"></div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  props: {
    zoom: {
      type: Number,
      default: 13
    },
    center: {
      type: Array,
      default() {
        return [123.95, 47.33]
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addressText: '',
      mapIns: null,
      markers: []
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap(){
      window._AMapSecurityConfig = {
        securityJsCode: 'ff0ca9e1d0870eabe06234c8cfb12db0',
      }
      AMapLoader.load({
        key: '366f4c5c420568877f1102920d747b6a',
        version: '2.0',
        plugins: ['']
      }).then(AMap => {
        const center = (this.center[0] && this.center[1]) ? this.center : [123.95, 47.33]
        this.mapIns = new AMap.Map('map-container', {
          zoom: this.zoom, // 初始化地图级别
          center: center, //初始化地图中心点位置
        });
        this.setMarker(center, '齐齐哈尔');
      }).catch(e => {
        console.log(e);
      })
    },

    // 设置标记点
    setMarker(position, title = '') {
      if (!Array.isArray(position)) {
        console.error('请传入正确的位置信息');
        return;
      }
      console.log('AMap===', AMap)
      const marker = new AMap.Marker({
        position,
        title
      });
      this.markers.push(marker);
      this.mapIns.add(marker);
    },

    // 移除全部标记点
    removeAllMarker() {
      this.mapIns.remove(this.markers);
      this.markers = [];
    },

    // 关键字查询地址
    querySearch(queryString, cb) {
      AMap.plugin('AMap.PlaceSearch', () => {
        var placeSearch = new AMap.PlaceSearch({
          city: '全国'
        });
        placeSearch.search(queryString, function (status, result) {
          const posRes = result.poiList.pois.map(item => ({ ...item, value: item.name }));
          cb(posRes);
        });
      });
    },

    // 查询结果选中
    handleSelect(item) {
      this.removeAllMarker();
      this.setMarker([item.location.lng, item.location.lat])
      this.mapIns.setCenter([item.location.lng, item.location.lat]);
      console.log('addressText', this.addressText)
      this.$emit('location-change', { address: this.addressText, lng: item.location.lng, lat: item.location.lat })
    },
  },
  watch: {
    address(newVal) {
      this.addressText = newVal;
    }
  }
}

</script>

<style lang="scss" scoped>
#map-container {
  height: 300px;
  margin: 10px 0;
}
.el-autocomplete {
  width: 100%;
}
</style>
