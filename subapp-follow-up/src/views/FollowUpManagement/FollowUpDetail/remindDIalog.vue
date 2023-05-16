<template>
  <el-dialog v-bind="$attrs">
    <div class="remindDIalog">
      <el-form
        ref="remindForm"
        :model="formData"
        :rules="rules"
        label-width="82px"
      >
        <el-form-item label="提醒指标" prop="remindTarget">
          <el-radio-group
            v-model="formData.remindTarget"
            disabled
          >
            <el-radio label="BS">血糖</el-radio>
            <el-radio label="BP">血压</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提醒方式" prop="remindWay">
          <el-checkbox-group v-model="formData.remindWay">
            <el-checkbox
              v-for="(item, index) in remindWayOptions"
              :key="index"
              :label="item.label"
              :disabled="item.disabled"
            >
              {{ item.value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="提醒设置" prop="remindType">
          <el-radio-group
            v-model="formData.remindType"
            @change="remindTypeChange"
          >
            <el-radio label="1">单次</el-radio>
            <el-radio label="2">连续性</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="label label1" v-if="formData.remindType == '1'">
          保存即发送
        </div>
        <div class="label" v-else-if="formData.remindType == '2'">
          每
          <el-form-item
            label=""
            prop="remindDateType"
            label-width="0"
            class="remindDateTypeCls"
          >
            <el-select
              v-model="formData.remindDateType"
              size="mini"
              style="width: 60px"
              placeholder=""
            >
              <el-option
                v-for="item in monthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          ,
          <template v-if="formData.remindDateType !== 'DAY'">
            <el-form-item
              label=""
              prop="remindDateDetail"
              label-width="0"
              class="remindDateTypeCls"
            >
              <el-select
                v-model="formData.remindDateDetail"
                size="mini"
                style="width: 100px"
                placeholder=""
              >
                <el-option
                  v-for="item in dayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item
              label=""
              prop="remindDateDetail"
              label-width="0"
              class="remindDateTypeCls"
            >
              <el-time-picker
                v-model="formData.remindDateDetail"
                size="mini"
                style="width: 100px"
                placeholder=""
                value-format="HH:mm"
                format="HH:mm"
              >
              </el-time-picker>
            </el-form-item>
          </template>
          提醒，连续提醒
          <el-form-item
            label=""
            prop="remindSize"
            label-width="0"
            class="remindDateTypeCls"
          >
            <el-select
              v-model="formData.remindSize"
              size="mini"
              style="width: 76px"
              placeholder=""
            >
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          保存后隔日执行
        </div>
        <el-form-item label="提醒模板" prop="templateId" required>
          <el-select
            v-model="formData.templateId"
            size="mini"
            style="width: 300px"
            placeholder="请选择提醒模板"
            @change="templateChange"
          >
            <el-option
              v-for="(item, index) in tempData"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒内容" required>
          <div class="msg-cont">
            <div class="label-list">
              <div
                class="label-item"
                :class="{
                  active: currentRemindWay === item.label,
                }"
                v-for="(item, index) in remindWayOptions"
                :key="index"
                @click="remindWayClick(item, index)"
              >
                {{ item.value }}
              </div>
            </div>
            <div class="cont">
              {{ msgContent }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelFuc">取消</el-button>
      <el-button type="primary" @click="sureFuc">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getMesTemplateByType,
  patRemindSetting,
  getDictionary,
} from "@/api/modules/dataCollection";

export default {
  name: "remindDIalog",
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    var validRemindDateType = (rule, value, callback) => {
      if (this.formData.remindType == "2" && !value) {
        callback(new Error("请选择周期"));
      } else {
        callback();
      }
    };
    var validRemindSize = (rule, value, callback) => {
      if (this.formData.remindType == "2" && !value) {
        callback(new Error("请选择次数"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        remindTarget: "",
        remindWay: ["SYSTEM"],
        remindType: "1",
        remindSize: "",
        remindDateType: "",
        remindDateDetail: "",
        templateId: "",
      },
      // 单次id
      remindTypeD: "",
      // 连续性id
      remindTypeL: "",
      rules: {
        remindTarget: [
          {
            required: true,
            message: "请选择提醒指标",
            trigger: ["change", "blur"],
          },
        ],
        remindWay: [
          {
            required: true,
            message: "请选择提醒方式",
            trigger: ["change", "blur"],
          },
        ],
        remindType: [
          {
            required: true,
            message: "请选择提醒设置",
            trigger: ["change", "blur"],
          },
        ],
        templateId: [
          {
            required: true,
            message: "请选择提醒模板",
            trigger: ["change", "blur"],
          },
        ],
        remindDateType: [
          { validator: validRemindDateType, trigger: ["change", "blur"] },
        ],
        remindDateDetail: [
          { validator: validRemindDateType, trigger: ["change", "blur"] },
        ],
        remindSize: [
          { validator: validRemindSize, trigger: ["change", "blur"] },
        ],
      },
      remindWayOptions: [
        {
          label: "SYSTEM",
          value: "系统消息",
          disabled: true,
        },
        {
          label: "WECHAT",
          value: "公众号服务",
        },
        {
          label: "SMS",
          value: "短信消息",
        },
      ],
      monthOptions: [
        {
          label: "月",
          value: "MONTH",
        },
        {
          label: "天",
          value: "DAY",
        },
      ],
      dayOptions: [],
      timeOptions: [],
      tempData: [],
      currentRemindWay: "SYSTEM",
      msgContent: "",
    };
  },
  computed: {},
  watch: {
    userInfo: {
      handler(val) {
        if (val?.diseaseCode === "e7fc61f10f284097b79ea226722c1da0") {
          this.$set(this.formData, "remindTarget", "BP");
        } else if (val?.diseaseCode === "5530e6c1ca1b4122b247756aae636c80") {
          this.$set(this.formData, "remindTarget", "BS");
        }
      },
      immediate: true,
      deep: true,
    },
    "formData.remindDateType": {
      handler(val) {
        if (val === "MONTH") {
          this.$set(this.formData, "remindDateDetail", "15日");
        } else if (val === "DAY") {
          this.$set(this.formData, "remindDateDetail", "08:00");
        }
      },
      immediate: true,
      deep: true,
    },
    "formData.remindType": {
      handler(val) {
        if (val == "1") {
          this.$set(this.formData, "remindDateType", "");
          this.$set(this.formData, "remindDateDetail", "");
          this.$set(this.formData, "remindSize", "");
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // 字典
    this.getDictionaryFuc(() => {
      this.getTemData();
    });
    this.initData();
  },
  methods: {
    async getDictionaryFuc(fn) {
      try {
        let params = {
          id: "e0f85dc1a526437c806a1083a9d9c372",
          code: "MES_TEMPLATE_CLASSIFY",
        };
        let { code, result } = await getDictionary(params);
        if (code === 0) {
          console.log("获取字典数据", result);
          let arr = result || [];
          arr.forEach((item) => {
            if (item.code === "REMIND_ONCE") {
              this.remindTypeD = item.VALUE;
            } else if (item.code === "REMIND_CONT") {
              this.remindTypeL = item.VALUE;
            }
          });
          fn && fn();
        }
      } catch (error) {}
    },
    remindTypeChange(val) {
      this.tempData = [];
      this.$set(this.formData, "templateId", "");
      this.templateChange();
      if (!val) {
        return;
      }
      this.getTemData();
    },
    // 获取模板
    async getTemData() {
      let classFy =
        this.formData.remindType === "1"
          ? this.remindTypeD
          : this.formData.remindType === "2"
          ? this.remindTypeL
          : "";
      try {
        let params = {
          classFy,
          targetType: this.formData.remindTarget,
        };
        let { code, result } = await getMesTemplateByType(params);
        if (code === 0) {
          console.log("获取模板数据", result);
          this.tempData = result;
        }
      } catch (error) {}
    },
    templateChange(val) {
      console.log(val);
      this.formData.templateIdObj = {};
      this.currentRemindWay = "SYSTEM";
      if (!val) {
        this.getMsgContent();
        return;
      }
      let arr = this.tempData.filter((item) => {
        return item.id === val;
      });
      let obj = arr?.length ? arr[0] : {};
      this.formData.templateIdObj = obj;
      this.getMsgContent();
    },
    remindWayClick(item, index) {
      this.currentRemindWay = item.label;
      this.getMsgContent();
    },
    getMsgContent() {
      let cont =
        this.formData.templateIdObj?.mesTemplateMap?.[this.currentRemindWay] ||
        "";
      console.log("patNamepatNamepatNamepatName", cont);
      let str = cont.replace(/patName/g, this.userInfo?.patientName);
      this.msgContent = str;
    },
    // 保存
    sureFuc() {
      this.$refs.remindForm.validate(async (valid) => {
        if (valid) {
          try {
            let way = this.formData.remindWay;
            let remindWay = way && way.length ? way.join(",") : "";
            let params = {
              patId: this.userInfo?.patId || "",
              remindTarget: this.formData.remindTarget,
              remindWay,
              remindType: this.formData.remindType,
              remindSize: this.formData.remindSize,
              remindDateType: this.formData.remindDateType,
              remindDateDetail: this.formData.remindDateDetail,
              templateId: this.formData.templateId,
            };

            let { code } = await patRemindSetting(params);
            if (code === 0) {
              this.$message.success("保存成功！");
              this.cancelFuc();
            }
          } catch (error) {}
        }
      });
    },
    // 取消
    cancelFuc() {
      this.$emit("remindClose");
    },
    // 循环日期跟次数
    initData() {
      let dayOptions = [];
      let timeOptions = [];
      for (var i = 1; i <= 28; i++) {
        let val = i + "日";
        dayOptions.push({
          label: val,
          value: val,
        });
        if (i <= 12) {
          timeOptions.push({
            label: i + "次",
            value: i + "",
          });
        }
      }
      this.dayOptions = dayOptions;
      this.timeOptions = timeOptions;
    },
  },
};
</script>

<style lang='scss' scoped>
.remindDIalog {
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
  .label {
    padding: 5px;
    margin: 15px 10px 20px 82px;
    font-size: 14px;
    background-color: #f6f7fb;
    color: #333333;
    font-size: 14px;
  }
  .label1 {
    width: 152px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    padding-left: 5px;
  }
  .msg-cont {
    width: 400px;
    margin-top: 10px;
    .label-list {
      display: flex;
      justify-content: space-between;
      .label-item {
        width: 128px;
        height: 22px;
        line-height: 22px;
        border-radius: 2px 2px 0px 0px;
        background-color: #9d9d9d;
        color: #fff;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
      }
      .label-item.active {
        background-color: #4468bd;
      }
    }
    .cont {
      height: 130px;
      padding: 5px;
      line-height: 20px;
      border-radius: 0px 0px 2px 2px;
      background-color: #fff;
      border: 1px solid #4468bd;
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
  :deep(.el-form-item__label) {
    line-height: 30px;
  }
  :deep(.el-form-item__content) {
    line-height: 30px;
  }
  .remindDateTypeCls {
    display: inline-block;
  }
}
</style>