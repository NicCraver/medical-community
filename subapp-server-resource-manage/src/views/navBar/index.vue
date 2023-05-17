<template>
  <div class="navBar">
    <div style="margin-right: 5px">质控方案（个）</div>
    <div class="deepColor">{{ projectData?.length || 0 }}</div>
    <div class="line"></div>
    <div style="margin-right: 5px">发布机构</div>
    <div class="deepColor underline" @click="goPage">{{ hosName }}</div>
  </div>
</template>

<script>
import { getQualityControlList, getOrgNames } from "api/basicConfig";
export default {
  name: "navBar",
  props: {
    projectData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isOrgAdmin: "", //集团
      isOriAdmin: "", //机构
      currentRole: {},
      groupList: [],
      hosList: [],
      total: 0,
      hosName: "",
    };
  },
  watch: {
    $route(to, from) {
      this.initFuc();
    },
  },
  created() {
    this.getOrgNamesFuc();
    this.initFuc();
  },
  mounted() {
    // this.getList();
  },
  methods: {
    initFuc() {
      this.currentRole = JSON.parse(sessionStorage.getItem("currentRole"));
      this.isOrgAdmin = sessionStorage.getItem("isOrgAdmin");
      this.isOriAdmin = sessionStorage.getItem("isOriAdmin");
      if (this.isOrgAdmin) {
        // 集团
        let params = this.$route.query;
        let orgIdList = params?.orgIdList ? params?.orgIdList.split(",") : [];
        let orgNameList = [];
        orgIdList.map((item) => {
          let obj = this.hosList.find((value) => value.id === item);
          if (obj?.label) {
            orgNameList.push(obj?.label);
          }
        });
        this.hosName = orgNameList?.length ? orgNameList.join("，") : "全部";
      } else if (this.isOriAdmin) {
        // 机构
        this.hosName = `${this.currentRole.orgName}、${this.currentRole.hosName}`;
      }
    },
    getList() {
      let param = {
        // publishStatus: 2,
        listStatus: 2,
        pageNum: 1,
        pageSize: 1,
        orgIdList: this.isOriAdmin ? this.currentRole.hosId : "",
      };
      getQualityControlList(param).then(({ code, total }) => {
        if (code === 0) {
          this.total = total || 0;
        }
      });
    },
    // 查询机构
    getOrgNamesFuc() {
      getOrgNames().then(({ code, result }) => {
        if (code === 0) {
          if (this.isOrgAdmin) {
            this.handleOrgData(result.treeData);
          }
        }
      });
    },
    handleOrgData(list) {
      let hosList = [];
      let groupList = list.map((item) => {
        let children = item.children.map((vv) => {
          return {
            parentId: item.id,
            id: vv.id,
            label: vv.label,
          };
        });
        hosList = hosList.concat(children);
        return {
          id: item.id,
          label: item.label,
        };
      });
      console.log("groupList:", groupList);
      console.log("hosList:", hosList);
      this.groupList = groupList;
      this.hosList = hosList;
    },
    goPage() {
      this.$router.push({
        name: "searchRes",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navBar {
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #abbce0;
  background: #fff;
  margin-bottom: 2px;
  padding-right: 15px;
  margin-bottom: 10px;
  position: relative;
  left: -10px;
  width: calc(100% + 20px);
  .deepColor {
    color: rgba(68, 106, 189, 1);
  }
  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
  .line {
    width: 1px;
    height: 12px;
    margin: 0 8px;
    background-color: #919191;
  }
}
</style>
