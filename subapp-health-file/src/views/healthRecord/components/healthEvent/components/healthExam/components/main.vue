<template>
  <div class="main-content">
    <div class="main-left-cont" id="left-cont" v-loading="loading">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          :name="item.name"
        >
          <div class="cont-box">
            <template
              v-if="item.children && item.children.length && item.firstName"
            >
              <el-row class="line">
                <el-col
                  v-for="(value, key) in item.children"
                  :key="key"
                  :span="
                    showHandler(value, value.firstName || item.firstName)
                      ? value.span
                      : 0
                  "
                >
                  <!-- 腹部-压痛 等 ,无的话显示无，有的话显示有+描述-->
                  <template v-if="value.prop0">
                    <div :class="showValueCls(item)">
                      <span
                        :class="{
                          'item-title':
                            item.name === '11' || item.name === '12',
                        }"
                        v-if="value.label"
                      >
                        {{ value.label || "" }}：
                      </span>
                      <span
                        class="item-detail"
                        :class="detailCls(item)"
                        :title="`${showValueZB(item, value)}${showValue(
                          item,
                          value,
                          true
                        )}`"
                      >
                        {{ showValueZB(item, value) }}
                        {{ showValue(item, value) }}
                        <span class="unitCls">{{ value.unit || "" }}</span>
                        <!-- 数据异常 -->
                        <template
                          v-if="showValueZB(item, value) === '数据异常'"
                        >
                          <el-popover
                            placement="bottom"
                            title="提示"
                            width="60"
                            trigger="hover"
                            content="值域超范围，请检查数据"
                          >
                            <IconSvg
                              slot="reference"
                              iconClass="quesicon"
                              style="color: #919191"
                              width="16"
                              height="16"
                            ></IconSvg>
                          </el-popover>
                        </template>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <div :class="showValueCls(item)">
                      <span
                        :class="{
                          'item-title':
                            item.name === '11' || item.name === '12',
                        }"
                        v-if="value.label"
                      >
                        {{ value.label || "" }}：
                      </span>
                      <span
                        class="item-detail"
                        :class="detailCls(item)"
                        :title="`${showValue(item, value, true)}`"
                      >
                        {{ showValue(item, value) }}
                        <span class="unitCls">{{ value.unit || "" }}</span>
                      </span>
                    </div>
                  </template>
                </el-col>
              </el-row>
            </template>
            <template v-else>
              <template v-if="item.hasOwnProperty('table')">
                <div class="table-cont">
                  <el-table :data="examData[item.firstName]" border>
                    <el-table-column
                      v-for="(val, key) in item.table"
                      :key="key"
                      :label="val.label"
                      :prop="val.prop"
                      :min-width="val.width"
                    >
                      <template slot-scope="scope">
                        <template v-if="val.prop === 'dcsyjl'">
                          <!-- 用量+单位 -->
                          {{ scope.row[val.prop] }}
                          {{ scope.row.syjldw }}
                        </template>
                        <template v-else>
                          {{ scope.row[val.prop] }}
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
              <template v-else-if="item.hasOwnProperty('tables')">
                <div
                  v-for="(tableItem, tableIndex) in item.tables"
                  :key="tableIndex"
                >
                  <div
                    class="table-top"
                    :style="{
                      'border-left': `3px solid ${tableItem.leftBorderColor}`,
                    }"
                  >
                    {{ tableItem.tableName }}
                  </div>
                  <div class="table-cont table-cont-bgc">
                    <el-table :data="examData[tableItem.firstName]" border>
                      <el-table-column
                        v-for="(val, key) in tableItem.table"
                        :key="key"
                        :label="val.label"
                        :prop="val.prop"
                        :min-width="val.width"
                      >
                        <template slot-scope="scope">
                          <template v-if="val.prop === 'oprate'">
                            <el-button type="text">报告</el-button>
                            <el-button type="text">图像</el-button>
                          </template>
                          <template v-else-if="val.prop === 'jczbjg'">
                            <div class="result-cont">
                              <div>{{ scope.row.jczbjg }}</div>
                              <!-- <div
                                v-if="
                                  Number(scope.row.jczbjg) >
                                  Number(scope.row.ckz)
                                "
                              >
                                <div
                                  class="el-icons el-icon-top"
                                  style="color: #ff4d4f"
                                ></div>
                              </div>
                              <div
                                v-else-if="
                                  Number(scope.row.jczbjg) <
                                  Number(scope.row.ckz)
                                "
                              >
                                <i
                                  class="el-icons el-icon-bottom"
                                  style="color: #5e84d7"
                                ></i>
                              </div> -->
                              <div v-if="scope.row.ycts === '3'">
                                <i
                                  class="el-icons el-icon-top"
                                  style="color: #ff4d4f"
                                ></i>
                              </div>
                              <div v-else-if="scope.row.ycts === '4'">
                                <i
                                  class="el-icons el-icon-bottom"
                                  style="color: #5e84d7"
                                ></i>
                              </div>
                            </div>
                          </template>
                          <template v-else>{{ scope.row[val.prop] }}</template>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="main-right-cont">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in list"
          :key="index"
          :icon="item.icon"
          :color="currentIndex === index ? '' : 'transparent'"
          :type="currentIndex === index ? 'primary' : ''"
        >
          <div
            class="timeLine-item overflow-point"
            :class="{ activity: currentIndex === index }"
            :title="item.title || ''"
            @click="clickItem(item, index)"
          >
            {{ item.title }}
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
// 列表生成数据
let listInit = [
  {
    title: "症状",
    name: "1",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "zzmc",
        label: "症状",
        span: 24,
        isShow: true,
      },
    ],
  },
  {
    title: "一般情况",
    name: "2",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "tw",
        label: "体温",
        unit: "℃",
        span: 8,
        isShow: true,
      },
      {
        prop: "ml",
        label: "脉率",
        unit: "次/分钟",
        span: 8,
        isShow: true,
      },
      {
        prop: "hxpl",
        label: "呼吸频率",
        unit: "次/分钟",
        span: 8,
        isShow: true,
      },
      {
        prop: "lSbp",
        propS: "lSbp",
        propD: "lDbp",
        label: "左侧血压",
        unit: "mmHg",
        span: 8,
        isShow: true,
      },
      {
        prop: "rSbp",
        propS: "rSbp",
        propD: "rDbp",
        label: "右侧血压",
        unit: "mmHg",
        span: 8,
        isShow: true,
      },
      {
        prop: "height",
        label: "身高",
        unit: "cm",
        span: 8,
        isShow: true,
      },
      {
        prop: "weight",
        label: "体重",
        unit: "kg",
        span: 8,
        isShow: true,
      },
      {
        prop: "hips",
        label: "腰围",
        unit: "cm",
        span: 8,
        isShow: true,
      },
      {
        prop: "bmi",
        label: "体质指数（BMI）",
        unit: "Kg/m²",
        span: 8,
        isShow: true,
      },
      {
        prop: "lnrjkzwpgmc",
        label: "老年人健康状态自我评估",
        span: 8,
        tag: ["aged"],
        isShow: true,
      },
      {
        prop: "lnrzlnlpgmc",
        label: "老年人生活自理能力自我评估",
        span: 16,
        tag: ["aged"],
        isShow: true,
      },
      {
        prop: "lnrrsgnmc",
        label: "老年人认知功能",
        span: 8,
        tag: ["aged"],
        isShow: true,
      },
      {
        prop: "zlztjczf",
        label: "简易智力状态检查，总分",
        span: 8,
        tag: ["aged"],
        isShow: true,
      },
      {
        prop: "lnrqgztmc",
        label: "老年人情感状态",
        span: 8,
        tag: ["aged"],
        isShow: true,
      },
      {
        prop: "yypfjczf",
        label: "老年人抑郁评分检查，总分",
        span: 8,
        tag: ["aged"],
        isShow: true,
      },
    ],
  },
  {
    title: "生活方式",
    name: "3",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "dlplmc",
        label: "体育锻炼频率",
        span: 8,
        isShow: true,
      },
      {
        prop: "mcdlsj",
        label: "每次锻炼时间",
        span: 8,
        unit: "分钟",
        tag: ["exercise"],
        isShow: true,
      },
      {
        prop: "jcdlsj",
        label: "坚持锻炼",
        span: 8,
        unit: "年",
        tag: ["exercise"],
        isShow: true,
      },
      {
        prop: "dlfs",
        label: "锻炼方式",
        span: 8,
        tag: ["exercise"],
        isShow: true,
      },
      {
        prop: "ysxgmc",
        label: "饮食习惯",
        span: 16,
        isShow: true,
      },
      {
        prop: "xyzkmc",
        label: "吸烟状况",
        span: 4,
        isShow: true,
      },
      {
        prop: "rxyl",
        label: "日吸烟量",
        span: 4,
        unit: "支",
        tag: ["smoke"],
        isShow: true,
      },
      {
        prop: "ksxynl",
        label: "开始吸烟年龄",
        span: 8,
        unit: "岁",
        tag: ["smoke"],
        isShow: true,
      },
      {
        prop: "jynl",
        label: "戒烟年龄",
        span: 8,
        unit: "岁",
        tag: ["smoke", "quitSmoke"],
        isShow: true,
      },
      {
        prop: "yjplmc",
        label: "饮酒频率",
        span: 4,
        isShow: true,
      },
      {
        prop: "ryjl",
        label: "日饮酒量",
        unit: "两",
        tag: ["drink"],
        span: 4,
        isShow: true,
      },
      {
        prop: "sfjj",
        label: "是否戒酒",
        tag: ["drink"],
        span: 4,
        isShow: true,
        transObj: {
          0: "否",
          1: "是",
        },
      },
      {
        prop: "jjnl",
        label: "戒酒年龄",
        unit: "岁",
        tag: ["drink", "quitDrink"],
        span: 4,
        isShow: true,
      },
      {
        prop: "ksyjnl",
        label: "开始饮酒年龄",
        unit: "岁",
        tag: ["drink"],
        span: 8,
        isShow: true,
      },
      {
        prop: "sfzj",
        label: "近一年内是否曾醉酒",
        tag: ["drink"],
        span: 8,
        isShow: true,
        transObj: {
          0: "否",
          1: "是",
        },
      },
      {
        prop: "yjzlmc",
        label: "饮酒种类",
        tag: ["drink"],
        span: 16,
        isShow: true,
      },
      {
        firstName: "proExposedRecord",
        prop: "proExposedRecord",
        label: "职业危害因素接触史",
        span: 8,
        isShow: true,
      },
      {
        firstName: "proExposedRecord",
        prop: "zybljtzy",
        label: "工种",
        span: 8,
        isShow: true,
      },
      {
        firstName: "proExposedRecord",
        prop: "zyblcysj",
        label: "从业时间",
        unit: "年",
        span: 8,
        isShow: true,
      },
      {
        firstName: "proExposedRecord",
        prop: "zyblzlmc",
        label: "毒物种类",
        span: 8,
        isShow: true,
      },
      {
        firstName: "proExposedRecord",
        prop: "sfjj",
        label: "防护措施",
        span: 8,
        isShow: true,
        transObj: {
          0: "无",
          1: "有",
        },
      },
      {
        firstName: "proExposedRecord",
        prop: "zyfhfs",
        label: "具体措施",
        span: 8,
        isShow: true,
        tag: ["safeProce"],
      },
    ],
  },
  {
    title: "脏器功能",
    name: "4",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "kqkcmc",
        label: "口腔-口唇",
        span: 8,
        isShow: true,
      },
      {
        prop: "kqclmc",
        label: "口腔-齿列",
        span: 8,
        isShow: true,
      },
      {
        prop: "kqybmc",
        label: "咽部",
        span: 8,
        isShow: true,
      },
      {
        prop: "slzy",
        label: "视力-左眼",
        span: 8,
        isShow: true,
        precision: "1",
      },
      {
        prop: "slyy",
        label: "视力-右眼",
        span: 8,
        isShow: true,
        precision: "1",
      },
      {
        prop: "jzslzy",
        label: "矫正视力-左眼",
        span: 8,
        isShow: true,
        precision: "1",
      },
      {
        prop: "jzslyy",
        label: "矫正视力-右眼",
        span: 8,
        isShow: true,
        precision: "1",
      },
      {
        prop: "tlmc",
        label: "听力",
        span: 8,
        isShow: true,
      },
      {
        prop: "hdnlmc",
        label: "运动功能",
        span: 8,
        isShow: true,
      },
    ],
  },
  {
    title: "查体",
    name: "5",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "ydycms",
        prop0: "ydycbz",
        label: "眼底",
        span: 8,
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "pfmc",
        label: "皮肤",
        span: 8,
        isShow: true,
      },
      {
        prop: "gmmc",
        label: "巩膜",
        span: 8,
        isShow: true,
      },
      {
        prop: "lbjmc",
        label: "淋巴结",
        span: 8,
        isShow: true,
      },
      {
        prop: "ftzxbz",
        label: "肺-桶状胸",
        span: 8,
        isShow: true,
        transObj: {
          0: "否",
          1: "是",
        },
      },
      {
        prop: "fhxyycms",
        prop0: "fhxybz",
        label: "肺-呼吸音",
        span: 8,
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "xtpl",
        label: "心脏-心率",
        span: 8,
        unit: "次/分钟",
        isShow: true,
      },
      {
        prop: "xlmc",
        label: "心率",
        span: 8,
        isShow: true,
      },
      {
        prop: "xzzyms",
        label: "杂音",
        span: 8,
        isShow: true,
      },
      {
        prop: "fbytms",
        prop0: "fbytdm",
        label: "腹部-压痛",
        span: 8,
        isShow: true,
        transObj0: {
          0: "无",
          1: "有",
        },
      },
      {
        prop: "fbbkms",
        prop0: "fbbkdm",
        label: "腹部-包块",
        span: 8,
        isShow: true,
        transObj0: {
          0: "无",
          1: "有",
        },
      },
      {
        prop: "fbgdms",
        prop0: "fbgddm",
        label: "腹部-肝大",
        span: 8,
        isShow: true,
        transObj0: {
          0: "无",
          1: "有",
        },
      },
      {
        prop: "fbpdms",
        prop0: "fbpddm",
        label: "腹部-脾大",
        span: 8,
        isShow: true,
        transObj0: {
          0: "无",
          1: "有",
        },
      },
      {
        prop: "fbydxzyms",
        prop0: "fbydxzydm",
        label: "腹部-移动性浊音",
        span: 8,
        isShow: true,
        transObj0: {
          0: "无",
          1: "有",
        },
      },
      {
        prop: "xzszmc",
        label: "下肢水肿",
        span: 8,
        isShow: true,
      },
      {
        prop: "zbdmbdmc",
        label: "足部动脉搏动",
        span: 8,
        isShow: true,
      },
      {
        prop: "gmzzmc",
        label: "肛门指诊",
        span: 8,
        isShow: true,
      },
      {
        prop: "rxmc",
        label: "乳腺",
        span: 8,
        isShow: true,
      },
      {
        prop: "fkwyms",
        prop0: "fkwydm",
        label: "妇科-外阴",
        span: 8,
        tag: ["women"],
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "fkydms",
        prop0: "fkyddm",
        label: "妇科-阴道",
        span: 8,
        tag: ["women"],
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "fkgjms",
        prop0: "fkgjdm",
        label: "妇科-宫颈",
        span: 8,
        tag: ["women"],
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "fkgtms",
        prop0: "fkgtdm",
        label: "妇科-宫体",
        span: 8,
        tag: ["women"],
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "fkfjms",
        prop0: "fkfjdm",
        label: "妇科-附件",
        span: 8,
        tag: ["women"],
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "ctqt",
        label: "查体-其它",
        span: 24,
        isShow: true,
      },
    ],
  },
  {
    title: "辅助检查",
    name: "6",
  },
  {
    title: "现存主要健康问题",
    name: "7",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "nxgjbmc",
        label: "脑血管疾病",
        span: 8,
        isShow: true,
      },
      {
        prop: "szjbmc",
        label: "肾脏疾病",
        span: 8,
        isShow: true,
      },
      {
        prop: "xzjbmc",
        label: "心脏疾病",
        span: 8,
        isShow: true,
      },
      {
        prop: "xgjbmc",
        label: "血管疾病",
        span: 8,
        isShow: true,
      },
      {
        prop: "ybjbmc",
        label: "眼部疾病",
        span: 8,
        isShow: true,
      },
      {
        prop: "sjxtjbqtms",
        prop0: "sjxtjbbz",
        label: "神经系统疾病",
        span: 8,
        isShow: true,
        transObj0: {
          0: "未发现",
          1: "有",
        },
      },
      {
        prop: "qtxtjbqtms",
        prop0: "qtxtjbdm",
        label: "其它疾病",
        span: 24,
        isShow: true,
        transObj0: {
          0: "未发现",
          1: "有",
        },
      },
    ],
  },
  {
    title: "住院治疗情况",
    name: "8",
    tables: [
      {
        tableName: "住院史",
        firstName: "meInhospitalRecordList",
        leftBorderColor: "transparent",
        table: [
          {
            prop: "rysj",
            label: "入院日期",
            width: "120",
          },
          {
            prop: "cysj",
            label: "出院日期",
            width: "90",
          },
          {
            prop: "zyyy",
            label: "原因",
            width: "90",
          },
          {
            prop: "zyyljgmc",
            label: "医疗机构名称",
            width: "100",
          },
          {
            prop: "bah",
            label: "病案号",
            width: "120",
          },
        ],
      },
      {
        tableName: "家庭病床史",
        firstName: "homeSickbedRecordList",
        leftBorderColor: "transparent",
        table: [
          {
            prop: "jcrq",
            label: "建床日期",
            width: "",
          },
          {
            prop: "ccrq",
            label: "撤床日期",
            width: "",
          },
          {
            prop: "jcyy",
            label: "原因",
            width: "",
          },
          {
            prop: "jcyljgmc",
            label: "医疗机构名称",
            width: "",
          },
          {
            prop: "bah",
            label: "病案号",
            width: "",
          },
        ],
      },
    ],
  },
  {
    title: "主要用药情况",
    name: "9",
    firstName: "medicalexamMedicineRecordList",
    table: [
      {
        prop: "ywmc",
        label: "药物名称",
        width: "120",
      },
      {
        prop: "sytjmc",
        label: "用法",
        width: "90",
      },
      {
        prop: "dcsyjl",
        label: "用量",
        width: "90",
      },
      {
        prop: "yysj",
        label: "用药时间",
        width: "100",
      },
      {
        prop: "fyycxmc",
        label: "服药依从性",
        width: "120",
      },
    ],
  },
  {
    title: "非免疫规划预防接种史",
    name: "10",
    firstName: "nonImmuVaccinationRecordList",
    table: [
      {
        prop: "ymmc",
        label: "疫苗名称",
        width: "150",
      },
      {
        prop: "jzrq",
        label: "接种日期",
        width: "150",
      },
      {
        prop: "jzjgmc",
        label: "接种机构",
        width: "150",
      },
    ],
  },
  {
    title: "健康评价",
    name: "11",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "jkpjycqtms",
        prop0: "jkpj",
        label: "",
        isShow: true,
        transObj0: {
          0: "体检无异常",
          1: "",
        },
      },
    ],
  },
  {
    title: "健康指导",
    name: "12",
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "jkzdmc",
        label: "健康指导",
        isShow: true,
      },
      {
        prop: "wxyskzmc",
        label: "危险因素控制",
        isShow: true,
      },
    ],
  },
];
// 辅助检查两种展示形式
let assistCheck = {
  // 平铺显示
  rowType: {
    firstName: "medicalExamRecord",
    children: [
      {
        prop: "eee",
        label: "血常规",
        span: 24,
        isShow: true,
      },
      {
        prop: "fff",
        label: "尿常规",
        span: 24,
        isShow: true,
      },
      {
        prop: "ggg3",
        label: "空腹血糖",
        span: 24,
        isShow: true,
      },
      {
        prop: "xdtyc",
        prop0: "xdtbz",
        label: "心电图",
        span: 24,
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "iii3",
        label: "大便潜血",
        span: 24,
        isShow: true,
      },
      {
        prop: "jjj3",
        label: "糖化血红蛋白",
        span: 24,
        isShow: true,
      },
      {
        prop: "kkk3",
        label: "乙型肝炎表面抗原",
        span: 24,
        isShow: true,
      },
      {
        prop: "lll3",
        label: "肝功能",
        span: 24,
        isShow: true,
      },
      {
        prop: "mmm3",
        label: "肾功能",
        span: 24,
        isShow: true,
      },
      {
        prop: "nnn3",
        label: "血脂",
        span: 24,
        isShow: true,
      },
      {
        prop: "xbxxpyc",
        prop0: "xbxxpbz",
        label: "胸部X线片",
        span: 24,
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        // prop: "bcyc",
        // prop0: "bcbz",
        prop: "aaa",
        label: "B超",
        span: 24,
        isShow: true,
        // transObj0: {
        //   0: "未见异常",
        //   1: "异常",
        // },
      },
      {
        prop: "gjtpyc",
        prop0: "gjtpbz",
        label: "宫颈涂片",
        span: 24,
        tag: ["women"],
        isShow: true,
        transObj0: {
          0: "未见异常",
          1: "异常",
        },
      },
      {
        prop: "fzjcqt",
        label: "其它",
        span: 24,
        isShow: true,
      },
    ],
  },
  // 表格显示
  tableType: {
    tables: [
      /* {
        firstName: "medicalExamListRecordList3",
        tableName: "检查项目",
        leftBorderColor: "#38a97e",
        table: [
          {
            prop: "jczbmc",
            label: "项目",
            width: "100",
          },
          {
            prop: "jczbjg",
            label: "结果",
            width: "200",
          },
          {
            prop: "oprate",
            label: "操作",
            width: "100",
          },
        ],
      }, */
    ],
    tableColumns: {
      firstName: "",
      tableName: "",
      leftBorderColor: "#446bbd",
      table: [
        {
          prop: "jczbmc",
          label: "项目",
          width: "180",
        },
        {
          prop: "jczbjg",
          label: "结果",
          width: "100",
        },
        {
          prop: "jldw",
          label: "单位",
          width: "100",
        },
        {
          prop: "ckz",
          label: "参考值",
          width: "120",
        },
        {
          prop: "jcff",
          label: "检测方法",
          width: "160",
        },
      ],
    },
  },
};

import { getMedicalExamRecordById } from "@/api/modules/healthEvent/index.js";

import { throttle, deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";

export default {
  name: "mainContent",
  components: {},
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    // 导航传过来的内容
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      activeNames: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],
      list: [],
      currentIndex: 0,
      flag: false,
      loading: false,
      examData: {
        homeSickbedRecordList: [],
        meInhospitalRecordList: [],
        medicalExamListRecordList: [],
        medicalExamRecord: {},
        medicalexamMedicineRecordList: [],
        nonImmuVaccinationRecordList: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      personalArchInfo: "base/personalArchInfo",
    }),
    gender() {
      return this.personalArchInfo.personalArchiveInfo
        ? this.personalArchInfo.personalArchiveInfo.gender
        : "";
    },
  },
  watch: {
    navBarObj: {
      handler(val) {
        if (val.serialNumber) {
          this.$nextTick(() => {
            this.clickItem(this.list[0], 0);
          });
          this.getMedicalExamRecord();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    let list = [...listInit];
    this.$set(list, 5, {
      ...list[5],
      tables: [],
      // ...assistCheck.rowType,
    });
    this.list = list;
  },
  mounted() {
    this.$nextTick(() => {
      document
        .getElementById("left-cont")
        .addEventListener("scroll", this.handleTabFix);
    });
  },
  methods: {
    async getMedicalExamRecord() {
      this.loading = true;
      try {
        let { code, result } = await getMedicalExamRecordById({
          mEId: this.navBarObj.serialNumber || "",
        });
        console.log("体检数据：", result);
        if (code === 0) {
          let examData = result;
          let sortedObj = this.getAssayCheckData(
            examData.medicalExamListRecordList
          );
          this.examData = {
            ...examData,
            ...sortedObj,
            homeSickbedRecordList: examData.homeSickbedRecordList || [],
            meInhospitalRecordList: examData.meInhospitalRecordList || [],
            medicalExamListRecordList: examData.medicalExamListRecordList || [],
            medicalExamRecord: examData.medicalExamRecord || {},
            medicalexamMedicineRecordList:
              examData.medicalexamMedicineRecordList || [],
            nonImmuVaccinationRecordList:
              examData.nonImmuVaccinationRecordList || [],
          };
          this.$emit("getExamData", this.examData);
          this.$emit("getMainData", this.examData);
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 检验数据分类
    getAssayCheckData(list) {
      const sorted = this.groupBy(list, (item) => {
        return item.jcxmdldm;
      });
      console.log("sorted", sorted);
      // 渲染检验表格数据
      let tableColumns = deepClone(assistCheck.tableType.tableColumns);
      let tables = [];
      for (let i in sorted) {
        let item = sorted[i];
        tables.push({
          ...tableColumns,
          firstName: i,
          tableName: item[0].jcxmdlmc,
        });
      }
      this.$set(this.list[5], "tables", tables);
      return sorted;
    },
    // 分组方法
    groupBy(array, f) {
      let groups = {};
      array.forEach((item) => {
        let group = f(item);
        groups["medicalExamListRecordList" + group] = [
          ...(groups["medicalExamListRecordList" + group] || []),
          ...(groups[group] || []),
        ];
        groups["medicalExamListRecordList" + group].push(item);
      });
      return groups;
    },
    // 内容的样式显示
    showValueCls(item) {
      let flag = item.name === "11" || item.name === "12";
      return {
        "line-item": flag,
        "col-item": !flag,
        "overflow-point": !flag,
      };
    },
    // 具体内容的样式显示
    detailCls(item) {
      let flag = item.name === "11" || item.name === "12";
      return {
        "detail-break": flag,
      };
    },
    // 异常字段显示
    showValueZB(item, value) {
      let firstName = value.firstName || item.firstName;
      if (!this.examData[firstName] || !value.prop0) {
        return "";
      }
      let zb = this.examData[firstName][value.prop0] || "";
      let cont0 = value.transObj0[zb];
      if (zb === "0") {
        // 无异常
        return cont0;
      } else if (cont0) {
        // 异常
        return `${cont0}，`;
      } else if (cont0 === "") {
        // 不显示异常二字
        return ``;
      } else {
        // 其他情况
        return `数据异常`;
      }
    },
    // 字段显示内容处理
    showValue(item, value, isUnit) {
      let firstName = value.firstName || item.firstName;
      if (!this.examData[firstName]) {
        return "";
      }
      if (value.prop0 && this.examData[firstName][value.prop0] === "0") {
        return "";
      }
      let cont = this.examData[firstName][value.prop] || "";
      if (value.precision) {
        cont = Number(cont || 0).toFixed(1);
      }
      // 血压
      if (value.prop == "lSbp" || value.prop == "rSbp") {
        return (
          (this.examData[firstName][value.propS] || "--") +
          "/" +
          (this.examData[firstName][value.propD] || "--") +
          (isUnit ? value.unit || "" : "")
        );
      }
      // 职业危害因素接触史
      if (value.prop == "proExposedRecord") {
        return this.examData[firstName] ? "有" : "无";
      }
      // 口腔齿列
      if (value.prop == "kqclmc") {
        return (
          cont +
          "," +
          this.examData[firstName]["kqclwz"] +
          "," +
          this.examData[firstName]["kqclms"]
        );
      }
      // 健康指导
      if (value.prop == "wxyskzmc") {
        let weight = `（目标：${this.examData[firstName]["jtzmb"]}kg）`;
        let vaccine = `（${this.examData[firstName]["jyjzymmc"]}）`;
        let weightIndex = cont.indexOf("减体重");
        let contNew =
          weightIndex > -1
            ? cont.slice(0, weightIndex + 3) +
              weight +
              cont.slice(weightIndex + 3)
            : cont;
        let vaccineIndex = contNew.indexOf("疫苗");
        let contNew0 =
          vaccineIndex > -1
            ? contNew.slice(0, vaccineIndex + 2) +
              vaccine +
              contNew.slice(vaccineIndex + 2)
            : cont;
        return contNew0;
      }
      if (value.transObj) {
        return (
          (value.transObj[cont] || "--") + (isUnit ? value.unit || "" : "")
        );
      }
      if (this.showValueZB(item, value) === "数据异常") {
        return "";
      }
      return (cont || "--") + (isUnit ? value.unit || "" : "");
    },
    clickItem(item, index) {
      this.currentIndex = index;
      this.flag = true;
      this.handleToggle();
    },
    handleTabFix: throttle(function () {
      if (this.flag) {
        return;
      }
      let height = 0;
      for (let i in this.list) {
        let itemHeight =
          document
            .getElementById("left-cont")
            .getElementsByClassName("el-collapse-item")[i].offsetHeight + 10;
        let scrollTop = document.getElementById("left-cont").scrollTop;
        let leftContHeight = document.getElementById("left-cont").offsetHeight;
        let elCollapseHeight = document
          .getElementById("left-cont")
          .getElementsByClassName("el-collapse")[0].offsetHeight;
        height += itemHeight;
        if (height > scrollTop) {
          if (scrollTop + leftContHeight == elCollapseHeight) {
            break;
          }
          /* let currentIndex = this.currentIndex;
          if (Number(i) > currentIndex) {
            for (let j = 0; j <= Number(i) - currentIndex; j++) {
              this.currentIndex = currentIndex + 1;
            }
          } else if (Number(i) < currentIndex) {
            for (let j = 0; j <= currentIndex - Number(i); j++) {
              this.currentIndex = currentIndex - 1;
            }
          } */
          this.currentIndex = Number(i);
          break;
        }
      }
    }, 300),
    handleToggle() {
      let scrollTop = 0;
      for (let i in this.list) {
        let itemHeight =
          document
            .getElementById("left-cont")
            .getElementsByClassName("el-collapse-item")[i].offsetHeight + 10;

        if (i < this.currentIndex) {
          console.log(1, itemHeight);
          scrollTop += itemHeight;
        }
      }
      document.getElementById("left-cont").scrollTo(0, scrollTop);
      setTimeout(() => {
        this.flag = false;
      }, 350);
    },
    // 控制各个字段的显示与隐藏
    showHandler(item, firstName) {
      let data = this.examData[firstName] || {};
      if (item.hasOwnProperty("tag") && item.tag.length) {
        if (item.tag.indexOf("aged") > -1) {
          // 老年人字段显示条件：>= 65岁
          if (data["age"] && data["age"] < 65) {
            return false;
          } else if (
            item.prop === "zlztjczf" &&
            data.lnrrsgnmc &&
            data.lnrrsgnmc.indexOf("阳性") <= -1
          ) {
            return false;
          } else if (
            item.prop === "yypfjczf" &&
            data.lnrqgztmc &&
            data.lnrqgztmc.indexOf("阳性") <= -1
          ) {
            return false;
          }
          return true;
        }
        if (item.tag.indexOf("women") > -1 && this.gender != "2") {
          // 女性
          return false;
        }
        if (item.tag.indexOf("exercise") > -1 && data.dlpldm == "4") {
          // 锻炼
          return false;
        }
        if (item.tag.indexOf("smoke") > -1) {
          // 吸烟
          if (data.xyzkdm == "4") {
            // 从不吸烟
            return false;
          }
          if (item.tag.indexOf("quitSmoke") > -1 && data.xyzkdm != "3") {
            // 戒烟
            return false;
          }
        }

        if (item.tag.indexOf("drink") > -1) {
          // 饮酒
          if (data.yjpldm == "1") {
            // 从不喝酒
            return false;
          }
          if (item.tag.indexOf("quitDrink") > -1 && data.sfjj != "1") {
            // 戒酒
            return false;
          }
        }

        // 防护措施
        if (item.tag.indexOf("safeProce") > -1) {
          if (data.sfjj === "0") {
            // 防护措施为无，不显示具体措施
            return false;
          }
        }
      }
      return true;
    },
  },
  beforeDestroy() {
    // document.getElementById("left-cont").removeEventListener("scroll");
  },
  destroyed() {},
};
</script>

<style lang="scss">
.main-content {
  height: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: flex-start;
  .main-left-cont {
    width: calc(100% - 160px);
    height: 100%;
    overflow-y: auto;
    padding-right: 10px;
    margin-right: 0;
    .cont-box {
      padding: 2px 10px;
      .table-top {
        height: 32px;
        line-height: 32px;
        padding-left: 7px;
        background-color: rgba(247, 247, 247, 100);
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
        font-weight: bold;
        font-family: SourceHanSansSC-regular;
        border: 1px solid #ebeef5;
        border-bottom: none;
      }
      .table-cont {
        padding-bottom: 10px;
        .el-table__cell {
          padding: 4px 0;
        }
        .result-cont {
          display: flex;
          justify-content: space-between;
          .el-icons {
            width: 20px;
            height: 20px;
            font-weight: bold;
          }
        }
      }
      .table-cont-bgc .el-table__cell {
        background-color: #fff !important;
      }
      .line {
        margin-bottom: 12px;
        font-size: 14px;
        .col-item {
          height: 34px;
          line-height: 34px;
          color: #919191;
          font-size: 14px;
          font-family: SourceHanSansSC-regular;
          cursor: pointer;
        }
        .line-item {
          line-height: 34px;
          color: #919191;
          font-size: 14px;
          font-family: SourceHanSansSC-regular;
          cursor: pointer;
          display: flex;
          justify-content: flex-start;
        }
        .item-detail {
          color: #333;
          .unitCls {
            display: inline-block;
            color: #919191;
            margin-left: 3px;
          }
        }
        .detail-break {
          display: inline-block;
          width: 100%;
          word-wrap: break-word;
        }
        .item-title {
          min-width: 100px;
        }
      }
    }
  }
  .main-right-cont {
    width: 150px;
    height: 100%;
    padding: 10px 0 10px 5px;
    overflow-y: auto;
    .timeLine-item {
      width: 100%;
      line-height: 20px;
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      text-align: left;
      font-family: Roboto;
      cursor: pointer;
    }
    .activity {
      color: #5e84d7;
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse {
    border: none !important;
  }
  .el-collapse-item {
    box-shadow: 0px 1px 1px 1px rgba(223, 223, 223, 0.4);
    border-left: solid 1px rgba(223, 223, 223, 0.4);
    border-right: solid 1px rgba(223, 223, 223, 0.4);
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }

  .el-collapse-item__header {
    background: #f7f7f7;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0px 1px 1px 1px rgba(223, 223, 223, 0.4);
    margin: 10px 0;
    padding-left: 10px;
  }
}
</style>
