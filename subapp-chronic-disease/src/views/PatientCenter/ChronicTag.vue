<template>
  <div class="chronic-tag">
    <div class="body">
      <el-scrollbar style="height: 100%">
        <div class="patient">{{ patientInfo.name }} {{ patientInfo.sex }} {{ patientInfo.age }}</div>
        <div class="hased-tags">
          <p style="color: rgba(48, 49, 51, 100)" v-if="hasedTagList.length !== 0">已有慢病标签</p>
          <div class="hased-tag-list">
            <span
              class="tag-item hased"
              v-for="(item, index) in hasedTagList"
              :key="item.value"
              @click="deleteHasedTag(index)"
            >
              <el-tooltip effect="dark" :content="item.label" placement="top-start" v-if="item.label.length > 7">
                <span>{{ `${item.label.substring(0, 5)}...` }}</span>
              </el-tooltip>
              <span v-else>
                {{ item.label }}
              </span>
              <IconSvg iconClass="close" style="margin-top: 5px; float: right; width: 14px"
            /></span>
          </div>
        </div>
        <div class="add-tags">
          <p style="color: rgba(48, 49, 51, 100)">可添加慢病标签</p>
          <div class="add-tag-list">
            <div class="add-tag-item" v-for="item in addTagList" :key="item.category">
              <div class="category" v-if="item.tagList.length">{{ item.category }}</div>
              <span
                class="tag-item add"
                v-for="(tag, index) in item.tagList"
                :key="tag.value"
                @click="addHasedTag(tag, index, item.tagList)"
              >
                <el-tooltip effect="dark" :content="tag.label" placement="top-start" v-if="tag.label.length > 7">
                  <span>{{ `${tag.label.substring(0, 5)}...` }}</span>
                </el-tooltip>
                <span v-else>
                  {{ tag.label }}
                </span>
                <i class="el-icon el-icon-circle-plus-outline icon"></i>
              </span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="footer">
      <el-button @click="cancelDrawer">取消</el-button>
      <el-button type="primary" @click="submitDiseaseTag">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getOrgDiseaseTypes, saveDiseaseTag } from '@/api/modules/PatientCenter'

export default {
  props: {
    hasedTagList: {
      type: Array,
      default() {
        return []
      },
    },
    patientInfo: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    addTagList() {
      if (!this.hasedTagList.length) {
        return JSON.parse(JSON.stringify(this.allTagList))
      }
      const addTagList = JSON.parse(JSON.stringify(this.allTagList))
      this.allTagList.forEach((outerTtem, index) => {
        outerTtem.tagList.forEach((innerItem, innerIndex) => {
          const repeatTag = this.hasedTagList.find((item) => item.value === innerItem.value)
          if (repeatTag) {
            const deleIndex = addTagList[index].tagList.findIndex((item) => item.value === repeatTag.value)
            addTagList[index].tagList.splice(deleIndex, 1)
          }
        })
      })
      return addTagList.sort((a, b) => a.value - b.value)
    },
  },
  data() {
    return {
      allTagList: [],
    }
  },
  mounted() {
    this.patId = this.$route.query.patId
    getOrgDiseaseTypes().then((res) => {
      this.allTagList = res.result
      console.log('this.allTagList===111111211', this.allTagList)
    })
  },
  methods: {
    addHasedTag(tag, index, tagList) {
      tagList.splice(index, 1)
      this.hasedTagList.push(tag)
    },
    deleteHasedTag(index) {
      // 当hasedTagList变化时会自动计算addTagList，因此此处不需要做其他操作，只需将hasedTagList，减少一项
      this.hasedTagList.splice(index, 1)
    },
    submitDiseaseTag() {
      const tagList = this.hasedTagList.map((item) => ({
        orgCode: item.orgCode,
        richDiseaseCode: item.value,
        richDiseaseName: item.label,
      }))
      saveDiseaseTag({ patId: this.patId, patientRichDiseaseList: tagList }).then((res) => {
        this.$emit('saveDiseaseTagSuccess', false)
      })
    },
    cancelDrawer() {
      this.$emit('cancelDrawer')
    },
  },
}
</script>

<style lang="scss" scoped>
.chronic-tag {
  position: relative;
  height: 100%;
  overflow: hidden;
  color: #000;
  user-select: none;
  .body {
    position: absolute;
    top: 0;
    overflow: hidden;
    width: 100%;
    bottom: 61px;
  }
  .patient {
    background-color: #f5f5f5;
    margin: 10px 0;
    color: #000;
    line-height: 30px;
    height: 30px;
    padding-left: 8px;
  }
  .tag-item {
    display: inline-block;
    line-height: 32px;
    height: 32px;
    width: 110px;
    padding: 0 5px;
    border-radius: 4px;
    margin-right: 8px;
    margin-bottom: 8px;
    font-size: 12px;
    .icon {
      float: right;
      margin-top: 9px;
      width: 14px !important;
    }
  }
  .hased-tags {
    p {
      color: #aaa;
    }
    .hased-tag-list {
      .tag-item {
        border: 1px solid #395eb0;
        background-color: #d7e4fd;
        color: #395eb0;
        margin-top: 15px;
      }
    }
  }
  .add-tags {
    p {
      color: #aaa;
    }
    .add-tag-list {
      .add-tag-item {
        .category {
          margin-top: 15px;
          padding-left: 8px;
          border-left: 2px solid #134796;
          margin-bottom: 8px;
        }
        .tag-item {
          border: 1px solid #888888;
          background-color: #fdfdfd;
          color: #6b6b6b;
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 60px;
    height: 60px;
    text-align: right;
    border-top: 1px solid #ccc;
  }
}
</style>
