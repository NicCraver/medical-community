<template>
  <el-form
    :disabled="mode === 'check'"
    label-width="110px"   
    :model="tagDetail"   
    ref="elForm"
    :rules="rules"
    class="tag-form"
  >
    <el-form-item label="选择纳入病种" class="inlineDefault is-required">    
      <span class="icon-add" v-if="mode === 'add'||mode === 'edit'">
        <i class="el-icon-plus" @click="addDiseaseChange"></i>     
      </span>       
      <div :class="{'contentIcdHeight': tagDetail.icdIds.length>7 }">    
        <div v-for="(item, index) in tagDetail.icdIds" :key="index">                        
          <el-switch       
            class="switchTxt"
            v-model="item.status"
            :active-value="0"
            :inactive-value="1"
            active-text="开启"
            inactive-text="停用"   
            v-if="mode == 'edit'" 
          ></el-switch>     
          <el-select placeholder="请选择编码分类" v-model="item.diseasesType" @change="selectChanged(item)" style="width:185px">
            <el-option
              v-for="cont in codeClassification"
              :key="cont.value"
              :label="cont.label"
              :value="cont.value"
              :disabled="cont.disabled"
            />
          </el-select>     
          <el-select
            v-model="item.label"     
            filterable
            remote
            placeholder="请输入编码/名称检索下拉框" 
            :remote-method="(query) => remoteSearchAdGroup(query, item)"
            @visible-change="(flag) => clearRecord(flag, item)"          
            :loading="loading"         
            style="width:250px; margin-left:12px">
            <el-option
              v-for="tonc in codeSearchList"
              :key="tonc.value"
              :label="tonc.label"
              :value="tonc.label"
              @click.native="getItemChange(tonc, item)">
            </el-option>
          </el-select>      
          <span class="icon-del">      
            <span v-if="mode == 'add'">
              <i class="el-icon-delete allow-del" v-if="tagDetail.icdIds.length>1" @click="delDiseaseChange(item)"></i>       
              <i class="el-icon-delete noAllow-del" v-else></i>
            </span> 
            <span v-else-if="mode == 'edit'">
              <i class="el-icon-delete allow-del" v-if="tagDetail.icdIds.length>1 && item.status==1" @click="delDiseaseChange(item)"></i> 
              <i class="el-icon-delete noAllow-del" v-else-if="tagDetail.icdIds.length>1 && item.status==0" @click="delDiseaseChange(item)"></i>       
              <i class="el-icon-delete noAllow-del" v-else></i>
            </span>           
          </span>          
        </div> 
      </div>        
    </el-form-item>
    <el-form-item label="关联病种标签" class="inlineDefault is-required">
      <el-cascader
        v-model="tagDetail.deptId"
        :options="deptData"
        placeholder="科室"
        @change="handleChange"
      />
      <el-select placeholder="请选择" v-model="tagDetail.tagDiseaseDeptId" @visible-change='getGiftListTable' @change="updateValueChange" style="margin-left:12px">
        <el-option
          v-for="(item, index) in typeDiseaseList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>  
      <!--
      <el-col :span="10">
        <el-form-item prop="deptId">
          <el-cascader
            v-model="tagDetail.deptId"
            :options="deptData"
            placeholder="科室"
            @change="handleChange"
          />
        </el-form-item>
      </el-col>   
      <el-col :span="14">
        <el-form-item prop="tagDiseaseDeptId">
          <el-select placeholder="请选择" v-model="tagDetail.tagDiseaseDeptId" @visible-change='getGiftListTable' @change="updateValueChange">
            <el-option
              v-for="(item, index) in typeDiseaseList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>        
        </el-form-item>
      </el-col>         
      -->
    </el-form-item>
    <el-form-item label="总状态" class="outlineDefault" prop="status">
      <el-switch       
        class="switchTxt"
        v-model="tagDetail.status"
        :active-value="0"
        :inactive-value="1"
        active-text="开启"
        inactive-text="关闭"       
      ></el-switch>
    </el-form-item> 
  </el-form>
