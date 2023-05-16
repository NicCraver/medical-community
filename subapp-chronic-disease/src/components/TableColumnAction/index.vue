<template>
  <div class="TableColumnAction">
    <!-- trigger="click" 解决下拉框在页面左上角无法关闭的问题 -->
    <el-dropdown class="project-container" :hide-on-click="false">
      <el-button type="primary" icon="el-icon-setting" style="margin-left: 10px; padding-left: 10px; padding-right: 10px"></el-button>
      <el-dropdown-menu slot="dropdown">
        <!-- <div class="TableColumnAction-btns">
          <div>
            <el-checkbox-group v-model="checked" @change="handleCheckedCitiesChange"> </el-checkbox-group>
          </div>
          <div>重置</div>
        </div> -->
        <div>
          <!-- <el-scrollbar style="height: 30vh"> -->            
          <el-checkbox-group v-model="check">
            <el-dropdown-item v-for="(item, index) in checkList" :key="index">
              <el-checkbox :label="item" :key="item"></el-checkbox>
            </el-dropdown-item>
          </el-checkbox-group>                 
          <!-- </el-scrollbar> -->
        </div> 

        <!-- 该代码和以上代码可以实现相同效果 
        <el-dropdown-item v-for="(item, index) in ColumnLists" :key="index">
          <el-checkbox v-model="item.ispass">{{ item.label }}</el-checkbox>
        </el-dropdown-item> 
        -->       
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    ColumnLists: {
      type: Array,
    },
    columnState: {
      type: String,
    },
  },
  watch: {
    columnState: {
      immediate: true,
      handler(newValue) {
        // console.log('newValue', newValue)
        this.check = []
        this.checkList = []
        // console.log('this.ColumnLists===========', this.ColumnLists)
        this.ColumnLists.forEach((el) => {
          this.checkList.push(el.label)
          if (el.ispass) {
            this.check.push(el.label)
          }
        })
      },
    },
    check: {
      handler(newVal) {
        if (newVal) {
          var arr = this.checkList.filter((i) => newVal.indexOf(i) < 0) //未选中
          this.ColumnLists.map((i) => {
            if (arr.indexOf(i.label) !== -1) {
              i.ispass = false
            } else {
              i.ispass = true
            }
          })
        }
      },
    }
  },
  data() {
    return {
      check: [],
      checkList: [],
      checked: true,
    }
  },
  mounted() {
    // console.log('this.ColumnLists11112333', this.ColumnLists);
    // this.check = [];
    // this.checkList = [];
    // this.ColumnLists.forEach((el) => {
    //   this.check.push(el.label);
    //   this.checkList.push(el.label);
    // });
  },
  methods: {
    handleCheckedCitiesChange(value) {
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
  },
}
</script>

<style lang="scss">
.TableColumnAction-btns {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 10px;
}
</style>
