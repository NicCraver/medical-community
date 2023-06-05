<template>
  <div class="medRecordIndex" v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <div class="cont-box">
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="医疗机构："
                :value="basicInfo.yljgmc || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="组织机构代码："
                :value="basicInfo.yljgdm || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="医疗付费方式："
                code="CV07.10.003"
                :value="basicInfo.ylfylylbdl || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="健康卡号："
                :value="basicInfo.jkkh || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="住院次数："
                :value="`第${basicInfo.zycs || '0'}次`"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="病案号："
                :value="basicInfo.bah || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="姓名："
                :value="personalNamePrivacy(basicInfo.xm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="性别："
                :value="basicInfo.xb"
                code="GB/T 2261.1-2003"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="出生日期：" :value="birthday"></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="年龄："
                :value="(basicInfo.nl || '--') | keyFormat('岁')"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="国籍："
                :value="basicInfo.gj || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8"> </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="年龄（不足1周岁）："
                :value="basicInfo.month || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="新生儿出生体重："
                :value="(basicInfo.xsecstz || '') | keyFormat('克')"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="新生儿入院体重："
                :value="(basicInfo.xserytz || '') | keyFormat('克')"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="出生地："
                :value="basicInfo.csd || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="籍贯："
                :value="basicInfo.jg || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="民族："
                code="GB 3304-1991"
                :value="basicInfo.mz || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="身份证号："
                :value="personalIdPrivacy(basicInfo.sfzh) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="职业："
                :value="basicInfo.zymc || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="婚姻："
                :value="basicInfo.hyzk || ''"
                code="GB/T 2261.2-2003"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="16">
              <dispalyCell
                title="现住址："
                :value="nowAddr || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="电话："
                :value="personalTelPrivacy(basicInfo.xzzdh) || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="户口地址："
                :value="registerAddr || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="16">
              <dispalyCell
                title="工作单位及地址："
                :value="companyInfo || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="单位电话："
                :value="basicInfo.gzdwdh || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell title="联系人姓名：">
                <template #value>
                  <span :title="personalNamePrivacy(basicInfo.lxrxm) || ''">{{
                    personalNamePrivacy(basicInfo.lxrxm) || ""
                  }}</span
                  >（关系：
                  <span
                    v-codeTransform
                    code="GB/T 4761-2008"
                    :val="basicInfo.lxryhzdgx"
                  ></span
                  >）
                </template>
              </dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="联系人电话："
                :value="personalTelPrivacy(basicInfo.lxrdh) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="地址：" :value="lxrdz"></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="住院过程信息" name="2">
        <div class="cont-box">
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell title="入院途径：" :value="rytj || ''"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="入院时间："
                :value="basicInfo.rysj || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="入院科别："
                :value="basicInfo.ryksmc || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="入院病房："
                :value="basicInfo.rybqf || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="转科科别："
                :value="zkksbm"
                code="DEPT_DIC"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="出院科别："
                :value="basicInfo.cyksbm || ''"
                code="DEPT_DIC"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="出院时间："
                :value="basicInfo.cysj || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="出院病房："
                :value="basicInfo.cybqf || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="实际住院天数："
                :value="(basicInfo.sjzyts || '') | keyFormat('天')"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="16">
              <dispalyCell title="离院方式：" :value="cyfs || ''"></dispalyCell>
            </el-col>
            <el-col :span="5">
              <dispalyCell
                title="是否有出院31天内再入院计划："
                :value="basicInfo.sfycy31tnzzyjh || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="3" v-if="basicInfo.sfycy31tnzzyjh !== '无'">
              <dispalyCell
                title="目的："
                :value="basicInfo.cy31tnzzymd || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="颅脑损伤患者入院前昏迷时间："
                :value="basicInfo.lnsshzryqhmsj || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="颅脑损伤患者入院后昏迷时间："
                :value="basicInfo.lnsshzryhhmsj || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="诊疗信息" name="3">
        <div class="cont-box">
          <div
            v-if="
              basicInfo.zllb == '1' ||
              basicInfo.zllb == '11' ||
              basicInfo.zllb == '12'
            "
          >
            <el-row class="line">
              <el-col :span="8">
                <dispalyCell
                  title="治疗类别："
                  :value="basicInfo.zllb"
                  code="CT01.00.007"
                ></dispalyCell>
              </el-col>
              <el-col :span="8">
                <dispalyCell
                  title="使用医疗机构中药制剂："
                  :value="ifYes(basicInfo.syyljgzyzj || '')"
                ></dispalyCell>
              </el-col>
              <el-col :span="8">
                <dispalyCell
                  title="使用中医诊疗设备："
                  :value="ifYes(basicInfo.syzyzlsb || '')"
                ></dispalyCell>
              </el-col>
            </el-row>
            <el-row class="line">
              <el-col :span="8">
                <dispalyCell
                  title="使用中医诊疗技术："
                  :value="ifYes(basicInfo.syzyzljs || '')"
                ></dispalyCell>
              </el-col>
              <el-col :span="8">
                <dispalyCell title="辩证施护：" :value="bzsh"></dispalyCell>
              </el-col>
              <el-col :span="8">
                <dispalyCell
                  title="实施临床路径："
                  :value="sslclj"
                ></dispalyCell>
              </el-col>
            </el-row>
            <el-row class="line">
              <el-col :span="16">
                <dispalyCell
                  title="门急诊诊断（中医诊断）："
                  :value="basicInfo.mjzzdzyzd || ''"
                ></dispalyCell>
              </el-col>
              <el-col :span="8">
                <dispalyCell
                  title="疾病编码："
                  :value="basicInfo.mjzzdzyzdjbdm || ''"
                ></dispalyCell>
              </el-col>
            </el-row>
            <!--  <el-row class="line">
              <el-col :span="16">
                <dispalyCell
                  title="门急诊诊断（西医诊断）："
                  :value="basicInfo.mjzzdzyzd || ''"
                ></dispalyCell>
              </el-col>
              <el-col :span="8">
                <dispalyCell title="疾病编码：" :value="basicInfo.mjzzdzyzdjbdm || ''"></dispalyCell>
              </el-col>
            </el-row> -->
          </div>
          <el-row v-else class="line">
            <el-col :span="16">
              <dispalyCell
                title="门 （急） 诊诊断："
                :value="basicInfo.mjzzdzyzd || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="疾病编码："
                :value="basicInfo.mjzzdzyzdjbdm || ''"
              ></dispalyCell>
            </el-col>
            <!-- <el-col :span="8">
              <dispalyCell title="入院情况：" value=""></dispalyCell>
            </el-col> -->
          </el-row>
          <div class="check-box">
            <el-table
              ref="singleTable"
              highlight-current-row
              style="width: 100%"
              :data="ipMrhpDiagnosisList"
              element-loading-text="列表正在加载中"
            >
              <template slot="empty">无诊断数据</template>
              <el-table-column
                class="overflow-point"
                v-for="(item, index) in dischargeDiagnosis"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :label="item.label"
                :fixed="item.fixed === true"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'rybq'">
                    {{
                      scope.row[item.prop] === "1"
                        ? "危"
                        : scope.row[item.prop] === "2"
                        ? "急"
                        : "一般"
                    }}
                  </template>
                  <template v-else-if="item.prop === 'sfzyzd'">
                    {{ scope.row[item.prop] === "1" ? "中医" : "西医" }}
                  </template>
                  <template v-else-if="item.prop === 'zyzdbz'">
                    {{ scope.row[item.prop] === "1" ? "主要诊断" : scope.row[item.prop] === "2" ? "其他诊断" : ""}}
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row class="line">
            <el-col :span="16">
              <dispalyCell
                title="损伤、中毒的外部原因："
                :value="`${basicInfo.sszddwbys || ''}${
                  basicInfo.sszddwbys2 ? '；' + basicInfo.sszddwbys2 : ''
                }${basicInfo.sszddwbys3 ? '；' + basicInfo.sszddwbys3 : ''}`"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="疾病编码："
                :value="basicInfo.sszddwbyydjbbm || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="病理诊断："
                :value="resData.blzd"
              ></dispalyCell>
              <!-- code="CT01.00.029" -->
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="疾病编码："
                :value="resData.blzddm"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="病理号："
                :value="basicInfo.blh || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="药物过敏："
                :value="basicInfo.ywgm || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="死亡患者尸检："
                :value="ifYes(basicInfo.swhzsfsj || '')"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="血型：" :value="aboxxdm || ''"></dispalyCell>
            </el-col>
          </el-row>
          <div class="check-box">
            <el-table
              ref="singleTable"
              highlight-current-row
              style="width: 100%"
              :data="operateData"
              element-loading-text="列表正在加载中"
            >
              <template slot="empty">无手术记录</template>
              <el-table-column
                class="overflow-point"
                v-for="(item, index) in operate"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :label="item.label"
                :fixed="item.fixed === true"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'ssjb'">
                    <span
                      v-codeTransform
                      code="CV05.10.024"
                      :val="scope.row.ssjb"
                    ></span>
                  </template>
                  <template v-else-if="item.prop === 'qkyhdj'">
                    <span
                      v-codeTransform
                      code="CV05.10.023"
                      :val="scope.row.qkyhdj"
                    ></span>
                  </template>
                  <template
                    v-else-if="
                      item.hasOwnProperty('tag') &&
                      item.tag.indexOf('doctor') > -1
                    "
                  >
                    {{ doctorNamePrivacy(scope.row[item.prop] || "") }}
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="出院小结" name="4">
        <div class="cont-box">
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell
                title="入院日期："
                :value="ipOutHosSummary.rysj || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="出院日期："
                :value="ipOutHosSummary.cysj || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="住院天数："
                :value="(ipOutHosSummary.zyts || '') | keyFormat('天')"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="入院诊断："
                :value="ipOutHosSummary.ryzd || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="出院诊断："
                :value="ipOutHosSummary.cyzd || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="入院情况："
                :value="ipOutHosSummary.ryszyzzjtz || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="辅助检查："
                :value="ipOutHosSummary.sysjcjzyhz || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="诊疗经过："
                :value="ipOutHosSummary.zlgc || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="出院情况："
                :value="ipOutHosSummary.cysqk || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell
                title="出院医嘱："
                :value="ipOutHosSummary.cyyz || ''"
                :isCollpase="false"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell title="病情转归：" :value="zljg"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="住院医师："
                :value="doctorNamePrivacy(ipOutHosSummary.zyysxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell
                title="上级医师："
                :value="doctorNamePrivacy(ipOutHosSummary.zzysxm) || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="医护人员信息" name="5">
        <div class="cont-box">
          <el-row class="line">
            <el-col :span="6">
              <dispalyCell
                title="科主任："
                :value="doctorNamePrivacy(basicInfo.kzrxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="主任（副主任医师）："
                :value="doctorNamePrivacy(basicInfo.fzrysxm) || ''"
              ></dispalyCell>
            </el-col>
            <!-- <el-col :span="6">
              <dispalyCell
                title="主诊医师："
                :value="ipOutHosSummary.zzysxm || ''"
              ></dispalyCell>
            </el-col> -->
            <el-col :span="6">
              <dispalyCell
                title="主治医师："
                :value="doctorNamePrivacy(basicInfo.zzysxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="住院医师："
                :value="doctorNamePrivacy(basicInfo.zyysxm) || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="6">
              <dispalyCell
                title="责任护士："
                :value="doctorNamePrivacy(basicInfo.zrhsxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="进修医师："
                :value="doctorNamePrivacy(basicInfo.jxysxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="实习医师："
                :value="doctorNamePrivacy(basicInfo.sxysxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="编码员："
                :value="doctorNamePrivacy(basicInfo.bmyxm) || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="6">
              <dispalyCell title="病案质量：" :value="bazl"></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="质控医师："
                :value="doctorNamePrivacy(basicInfo.zkysxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="质控护士："
                :value="doctorNamePrivacy(basicInfo.zkhsxm) || ''"
              ></dispalyCell>
            </el-col>
            <el-col :span="6">
              <dispalyCell
                title="质控日期："
                :value="basicInfo.zkrq || ''"
              ></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import dispalyCell from "@/components/displayCell/dispalyCell";
import { getIpMainMrById } from "api/healthEvent";

import { getBirthdayFromIdCard } from "@/utils/utils.js";
import { mapGetters } from "vuex";

export default {
  name: "medRecordIndex",
  components: {
    dispalyCell,
  },
  computed: {
    ...mapGetters({
      personalNamePrivacy: "base/personalNamePrivacy",
      personalIdPrivacy: "base/personalIdPrivacy",
      personalTelPrivacy: "base/personalTelPrivacy",
      personalAddPrivacy: "base/personalAddPrivacy",
      doctorNamePrivacy: "base/doctorNamePrivacy",
    }),
    birthday() {
      return getBirthdayFromIdCard(this.basicInfo.sfzh || "");
    },
    // 户口地址
    registerAddr: function () {
      let dz = this.personalAddPrivacy(
        this.basicInfo.hkdzqt || "",
        this.basicInfo.hkdzs || "",
        this.basicInfo.hkdzx || "",
        this.basicInfo.hkdzxzjdbsc || "",
        this.basicInfo.hkdzcjlnd || "",
        this.basicInfo.hkdznphm || ""
      );
      /* dz = this.personalAddPrivacy(
         "省",
        "市",
        "区",
       "乡镇",
        "街道",
        "门牌号"
      ); */
      let hkyb = this.basicInfo.hkyb ? `(${this.basicInfo.hkyb})` : "";
      return dz + hkyb;
    },
    // 现住址
    nowAddr: function () {
      let xzzyb = this.basicInfo.xzzyb ? `(${this.basicInfo.xzzyb})` : "";
      return `${this.basicInfo.jzdxzz || ""}${xzzyb}`;
    },
    // 工作单位及地址
    companyInfo: function () {
      let gzdwyb = this.basicInfo.gzdwyb ? `(${this.basicInfo.gzdwyb})` : "";
      return (
        (this.basicInfo.gzdw || "") +
        "," +
        this.personalAddPrivacy(
          this.basicInfo.gzdwdzsqs || "",
          this.basicInfo.gzdwdzs || "",
          this.basicInfo.gzdwdzx || "",
          this.basicInfo.gzdwdzxz || "",
          this.basicInfo.gzdwdzcjlnd || "",
          this.basicInfo.gzdwdzmphm || ""
        ) +
        gzdwyb
      );
    },
    // 联系人地址
    lxrdz() {
      return this.personalAddPrivacy(
        this.basicInfo.lxrdzsqs || "",
        this.basicInfo.lxrdzs || "",
        this.basicInfo.lxrdzx || "",
        this.basicInfo.lxrdzxz || "",
        this.basicInfo.lxrdzcjlnd || "",
        this.basicInfo.lxrdzmphm || ""
      );
    },
    rytj() {
      switch (this.basicInfo.rytj) {
        case "1":
          return "门诊";
        case "2":
          return "急诊";
        case "3":
          return "其他医疗机构转入";
        case "4":
          return "基层转入";
        case "5":
          return "本院出生";
        case "7":
          return "隔离";
        case "9":
          return "其他";
      }
    },
    cyfs: function () {
      switch (this.basicInfo.cyfs) {
        case "1":
          return "医嘱离院";
        case "2":
          return `医嘱转院${
            this.basicInfo.lyhnjsyljgmc
              ? "，拟接收医院：" + this.basicInfo.lyhnjsyljgmc
              : ""
          }`;
        case "3":
          return `医嘱转社区卫生服务机构/乡镇卫生院${
            this.basicInfo.lyhnjsyljgmc
              ? "，拟接收医院：" + this.basicInfo.lyhnjsyljgmc
              : ""
          }`;
        case "4":
          return "非医嘱离院";
        case "5":
          return "死亡";
        case "6":
          return "向上转诊";
        case "9":
          return "其他";
      }
    },
    bazl: function () {
      switch (this.basicInfo.bazl) {
        case "1":
          return "甲";
        case "2":
          return "乙";
        case "3":
          return "丙";
      }
    },
    sslclj: function () {
      switch (this.basicInfo.sslclj) {
        case "1":
          return "中医";
        case "2":
          return "西医";
        case "3":
          return "否";
      }
    },
    bzsh: function () {
      switch (this.basicInfo.bzsh) {
        case "1":
          return "是";
        case "2":
          return "否";
      }
    },
    aboxxdm: function () {
      let cont = "";
      switch (this.basicInfo.aboxxdm) {
        case "1":
          cont = "A型";
          break;
        case "2":
          cont = "B型";
          break;
        case "3":
          cont = "O型";
          break;
        case "4":
          cont = "AB型";
          break;
        case "5":
          cont = "不详";
          break;
        case "9":
          cont = "未查";
          break;
      }
      switch (this.basicInfo.rhxxdm) {
        case "1":
          cont += " Rh:阴性";
          break;
        case "2":
          cont += " Rh:阳性";
          break;
        case "3":
          cont += " Rh:不详";
          break;
        case "4":
          cont += " Rh:未查";
          break;
      }
      return cont;
    },
    zljg: function () {
      switch (this.ipOutHosSummary.zljg) {
        case "1":
          return "治愈";
        case "2":
          return "好转";
        case "3":
          return "稳定";
        case "4":
          return "恶化";
        case "5":
          return "死亡";
        case "9":
          return "其他";
      }
    },
    zkksbm() {
      let basicInfo = this.basicInfo;
      let zkksbm1 =
        basicInfo.zkksbm1 === undefined ||
        basicInfo.zkksbm1 === null ||
        basicInfo.zkksbm1 === ""
          ? ""
          : `${basicInfo.zkksbm1}`;
      let zkksbm2 =
        basicInfo.zkksbm2 === undefined ||
        basicInfo.zkksbm2 === null ||
        basicInfo.zkksbm2 === ""
          ? ""
          : `,${basicInfo.zkksbm2}`;
      let zkksbm3 =
        basicInfo.zkksbm3 === undefined ||
        basicInfo.zkksbm3 === null ||
        basicInfo.zkksbm3 === ""
          ? ""
          : `,${basicInfo.zkksbm3}`;
      return `${zkksbm1}${zkksbm2}${zkksbm3}`;
    },
  },
  filters: {
    keyFormat(val, key) {
      if (val) {
        return val + key;
      }
      return "";
    },
  },
  props: {
    // 健康档案

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
      loading: false,
      operate: [
        {
          prop: "ssczbm",
          width: "120",
          label: "手术及操作编码",
        },
        {
          prop: "ssqssj",
          width: "180",
          label: "手术及操作日期",
        },
        {
          prop: "ssjb",
          width: "80",
          label: "手术级别",
        },
        {
          prop: "ssczmc",
          width: "300",
          label: "手术及操作名称",
        },
        {
          prop: "qkyhdj",
          width: "140",
          label: "切口愈合等级",
        },
        {
          // prop: "ssysiizxm",
          prop: "mzffmc",
          width: "100",
          label: "麻醉方式",
        },
        {
          prop: "ssysxm",
          width: "80",
          label: "术者",
          tag: ["doctor"],
        },
        {
          prop: "ssysizxm",
          width: "70",
          label: "I助",
          tag: ["doctor"],
        },
        {
          prop: "ssysiizxm",
          width: "120",
          label: "Ⅱ助",
          tag: ["doctor"],
        },
        {
          // prop: "ssysiizxm",
          prop: "mzysxm",
          width: "120",
          label: "麻醉医师",
          tag: ["doctor"],
        },
      ],
      dischargeDiagnosis: [
        {
          prop: "ynjbzdmc",
          width: "200",
          label: "出院诊断",
        },
        {
          prop: "ynjbzddm",
          label: "疾病编码",
        },
        {
          prop: "zyzdbz",
          width: "120",
          label: "是否主要诊断",
        },
        {
          prop: "rybq",
          label: "入院病情",
        },
        {
          prop: "sfzyzd",
          width: "120",
          label: "类型",
        },
      ],
      ipMrhpDiagnosisList: [],
      tableLoading: false,
      operateData: [],
      activeNames: ["3", "4"],
      resData: {},
      basicInfo: {},
      personalArchiveMainInfo: {},
      ipOutHosSummary: {},
      personalArchiveInfo: {},
    };
  },
  watch: {
    personalInfos: {
      handler(val) {},
      deep: true,
      immediate: true,
    },
    navBarObj: {
      handler(val) {
        console.log("病患首页", val.serialNumber);
        this.getList();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  destroyed() {},
  methods: {
    ifYes(val) {
      if (val === "1") {
        return "是";
      } else if (val === "2") {
        return "否";
      } else {
        return "-";
      }
    },
    async getList() {
      this.basicInfo = {};
      this.personalArchiveMainInfo = {};
      this.ipOutHosSummary = {};
      this.personalArchiveInfo = {};
      this.operateData = [];
      this.ipMrhpDiagnosisList = [];
      if (!this.navBarObj.serialNumber || !this.navBarObj.hosCode) {
        return;
      }
      this.loading = true;
      try {
        let res = await getIpMainMrById({
          serialNumber: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode,
          pAId: this.$route.params.pAId,
        });
        console.log("住院-病患首页", res);
        if (res.code === 0) {
          this.resData = res.result;
          this.basicInfo = res.result.ipMainMrhp || {};
          this.personalArchiveMainInfo =
            res.result.personalArchiveMainInfo || {};
          this.ipOutHosSummary = res.result.ipOutHosSummary || {};
          this.personalArchiveInfo = res.result.personalArchiveInfo || {};
          if (
            res.result.ipMrhpSurgeryOpLogList &&
            res.result.ipMrhpSurgeryOpLogList.length > 0
          ) {
            this.operateData = res.result.ipMrhpSurgeryOpLogList;
            console.log("手术记录", this.operateData);
          }
          if (
            res.result.ipMrhpDiagnosisList &&
            res.result.ipMrhpDiagnosisList.length > 0
          ) {
            this.ipMrhpDiagnosisList = res.result.ipMrhpDiagnosisList;
            console.log("出院诊断录", this.ipMrhpDiagnosisList);
          }
          this.$emit("getMainData", {
            basicInfo: this.basicInfo,
            personalArchiveMainInfo: this.personalArchiveMainInfo,
            ipOutHosSummary: this.ipOutHosSummary,
            personalArchiveInfo: this.personalArchiveInfo,
            operateData: this.operateData,
            ipMrhpDiagnosisList: this.ipMrhpDiagnosisList,
          });
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.medRecordIndex {
  margin-top: -10px;
  border: 1px solid transparent;
  .cont-box {
    padding: 2px 10px;
    .line {
      margin-bottom: 12px;
      font-size: 14px;
    }
    .line:last-child {
      //  margin-bottom: 0;
    }
    .check-box {
      border: 1px solid #ebeef5;
      border-bottom: none;
      margin-bottom: 12px;
      ::v-deep.el-table thead {
        color: #919191;
      }
      .el-table {
        color: #101010;
        .el-table__cell {
          padding: 1px 0;
        }
        ::v-deep th {
          padding: 3px 0;
        }
        ::v-deep td {
          padding: 1px 0;
        }
        ::v-deep .el-table__empty-block {
          min-height: 32px;
        }
        ::v-deep .el-table__empty-text {
          line-height: 32px;
        }
        ::v-deep thead th {
          background-color: #f7f7f7 !important;
          color: #919191;
        }
      }
    }
  }
  ::v-deep .el-collapse-item__content {
    padding-bottom: 0;
  }
  ::v-deep .el-collapse {
    border: none !important;
  }
  ::v-deep .el-collapse-item {
    box-shadow: 0px 1px 1px 1px rgba(223, 223, 223, 0.4);
    border-left: solid 1px rgba(223, 223, 223, 0.4);
    border-right: solid 1px rgba(223, 223, 223, 0.4);
  }
  ::v-deep .el-collapse-item__wrap {
    border-bottom: none;
  }

  ::v-deep .el-collapse-item__header {
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