</template>

<script>
import { getDeptDictionaryForIcd, getIcdDicForOrderBy, getTagDiseaseByDeptId } from '@/api/modules/diseaseControl'
export default {
  props: ['mode', 'tagDetail', 'icdTypeList'],
  data() {
    return {
      rules: {
        // deptId: [
        //   { required: true, message: '请选择科室', trigger: 'blur' }
        // ],
        // tagDiseaseDeptId: [
        //   { required: true, message: '请选择关联病种标签', trigger: 'blur' }
        // ]       
      },
      deptData: [],
      typeDiseaseList:[],
      codeClassification:[],
      loading:false,
      codeSearchList:[],
      oldcutval:''     
    }
  },
  mounted() {
    this.codeClassification = this.icdTypeList ? this.icdTypeList : [];   
    this.getDeptDictionaryForIcd()   
  },
  methods: { 
    updateValueChange(val){      
      if(this.mode == 'edit'){
        console.log(val)  
        let oldvalue = this.tagDetail.beforeDeptId[this.tagDetail.beforeDeptId.length - 1];
        let newvalue = this.tagDetail.deptId[this.tagDetail.deptId.length - 1];
        console.log(newvalue, oldvalue)
        //相同科室下切换疾病标签提醒
        if(newvalue == oldvalue){     
          let txtname = '';
          this.typeDiseaseList.forEach(item => {
            if(item.value == val) txtname = item.label;
          })
          if(val !== this.tagDetail.beforeTagDiseaseDeptId){
            console.log(this.oldcutval, txtname)
            this.$confirm(`关联病种标签由${this.oldcutval}变更为${txtname}，是否确定变更？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              //确认变更...    
            }).catch(() => {
              this.tagDetail.tagDiseaseDeptId = this.tagDetail.beforeTagDiseaseDeptId;
            })
          }
        }
      }     
    }, 
    selectChanged(item){
      item.id = '';
    },
    //清除上次保留的搜索记录
    clearRecord(flag, item){
      // console.log(flag, item.id)
      if(flag){              
        this.remoteSearchAdGroup(item.id, item)
      } 
    },
    remoteSearchAdGroup(query, item) {  
      console.log(query, item)  
      if (query) {
        if(!item.diseasesType) return this.$message.warning('请先选择编码分类')
        this.loading = true;   
        this.getIcdDicForOrderBy(query, item)         
      } else {
        this.codeSearchList = [];
      }
    },  
    async getIcdDicForOrderBy(val, item) {
      try {
        const res = await getIcdDicForOrderBy(
          { value:val, type:item.diseasesType}
        )
        console.log('getIcdDicForOrderBy=====', res)
        if(res.code == 0){
          this.loading = false;
          this.codeSearchList = res.result;
        }      
      } catch (err) {
        this.loading = false;
        console.error(err)
      }
    }, 
    getItemChange(tonc, item){
      //console.log(tonc, item)
      item.id = tonc.value;
    }, 
    getGiftListTable(flag){   
      if(flag){      
        if(!this.tagDetail.deptId.length) return this.$message.warning('请先选择科室')
        let val = this.tagDetail.deptId[this.tagDetail.deptId.length - 1]; //最内层科室id   
        this.getTagDiseaseByDeptId(val)
      }
    },
    async getTagDiseaseByDeptId(val) {
      try {                 
        const res = await getTagDiseaseByDeptId({deptId: val})
        console.log('getTagDiseaseByDeptId', res)
        if(res.code == 0){
          
          this.typeDiseaseList = res.result; 
          //取变更之前的疾病标签名称
          if(this.mode == 'edit'){            
            let searList = this.typeDiseaseList.filter(item => item.value === this.tagDetail.beforeTagDiseaseDeptId);  
            this.oldcutval = searList.length ? searList[0].label : '';           
            console.log(this.oldcutval)
          }    
        }else{
          this.typeDiseaseList = [];
        }         
      } catch(err) {
        console.error(err)
      }
    },
    //添加
    addDiseaseChange(){
      if(this.tagDetail.icdIds.length >20 || this.tagDetail.icdIds.length ==20) return this.$message.warning('最多可添加20个对照的纳入病种')
      let params = new Object();   
      params.seq = this.tagDetail.icdIds[this.tagDetail.icdIds.length-1].seq + 1;
      params.status = 0;
      params.diseasesType=''; 
      params.label='';
      params.id='';
      this.tagDetail.icdIds.push(params)    
    },
    //删除
    delDiseaseChange(cont){  
      if(this.mode=='add'){       
        this.stopDel(cont)
      }else{
        if(cont.status == 0) return this.$message.warning('请先选择停用，停用后可删除')
        else this.stopDel(cont);
      }      
    },
    stopDel(cont){
      this.tagDetail.icdIds = this.tagDetail.icdIds.filter(item => item.seq != cont.seq);
      this.$message.success('删除成功')
    },
    //科室改变时触发
    handleChange(){
      this.tagDetail.tagDiseaseDeptId = '';
    },
    async getDeptDictionaryForIcd() {
      try {
        const res = await getDeptDictionaryForIcd()
        console.log('getDeptDictionaryForIcd', res)
        const deptData = res.result;
        this.filterDeptData(deptData)
        this.deptData = deptData;
      } catch(err) {
        console.error(err)
      }
    },
    filterDeptData(deptData) {
      deptData.forEach(item => {
        if (!item.children.length) {
          item.children = null
        } else {
          this.filterDeptData(item.children)
        }
      })
    },
    validate(cb) {
      this.$refs.elForm.validate(valid => {
        if (valid) {
          cb()
        }
      })
    }   
  }
}
</script>

<style scoped>
.contentIcdHeight{
  height: 282px;
  overflow-y: scroll;
  border:1px solid white;
}
.contentIcdHeight::-webkit-scrollbar {
  width: 6px;
  height: 12px;
  border-radius: 12px;
}
.contentIcdHeight::-webkit-scrollbar-thumb {
  border-radius:12px;
  background-color:rgb(155, 154, 154);    
}
.contentIcdHeight::-webkit-scrollbar-track {
  background-color:#eaeaea;
}

::v-deep .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
::v-deep  .el-switch__label * {
    font-size: 12px ;   
}
/*打开时文字位置设置*/
::v-deep .el-switch__label--right {
  z-index: 1;
  top: -1px;
  right: 30px;
}
/*关闭时文字位置设置*/
::v-deep .el-switch__label--left {
  z-index: 1;
  top: -1px;
  left: 30px;
}
/*显示文字*/
::v-deep .el-switch__label.is-active {
  display: block;
}
::v-deep .el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 65px !important;
}

::v-deep .inlineDefault .el-form-item__label{
   width:100% !important;
   text-align: left !important;
}
::v-deep .inlineDefault .el-form-item__content{
  margin-left: 7px !important;
}

::v-deep .outlineDefault .el-form-item__label{  
  text-align: left !important;
  width: 85px !important;
  padding: 0 12px 0 14px !important;
}

::v-deep .outlineDefault .el-form-item__content{
  margin-left: 72px !important;
}
</style>
<style lang="scss" scoped>
.tag-form {
  padding: 15px;
  .switchTxt{
    margin-right: 12px;
  }
  .inlineDefault{
    position: relative;
  }
  .icon-add{
    position: absolute;
    left: 95px;
    top: 10px;
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 18px;
    border-radius: 2px;
    border: 1px solid #446ABD;
    box-sizing: border-box;
    cursor: pointer;
    .el-icon-plus{
      color: #4468BD;
    }
  }
  .icon-del{
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
    .allow-del{
      color: #4468BD;
    }
    .noAllow-del{
      color: #5b5b5b;;
    }
  }
}
</style>