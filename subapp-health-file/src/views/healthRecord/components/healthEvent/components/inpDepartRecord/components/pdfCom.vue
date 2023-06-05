<template>
  <div id="pdf-cont" class="pdf-cont-cont height100 width100">
    <div class="pdf-item" :style="pdfContStyle" v-for="i in pageCount" :key="i">
      <pdf
        :src="pdfSrc"
        :page="i"
        :rotate="rotateEdge"
        @num-pages="numPages"
        @page-loaded="pageLoaded"
      />
    </div>
    <!-- <div class="pdf-cont">
        <embed
          :src="currentData.fileUrl"
          type="application/pdf"
          style="height: 100%; width: 100%"
          v-if=""
          background-color="#ccc"
          javascript="allow"
        />
        <embed
          :src="currentData.fileUrl"
          style="height: 100%; width: 100%"
          v-if="currentData.fileType === 'JPEG'"
          javascript="allow"
        />
      </div> -->
  </div>
</template>
<script>
// import pdf from "vue-pdf";
// import pdf from 'vue-pdf/src/vuePdfNoSssNoWorker'
const pdf =  window.microApp.getData().pdf

export default {
  name: "pdfCom",
  props: {
    rotateEdge: {
      type: Number,
      default: 0,
    },
    // pdfSrc: {
    //   type: String,
    //   default: "",
    // },
    pdfContStyle: {
      type: Object,
      default() {
        return {
          width: "100%",
        };
      },
    },
    currentData: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  // components: {
  //   pdf,
  // },
  data() {
    return {
      pdfSrc: "",
      loadingTask: null,
      // pdf文件总页数
      pageCount: 0,
    };
  },
  watch: {
    currentData: {
      handler(val) {
        if (val.fileUrl) {
          this.loadingTask = pdf.createLoadingTask({
            url: val.fileUrl,
            //引入pdf.js字体，templ
            cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/",
            cMapPacked: true,
          });
          this.pdfSrc = this.loadingTask;
          this.pdfSrc.promise.then((pdf) => {
            console.log("pdf", pdf);
            this.pageCount = pdf.numPages;
            this.$emit("currentPage", 1);
            this.$emit("pageCount", this.pageCount);
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 监听滚动事件
      document.getElementById("pdf-cont") &&
        document.getElementById("pdf-cont").addEventListener("scroll", () => {
          this.scrollFuc();
        });
    });
  },
  methods: {
    scrollFuc() {
      // 滚动的高度
      let scrollTop = document.getElementById("pdf-cont").scrollTop;
      let topVal = 0;
      for (let i = 0; i < this.pageCount; i++) {
        let itemHeight =
          document.getElementsByClassName("pdf-item")[i].offsetHeight;
        topVal += itemHeight;
        if (topVal > scrollTop) {
          this.$emit("currentPage", i + 1);
          break;
        }
      }
    },
    numPages() {},
    pageLoaded() {},
  },
};
</script>
<style lang="scss" scoped>
.pdf-cont-cont {
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>