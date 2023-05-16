<!--
 * @Author: Nic
 * @Date: 2023-03-29 10:22:54
 * @LastEditTime: 2023-03-29 14:47:44
 * @LastEditors: Nic
 * @Description: FullInformation
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/PatientCenter/BasicArchives/FullInformation.vue
-->
<template>
  <el-scrollbar style="height: calc(100% - 50px)">
    <div class="basic-archives">
      <!-- <div class="title" style="justify-content: center">个人基本信息表</div> -->
      <div class="archive-info bg-box">
        <el-form inline :disabled="isDisabled">
          <el-form-item label="建档人">
            <el-input v-model="pageInfo.joinDrName"></el-input>
          </el-form-item>
          <el-form-item label="建档机构">
            <OrgHosSelect ref="hosRef" v-model="pageInfo.joinHosId" :parentId="orgId" placeholder="机构"></OrgHosSelect>
          </el-form-item>
          <el-form-item label="建档日期">
            <el-date-picker
              style="width: 160px"
              value-format="yyyy-MM-dd"
              type="date"
              v-model="pageInfo.patient.archiveDate"
            />
          </el-form-item>
          <el-form-item label="责任医生">
            <el-select v-model="pageInfo.patient.doctorUserId" filterable style="width: 140px">
              <el-option
                v-for="item in applyDrs"
                :key="item.doctorUserId"
                :label="item.doctorUserName"
                :value="item.doctorUserId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="update-time">上次更新时间：{{ pageInfo.patient.modDate }}</div>
      </div>
      <!-- <patient-info-card :currentTime="currentTime" tagFlag :isDisabled="isDisabled" @refreshLogs="getLogList" /> -->
      <div class="patient-basic-info bg-box">
        <div class="title">
          基本信息
          <IconSvg
            iconClass="arrow"
            :class="['arrow', { stretch: !basicInfoStretchFlag }]"
            @click.native="handleChangeStretch('basicInfoStretchFlag')"
          />
        </div>
        <el-form
          label-width="95px"
          label-position="left"
          :rules="basicRules"
          :model="pageInfo.patient"
          :class="['retract', { stretch: basicInfoStretchFlag }]"
          :disabled="isDisabled"
          ref="basicInfo"
        >
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="pageInfo.patient.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族：" prop="nation">
                <el-select v-model="pageInfo.patient.nation" filterable>
                  <!-- <el-option label="请选择" value="" /> -->
                  <el-option v-for="item in nationList" :label="item.LABLE" :value="item.VALUE" :key="item.VALUE" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：" prop="sex">
                <el-radio-group v-model="pageInfo.patient.sex">
                  <el-radio :label="value" :key="value" v-for="(value, key) in sexMap">{{ key }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号：" prop="idNo">
                <el-input v-model="pageInfo.patient.idNo" @input="idNoChange" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker disabled value-format="yyyy-MM-dd" type="date" v-model="pageInfo.patient.birthday" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="常住类型：" prop="patType">
                <el-radio-group v-model="pageInfo.patient.patType">
                  <el-radio label="1">户籍</el-radio>
                  <el-radio label="2">非户籍</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="本人电话：" prop="phoneNo">
                <el-input v-model="pageInfo.patient.phoneNo" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人姓名：" label-width="110px" prop="contactName">
                <el-input v-model="pageInfo.patient.contactName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人电话：" label-width="110px" prop="contactPhone">
                <el-input v-model="pageInfo.patient.contactPhone" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作单位：" prop="workUnits">
                <el-input v-model="pageInfo.patient.workUnits" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="居住地址：" prop="address">
                <AddressCascader ref="cascader" v-model="pageInfo.patient.address" />
                <!-- <el-cascader
                  v-model="pageInfo.patient.address"
                  :options="areaList"
                  :props="{ value: 'id' }"
                  ref="cascader"
                /> -->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址：" prop="street">
                <el-input v-model="pageInfo.patient.street" />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="mut-radio">
              <el-form-item label="血型：" prop="blood">
                <el-radio-group v-model="pageInfo.patient.blood">
                  <el-radio label="1">A型</el-radio>
                  <el-radio label="2">B型</el-radio>
                  <el-radio label="3">O型</el-radio>
                  <el-radio label="4">AB型</el-radio>
                  <el-radio label="5">不详</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="RH：" prop="RH">
                <el-radio-group v-model="pageInfo.patient.RH">
                  <el-radio label="1">阴性</el-radio>
                  <el-radio label="2">阳性</el-radio>
                  <el-radio label="3">不详</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="knowledge-level bg-box">
        <div class="title">
          文化程度
          <IconSvg
            iconClass="arrow"
            :class="['arrow', { stretch: !knowledgeLevelStretchFlag }]"
            @click.native="handleChangeStretch('knowledgeLevelStretchFlag')"
          />
        </div>
        <el-form
          label-width="95px"
          label-position="left"
          :rules="basicRules"
          :model="pageInfo.patient"
          :class="['retract', { stretch: knowledgeLevelStretchFlag }]"
          :disabled="isDisabled"
          ref="cultureForm"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="文化程度：" prop="eduLevel">
                <el-radio-group v-model="pageInfo.patient.eduLevel">
                  <el-radio :label="item.value" :value="item.value" :key="item.value" v-for="item in knowledgeList">{{
                    item.label
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="职业：" prop="careerCode">
                <el-radio-group v-model="pageInfo.patient.careerCode">
                  <el-radio :label="item.value" :value="item.value" :key="item.value" v-for="item in positionList">{{
                    item.label
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="婚姻状况：" prop="maritalStatus">
                <el-radio-group v-model="pageInfo.patient.maritalStatus">
                  <el-radio :label="item.value" :value="item.value" :key="item.value" v-for="item in marriageList">{{
                    item.label
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="医疗费用支付方式：" label-width="155px" prop="payType">
                <el-radio-group v-model="pageInfo.patient.payType">
                  <el-radio :label="item.value" :value="item.value" :key="item.value" v-for="item in paymentList">{{
                    item.label
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="药物过敏史：" label-width="110px" prop="drugAllergy">
                <el-radio-group v-model="pageInfo.patient.drugAllergy">
                  <el-radio
                  :label="item.value"
                  :value="item.value"
                  :key="item.value"
                  v-for="item in allergyList">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暴露史：" prop="exposureHistory">
                <el-radio-group v-model="pageInfo.patient.exposureHistory">
                  <el-radio
                  :label="item.value"
                  :value="item.value"
                  :key="item.value"
                  v-for="item in exposeList">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
      <div class="history bg-box">
        <div class="title">
          既往史
          <IconSvg
            iconClass="arrow"
            :class="['arrow', { stretch: !historyStretchFlag }]"
            @click.native="handleChangeStretch('historyStretchFlag')"
          />
        </div>

        <div :class="['retract', { stretch: historyStretchFlag }]" ref="historyStretchFlag">
          <el-form
            label-width="95px"
            label-position="left"
            :rules="basicRules"
            :model="pageInfo.patient"
            :disabled="isDisabled"
            ref="historyForm"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="药物过敏史：" label-width="110px" prop="drugAllergy">
                  <el-checkbox-group v-model="pageInfo.patient.drugAllergy">
                    <el-checkbox
                      :label="item.value"
                      :value="item.value"
                      :key="item.value"
                      v-for="item in allergyList"
                      :disabled="
                        !!pageInfo.patient.drugAllergy.length &&
                        ((item.value === '1' && pageInfo.patient.drugAllergy.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.patient.drugAllergy.indexOf('1') > -1))
                      "
                      >{{ item.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="暴露史：" prop="exposureHistory">
                  <el-checkbox-group v-model="pageInfo.patient.exposureHistory">
                    <el-checkbox
                      :label="item.value"
                      :value="item.value"
                      :key="item.value"
                      v-for="item in exposeList"
                      :disabled="
                        !!pageInfo.patient.exposureHistory.length &&
                        ((item.value === '1' && pageInfo.patient.exposureHistory.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.patient.exposureHistory.indexOf('1') > -1))
                      "
                      >{{ item.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            label-width="60px"
            label-position="left"
            :model="historyModel"
            :rules="historyRules"
            :disabled="isDisabled"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="疾病" prop="diseaseModel">
                  <el-radio-group v-model="historyModel.diseaseModel" @change="historyRadioChange('disease', '1')">
                    <el-radio label="Y">是</el-radio>
                    <el-radio label="N" :disabled="!!(pageInfo.disease.length - 1)">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div v-show="historyModel.diseaseModel === 'Y'">
            <div class="tab-title">疾病记录</div>
            <el-table
              :data="pageInfo.disease"
              :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'disease')"
              border
              :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'disease')"
            >
              <el-table-column label="疾病编码">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="$index === pageInfo.disease.length - 1"
                    type="text"
                    @click="addTableRow('disease', '1')"
                    :disabled="isDisabled"
                    >添加一行</el-button
                  >
                  <el-select
                    v-model="row.icdCode"
                    filterable
                    clearable
                    @clear="codeClearMethod($index)"
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="icdLoading"
                    :disabled="isDisabled"
                    @change="icdIdChange($index)"
                    v-else
                  >
                    <el-option v-for="item in idcCategory" :label="item.value" :value="item.value" :key="item.value">
                      <span>
                        {{ item.value }}
                        >
                        {{ item.label }}
                      </span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="疾病名称">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="$index === pageInfo.disease.length - 1"
                    type="text"
                    @click="addTableRow('disease', '1')"
                    :disabled="isDisabled"
                    >添加一行</el-button
                  >
                  <el-select
                    v-model="row.medName"
                    allow-create
                    filterable
                    clearable
                    @clear="medNameClearMethod($index)"
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="icdLoading"
                    :disabled="isDisabled"
                    @change="medNameChange($index)"
                    v-else
                  >
                    <el-option v-for="item in idcCategory" :label="item.label" :value="item.label" :key="item.value">
                      <span>
                        {{ item.value }}
                        >
                        {{ item.label }}
                      </span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="疾病描述">
                <template slot-scope="{ row }">
                  <el-input v-model="row.medDesc" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="确诊时间">
                <template slot-scope="{ row }">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    v-model="row.confirmTime"
                    :disabled="isDisabled"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ $index }">
                  <IconSvg v-if="isDisabled" iconClass="delete-disabled" />
                  <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'disease')" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form
            label-width="60px"
            label-position="left"
            :model="historyModel"
            :rules="historyRules"
            :disabled="isDisabled"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="手术" prop="operationModel">
                  <el-radio-group v-model="historyModel.operationModel" @change="historyRadioChange('operation', '2')">
                    <el-radio label="Y">是</el-radio>
                    <el-radio label="N" :disabled="!!(pageInfo.operation.length - 1)">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div v-show="historyModel.operationModel === 'Y'">
            <div class="tab-title">手术记录</div>
            <el-table
              :data="pageInfo.operation"
              :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'operation')"
              border
              :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'operation')"
            >
              <el-table-column label="手术编码">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="$index === pageInfo.operation.length - 1"
                    type="text"
                    @click="addTableRow('operation', '2')"
                    :disabled="isDisabled"
                    >添加一行</el-button
                  >
                  <el-select
                    v-model="row.icdCode"
                    allow-create
                    filterable
                    remote
                    clearable
                    @clear="codeClearMethod2($index)"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod1"
                    :loading="icdLoading"
                    :disabled="isDisabled"
                    @change="icdIdChange2($index)"
                    v-else
                  >
                    <el-option v-for="item in idcOperation" :label="item.value" :value="item.value" :key="item.value">
                      <span>
                        {{ item.value }}
                        >
                        {{ item.label }}
                      </span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="手术名称">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="$index === pageInfo.operation.length - 1"
                    type="text"
                    @click="addTableRow('operation', '2')"
                    :disabled="isDisabled"
                    >添加一行</el-button
                  >
                  <el-select
                    v-model="row.medName"
                    allow-create
                    filterable
                    remote
                    clearable
                    @clear="medNameClearMethod2($index)"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod1"
                    :loading="icdLoading"
                    :disabled="isDisabled"
                    @change="medNameChange2($index)"
                    v-else
                  >
                    <el-option v-for="item in idcOperation" :label="item.label" :value="item.label" :key="item.value">
                      <span>
                        {{ item.value }}
                        >
                        {{ item.label }}
                      </span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="确诊时间">
                <template slot-scope="{ row }">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    v-model="row.confirmTime"
                    :disabled="isDisabled"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ $index }">
                  <IconSvg v-if="isDisabled" iconClass="delete-disabled" />
                  <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'operation')" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form
            label-width="60px"
            label-position="left"
            :model="historyModel"
            :rules="historyRules"
            :disabled="isDisabled"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="外伤" prop="traumaModel">
                  <el-radio-group v-model="historyModel.traumaModel" @change="historyRadioChange('trauma', '3')">
                    <el-radio label="Y">是</el-radio>
                    <el-radio label="N" :disabled="!!(pageInfo.trauma.length - 1)">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div v-show="historyModel.traumaModel === 'Y'">
            <div class="tab-title">外伤记录</div>
            <el-table
              :data="pageInfo.trauma"
              :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'trauma')"
              border
              :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'trauma')"
            >
              <el-table-column label="外伤名称">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="$index === pageInfo.trauma.length - 1"
                    type="text"
                    @click="addTableRow('trauma', '3')"
                    :disabled="isDisabled"
                    >添加一行</el-button
                  >
                  <el-input v-model="row.medName" v-else :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="受伤时间">
                <template slot-scope="{ row }">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    v-model="row.confirmTime"
                    :disabled="isDisabled"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ $index }">
                  <IconSvg v-if="isDisabled" iconClass="delete-disabled" />
                  <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'trauma')" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form
            label-width="60px"
            label-position="left"
            :model="historyModel"
            :rules="historyRules"
            :disabled="isDisabled"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="输血" prop="bloodModel">
                  <el-radio-group v-model="historyModel.bloodModel" @change="historyRadioChange('blood', '4')">
                    <el-radio label="Y">是</el-radio>
                    <el-radio label="N" :disabled="!!(pageInfo.blood.length - 1)">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div v-show="historyModel.bloodModel === 'Y'">
            <div class="tab-title">输血记录</div>
            <el-table
              :data="pageInfo.blood"
              :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'blood')"
              border
              :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'blood')"
            >
              <el-table-column label="输血原因">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="$index === pageInfo.blood.length - 1"
                    type="text"
                    @click="addTableRow('blood', '4')"
                    :disabled="isDisabled"
                    >添加一行</el-button
                  >
                  <el-input v-model="row.medName" v-else :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="输血时间">
                <template slot-scope="{ row }">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    v-model="row.confirmTime"
                    :disabled="isDisabled"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ $index }">
                  <IconSvg v-if="isDisabled" iconClass="delete-disabled" />
                  <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'blood')" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="family-history bg-box">
        <div class="title">
          家族史
          <IconSvg
            iconClass="arrow"
            :class="['arrow', { stretch: !familyStretchFlag }]"
            @click.native="handleChangeStretch('familyStretchFlag')"
          />
        </div>
        <el-form
          label-width="95px"
          label-position="left"
          :model="pageInfo.familyDisease"
          :rules="familyDiseaseRules"
          :class="['retract', { stretch: familyStretchFlag }]"
          :disabled="isDisabled"
          ref="familyForm"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="父亲：" prop="fatherDiseaseCode">
                <el-checkbox-group
                  v-model="pageInfo.familyDisease.fatherDiseaseCode"
                  @change="handleOtherDiseaseChange('father')"
                >
                  <el-checkbox
                    :label="item.value"
                    :key="item.value"
                    v-for="item in diseaseList"
                    :disabled="
                      !!pageInfo.familyDisease.fatherDiseaseCode.length &&
                      ((item.value === '1' && pageInfo.familyDisease.fatherDiseaseCode.indexOf('1') === -1) ||
                        (item.value !== '1' && pageInfo.familyDisease.fatherDiseaseCode.indexOf('1') > -1))
                    "
                    >{{ item.label }}</el-checkbox
                  >
                  <el-form-item
                    v-if="pageInfo.familyDisease.fatherDiseaseCode.indexOf('12') > -1"
                    prop="fatherOtherDisease"
                    style="display: inline-block"
                  >
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-model="pageInfo.familyDisease.fatherOtherDisease"
                    />
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="母亲：" prop="motherDiseaseCode">
                <el-checkbox-group
                  v-model="pageInfo.familyDisease.motherDiseaseCode"
                  @change="handleOtherDiseaseChange('mother')"
                >
                  <el-checkbox
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in diseaseList"
                    :disabled="
                      !!pageInfo.familyDisease.motherDiseaseCode.length &&
                      ((item.value === '1' && pageInfo.familyDisease.motherDiseaseCode.indexOf('1') === -1) ||
                        (item.value !== '1' && pageInfo.familyDisease.motherDiseaseCode.indexOf('1') > -1))
                    "
                    >{{ item.label }}</el-checkbox
                  >
                  <el-form-item
                    v-if="pageInfo.familyDisease.motherDiseaseCode.indexOf('12') > -1"
                    style="display: inline-block"
                    prop="motherOtherDisease"
                  >
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-model="pageInfo.familyDisease.motherOtherDisease"
                    />
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="兄弟姐妹：" prop="siblingDiseaseCode">
                <el-checkbox-group
                  v-model="pageInfo.familyDisease.siblingDiseaseCode"
                  @change="handleOtherDiseaseChange('sibling')"
                >
                  <el-checkbox
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in diseaseList"
                    :disabled="
                      !!pageInfo.familyDisease.siblingDiseaseCode.length &&
                      ((item.value === '1' && pageInfo.familyDisease.siblingDiseaseCode.indexOf('1') === -1) ||
                        (item.value !== '1' && pageInfo.familyDisease.siblingDiseaseCode.indexOf('1') > -1))
                    "
                    >{{ item.label }}</el-checkbox
                  >
                  <el-form-item
                    v-if="pageInfo.familyDisease.siblingDiseaseCode.indexOf('12') > -1"
                    style="display: inline-block"
                    prop="siblingOtherDisease"
                  >
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-model="pageInfo.familyDisease.siblingOtherDisease"
                    />
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="子女：" prop="childrenDiseaseCode">
                <el-checkbox-group
                  v-model="pageInfo.familyDisease.childrenDiseaseCode"
                  @change="handleOtherDiseaseChange('children')"
                >
                  <el-checkbox
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in diseaseList"
                    :disabled="
                      !!pageInfo.familyDisease.childrenDiseaseCode.length &&
                      ((item.value === '1' && pageInfo.familyDisease.childrenDiseaseCode.indexOf('1') === -1) ||
                        (item.value !== '1' && pageInfo.familyDisease.childrenDiseaseCode.indexOf('1') > -1))
                    "
                    >{{ item.label }}</el-checkbox
                  >
                  <el-form-item
                    v-if="pageInfo.familyDisease.childrenDiseaseCode.indexOf('12') > -1"
                    prop="childrenOtherDisease"
                    style="display: inline-block"
                  >
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-model="pageInfo.familyDisease.childrenOtherDisease"
                    />
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="遗传病史：" prop="geneticHistory">
                <el-radio-group v-model="pageInfo.familyDisease.geneticHistory">
                  <el-radio label="0">无</el-radio>
                  <el-radio label="1">有</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="残疾情况：" prop="disabilityCode">
                <el-checkbox-group v-model="pageInfo.familyDisease.disabilityCode">
                  <el-checkbox
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in disabilityList"
                    :disabled="
                      !!pageInfo.familyDisease.disabilityCode.length &&
                      ((item.value === '1' && pageInfo.familyDisease.disabilityCode.indexOf('1') === -1) ||
                        (item.value !== '1' && pageInfo.familyDisease.disabilityCode.indexOf('1') > -1))
                    "
                    >{{ item.label }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="logList">
        <el-table-column label="操作时间" prop="createDate" width="180" />
        <el-table-column label="操作人" prop="createUserName" width="100" />
        <el-table-column label="操作内容" prop="content">
          <template slot-scope="{ row }">
            <p v-if="row.type === 'D'">{{ row.title }}</p>
            <div v-else>
              <p v-for="item in row.modifyLogRecordsDetails" :key="item.id">
                <span v-if="item.oldValue">
                  修改【{{ item.title }}】由<span style="font-style: italic; color: #000">{{ item.oldValue }}</span
                  >变更为<span style="font-style: italic; color: #000">{{ item.newValue }}</span>
                </span>
                <span v-else
                  >完善【{{ item.title }}】为<span style="font-style: italic; color: #000">{{
                    item.newValue
                  }}</span></span
                >
              </p>
              <p v-for="(item, index) in row.listData" :key="index">
                修改【{{ item.type }}】<span
                  v-if="item.oldValue.length"
                  style="cursor: pointer; color: rgba(94, 132, 215, 100); text-decoration: underline"
                  @click="showRecordDialog(item)"
                  >上一次记录</span
                ><span v-else>首次完善无记录</span>
              </p>
            </div>

            <!-- <el-button type="text" v-if="row.type === 'A'" @click="getLogDetail(row)">查看</el-button>
            <span v-else>{{ row.title }}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="actions-fixed">
        <div class="left"></div>
        <div class="right">
          <el-button type="primary" @click="submitPageInfo" v-if="!isDisabled">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>
      <RecordDialog
        :visible="recordDialogVis"
        :tableType="recordDialogType"
        :handleClose="() => (recordDialogVis = false)"
        :oldTableList="oldTableList"
      />
    </div>
  </el-scrollbar>
</template>

<script>
import AddressCascader from '@/components/AddressCascader'
import {
  getPatientRecordById,
  submitPatientRecord,
  getLogList,
  getDiseaseMain,
  getDoctorList,
  getDoctorUserData,
  getIcdDicForOrderBy,
  getDictionary,
} from '@/api/modules/PatientCenter'
// import PatientInfoCard from '../PatientInfoCard.vue'
import { sexMap, paymentList } from '../data-map'
import RecordDialog from '../RecordDialog'
import dayjs from 'dayjs'
export default { 
  data() {
    return {
      orgId: '',
      isDisabled: false,
      pageInfo: {
        patient: {
          doctorUserName: '',
          address: [],
          birthday: '',
          bloodType: '',
          careerCode: '',
          contactName: '',
          contactPhone: '',
          createDate: '',
          drugAllergy: [],
          exposureHistory: [],
          eduLevel: '',
          idNo: '',
          idType: '',
          maritalStatus: '',
          name: '',
          namePy: '',
          nation: '',
          patId: '',
          patType: '',
          phoneNo: '',
          sex: '',
          workUnits: '',
          blood: '',
          RH: '',
          street: '',
          moddate: '',
          archiveDate: '',
          doctorUserId: '',
        },
        disease: [],
        operation: [],
        trauma: [],
        blood: [],
        familyDisease: {
          childrenDiseaseCode: '',
          childrenOtherDisease: '',
          disabilityCode: '',
          fatherDiseaseCode: '',
          fatherOtherDisease: '',
          geneticHistory: '',
          motherDiseaseCode: '',
          motherOtherDisease: '',
          siblingDiseaseCode: '',
          siblingOtherDisease: '',
        },
        log: [],
      },
      sexMap: sexMap,
      applyDrs: [],
      nationList: [
        // { label: '汉族', value: '汉族' },
        // { label: '回族', value: '回族' },
        // { label: '满族', value: '满族' },
      ],
      areaList: [
        {
          children: [
            {
              children: [
                {
                  children: null,
                  id: '3',
                  label: '龙沙区',
                  parentId: '2',
                },
                {
                  children: null,
                  id: '4',
                  label: '富拉尔基区',
                  parentId: '2',
                },
                {
                  children: null,
                  id: '5',
                  label: '讷河市',
                  parentId: '2',
                },
              ],
              id: '2',
              label: '齐齐哈尔',
              parentId: '1',
            },
          ],
          id: '1',
          label: '黑龙江',
          parentId: null,
        },
        // {
        //   "children": [
        //     {
        //       "children": [
        //         {
        //           "id": "120101",
        //           "label": "和平区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120102",
        //           "label": "河东区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120103",
        //           "label": "河西区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120104",
        //           "label": "南开区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120105",
        //           "label": "河北区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120106",
        //           "label": "红桥区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120110",
        //           "label": "东丽区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120111",
        //           "label": "西青区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120112",
        //           "label": "津南区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120113",
        //           "label": "北辰区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120114",
        //           "label": "武清区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120115",
        //           "label": "宝坻区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120116",
        //           "label": "滨海新区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120221",
        //           "label": "宁河区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120223",
        //           "label": "静海区",
        //           "parentId": "120100",
        //           "children": null
        //         },
        //         {
        //           "id": "120225",
        //           "label": "蓟州区",
        //           "parentId": "120100",
        //           "children": null
        //         }
        //       ],
        //       "id": "120100",
        //       "label": "天津市",
        //       "parentId": "120000"
        //     }
        //   ],
        //   "id": "120000",
        //   "label": "天津",
        //   "parentId": null
        // }
      ],
      knowledgeList: [
        {
          label: '研究生',
          value: '1',
        },
        {
          label: '大学本科',
          value: '2',
        },
        {
          label: '大学专科和专科学校',
          value: '3',
        },
        {
          label: '中等专科学校',
          value: '4',
        },
        {
          label: '技工学校',
          value: '5',
        },
        {
          label: '高中',
          value: '6',
        },
        {
          label: '初中',
          value: '7',
        },
        {
          label: '小学',
          value: '8',
        },
        {
          label: '文盲或半文盲',
          value: '9',
        },
        {
          label: '不详',
          value: '10',
        },
      ],
      positionList: [
        {
          label: '国家机关、党群组织、企业、事业单位负责人',
          value: '1',
        },
        {
          label: '专业技术人员',
          value: '2',
        },
        {
          label: '办事人员和有关人员',
          value: '3',
        },
        {
          label: '商业、服务业人员',
          value: '4',
        },
        {
          label: '农、林、牧、副、渔、水利业生产人员',
          value: '5',
        },
        {
          label: '生产、运输设备操作人员及有关人员',
          value: '6',
        },
        {
          label: '军人',
          value: '7',
        },
        {
          label: '不便分类的其他从业人员',
          value: '8',
        },
        {
          label: '无职业',
          value: '9',
        },
      ],
      marriageList: [
        {
          label: '未婚',
          value: '1',
        },
        {
          label: '已婚',
          value: '2',
        },
        {
          label: '丧偶',
          value: '3',
        },
        {
          label: '离婚',
          value: '4',
        },
        {
          label: '未说明的婚姻状况',
          value: '5',
        },
      ],
      paymentList: paymentList,
      allergyList: [
        {
          label: '无',
          value: '1',
        },
        {
          label: '青霉素',
          value: '2',
        },
        {
          label: '磺胺',
          value: '3',
        },
        {
          label: '链霉素',
          value: '4',
        },
        {
          label: '其他',
          value: '5',
        },
      ],
      exposeList: [
        {
          label: '无',
          value: '1',
        },
        {
          label: '化学品',
          value: '2',
        },
        {
          label: '毒物',
          value: '3',
        },
        {
          label: '射线',
          value: '4',
        },
      ],
      disCategory: [],

      pastHistoryList: [
        {
          field: 'disease',
          formTitle: '疾病',
          tableTitle: '疾病记录',
          tableData: [{}],
        },
      ],
      diseaseList: [
        {
          label: '无',
          value: '1',
        },
        {
          label: '高血压',
          value: '2',
        },
        {
          label: '糖尿病',
          value: '3',
        },
        {
          label: '冠心病',
          value: '4',
        },
        {
          label: '慢性阻塞性肺疾病',
          value: '5',
        },
        {
          label: '恶性肿瘤',
          value: '6',
        },
        {
          label: '脑卒中',
          value: '7',
        },
        {
          label: '严重精神障碍',
          value: '8',
        },
        {
          label: '结核病',
          value: '9',
        },
        {
          label: '肝炎',
          value: '10',
        },
        {
          label: '先天畸形',
          value: '11',
        },
        {
          label: '其他',
          value: '12',
        },
      ],
      disabilityList: [
        {
          label: '无残疾',
          value: '1',
        },
        {
          label: '视力残疾',
          value: '2',
        },
        {
          label: '听力残疾',
          value: '3',
        },
        {
          label: '言语残疾',
          value: '4',
        },
        {
          label: '肢体残疾',
          value: '5',
        },
        {
          label: '智力残疾',
          value: '6',
        },
        {
          label: '精神残疾',
          value: '7',
        },
        {
          label: '其他残疾',
          value: '8',
        },
      ],
      patId: '',
      basicRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        idNo: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
        patType: [{ required: true, message: '请选择常驻类型', trigger: 'blur' }],
        phoneNo: [{ required: true, message: '请输入本人电话', trigger: 'blur' }],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
        workUnits: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
        address: [{ required: true, message: '请选择居住地址', trigger: 'blur' }],
        street: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        blood: [{ required: true, message: '请选择血型', trigger: 'blur' }],
        RH: [{ required: true, message: '请选择RH', trigger: 'blur' }],
        eduLevel: [{ required: true, message: '请选择文化程度', trigger: 'blur' }],
        careerCode: [{ required: true, message: '请选择职业', trigger: 'blur' }],
        maritalStatus: [{ required: true, message: '请选择婚姻状况', trigger: 'blur' }],
        patType: [
          {
            required: true,
            message: '请选择医疗费用支付方式',
            trigger: 'blur',
          },
        ],
        drugAllergy: [{ required: true, message: '请选择药物过敏史', trigger: 'blur' }],
        exposureHistory: [{ required: true, message: '请选择暴露史', trigger: 'blur' }],
      },
      historyModel: {
        diseaseModel: '',
        operationModel: '',
        traumaModel: '',
        bloodModel: '',
      },
      historyRules: {
        diseaseModel: [{ required: true, message: '请选择疾病', trigger: 'blur' }],
        operationModel: [{ required: true, message: '请手术', trigger: 'change' }],
        traumaModel: [{ required: true, message: '请选择外伤', trigger: 'blur' }],
        bloodModel: [{ required: true, message: '请选择输血', trigger: 'blur' }],
      },
      familyDiseaseRules: {
        fatherDiseaseCode: [{ required: true, message: '请选择父亲疾病', trigger: 'change' }],
        fatherOtherDisease: [{ required: true, message: '请输入父亲其他疾病', trigger: 'change' }],
        motherDiseaseCode: [{ required: true, message: '请选择母亲疾病', trigger: 'change' }],
        motherOtherDisease: [{ required: true, message: '请输入母亲其他疾病', trigger: 'change' }],
        siblingDiseaseCode: [{ required: true, message: '请选择兄弟姐妹疾病', trigger: 'change' }],
        siblingOtherDisease: [
          {
            required: true,
            message: '请输入兄弟姐妹其他疾病',
            trigger: 'change',
          },
        ],
        childrenDiseaseCode: [{ required: true, message: '请选择子女疾病', trigger: 'change' }],
        childrenOtherDisease: [{ required: true, message: '请输入子女其他疾病', trigger: 'change' }],
        geneticHistory: [{ required: true, message: '请选择遗传病史', trigger: 'change' }],
        disabilityCode: [{ required: true, message: '请选择残疾情况', trigger: 'change' }],
      },
      currentTime: '',
      basicInfoStretchFlag: true,
      knowledgeLevelStretchFlag: true,
      historyStretchFlag: true,
      familyStretchFlag: true,
      logList: [],
      recordDialogVis: false,
      recordDialogType: '',
      oldTableList: [],
      originPageInfoStr: '',
      icdLoading: false,
      idcCategory: [],
      idcOperation: [],
    }
  },

  created() {
    this.orgId = window.sessionStorage.getItem('orgId')
  },
  async mounted() {
    await this.$refs.hosRef.init()
    this.patId = this.$route.query.patId
    this.isDisabled = !!this.$route.query.isDisabled
    this.getNationList()
    this.getLogList()
    this.getDoctorList()
    this.getDiseaseMain()
    this.getPatientRecord()
  },
  methods: {
    async getNationList() {
      try {
        const res = await getDictionary({
          id: 'adad23sdrf3sa3ew232eddsfae',
        })
        console.log('getDictionary=====', res)
        this.nationList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async getDiseaseMain() {
      try {
        const res = await getDiseaseMain()
        console.log('getDiseaseMain=====', res)
        this.disCategory = res.result.map((item) => ({
          label: item.diseaseName,
          value: item.diseaseName,
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async getDoctorList() {
      try {
        const res = await getDoctorUserData()
        console.log('getDoctorList===', res)
        this.applyDrs = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async getPatientRecord() {
      const { result: patientInfo } = await getPatientRecordById({
        patId: this.patId,
      })

      for (const key in patientInfo) {
        if (patientInfo[key]) {
          this.$set(this.pageInfo, key, patientInfo[key])
          // this.pageInfo[key] = patientInfo[key]
        }
      }
      console.log('patientInfo----', this.pageInfo)
      // if (key === 'birthday') {
      //   console.log(`birthday`, patientInfo[key])
      // }
      const { familyDisease, patient } = this.pageInfo
      console.log(`patient.birthday`, patient.birthday)
      if (isNaN(parseFloat(patient.birthday))) {
        this.idNoChange()
      }
      if (patient.bloodType.indexOf('/') > -1) {
        this.$set(this.pageInfo.patient, 'blood', patient.bloodType.split('/')[0])
        this.$set(this.pageInfo.patient, 'RH', patient.bloodType.split('/')[1])
      } else {
        this.$set(this.pageInfo.patient, 'blood', '')
        this.$set(this.pageInfo.patient, 'RH', '')
      }
      this.originPageInfoStr = JSON.stringify(this.pageInfo)

      patient.address = patient.address ? patient.address.split(',') : []
      patient.drugAllergy = patient.drugAllergy ? patient.drugAllergy.split(',') : []
      patient.exposureHistory = patient.exposureHistory ? patient.exposureHistory.split(',') : []
      console.log('familyDisease===', familyDisease)
      familyDisease.childrenDiseaseCode = familyDisease.childrenDiseaseCode
        ? familyDisease.childrenDiseaseCode.split(',')
        : []
      familyDisease.fatherDiseaseCode = familyDisease.fatherDiseaseCode
        ? familyDisease.fatherDiseaseCode.split(',')
        : []
      familyDisease.motherDiseaseCode = familyDisease.motherDiseaseCode
        ? familyDisease.motherDiseaseCode.split(',')
        : []
      familyDisease.siblingDiseaseCode = familyDisease.siblingDiseaseCode
        ? familyDisease.siblingDiseaseCode.split(',')
        : []
      familyDisease.disabilityCode = familyDisease.disabilityCode ? familyDisease.disabilityCode.split(',') : []

      this.historyModel.diseaseModel = this.pageInfo.disease.length ? 'Y' : 'N'
      this.historyModel.operationModel = this.pageInfo.operation.length ? 'Y' : 'N'
      this.historyModel.traumaModel = this.pageInfo.trauma.length ? 'Y' : 'N'
      this.historyModel.bloodModel = this.pageInfo.blood.length ? 'Y' : 'N'

      for (const key in patient) {
        if (!patient[key] || !patient[key].length) {
          this.$set(this.basicRules, key, null)
        }
      }

      console.log('familyDisease====', familyDisease)
      for (const key in familyDisease) {
        if (
          (!familyDisease[key] || !familyDisease[key].length) &&
          key !== 'childrenOtherDisease' &&
          key !== 'siblingOtherDisease' &&
          key !== 'motherOtherDisease' &&
          key !== 'fatherOtherDisease'
        ) {
          this.$set(this.familyDiseaseRules, key, null)
        }
      }
      console.log('familyDiseaseRules==', this.familyDiseaseRules)
      this.pageInfo.disease.push({})
      this.pageInfo.operation.push({})
      this.pageInfo.trauma.push({})
      this.pageInfo.blood.push({})
    },
    async getLogList() {
      if (this.patId === '') {
        return
      }
      try {
        const res = await getLogList({
          pageNum: 1,
          pageSize: 10,
          tenantId: this.patId,
        })
        console.log('getLogList======', res)
        this.logList = res.result.records
      } catch (err) {
        console.log(err)
      }
    },
    async getIcdDicForOrderBy(value, directoryType) {
      console.log(`value`, value)
      try {
        let res = await getIcdDicForOrderBy({
          value,
          directoryType,
        })
        console.log(`res`, res)
        if (res.code === 0) {
          console.log('查询疾病列表：', res)
          if (directoryType === 'ICD10-A') {
            this.icdLoading = false
            this.idcCategory = res.result
          } else {
            // 手术
            this.icdLoading = false
            this.idcOperation = res.result
          }
        }
      } catch (error) {
        console.log(`error`, error)
        this.icdLoading = false
      }
    },
    icdIdChange(index) {
      console.log(`index`, index)
      let temp = this.idcCategory.filter((el) => el.value === this.pageInfo.disease[index].icdCode)
      // temp 不为空
      if (temp.length > 0) {
        this.pageInfo.disease[index].medName = temp[0].label
        this.pageInfo.disease[index].icdCode = temp[0].value
        this.pageInfo.disease[index].icdId = temp[0].id
      }
    },
    medNameChange(index) {
      let temp = this.idcCategory.filter((el) => el.label === this.pageInfo.disease[index].medName)
      if (temp.length > 0) {
        this.pageInfo.disease[index].icdId = temp[0].id
        this.pageInfo.disease[index].icdCode = temp[0].value
      } else {
        this.pageInfo.disease[index].icdId = ''
      }
      console.log(`this.pageInfo.disease`, this.pageInfo.disease)
    },
    icdIdChange2(index) {
      console.log(`index`, index)
      console.log(`this.pageInfo.operation[index]`, this.pageInfo.operation[index])
      console.log(`this.idcOperation`, this.idcOperation)
      let temp = this.idcOperation.filter((el) => el.value === this.pageInfo.operation[index].icdCode)
      console.log(`temp`, temp)
      if (temp.length > 0) {
        this.pageInfo.operation[index].medName = temp[0].label
        this.pageInfo.operation[index].icdCode = temp[0].value
        this.pageInfo.operation[index].icdId = temp[0].id
      }
    },
    medNameChange2(index) {
      let temp = this.idcOperation.filter((el) => el.label === this.pageInfo.operation[index].medName)
      if (temp.length > 0) {
        this.pageInfo.operation[index].icdId = temp[0].id
        this.pageInfo.operation[index].icdCode = temp[0].value
      } else {
        this.pageInfo.operation[index].icdId = ''
      }
      console.log(`this.pageInfo.operation`, this.pageInfo.operation)
    },
    remoteMethod(query) {
      console.log(`query`, query)
      if (query !== '') {
        setTimeout(() => {
          this.icdLoading = true
          this.getIcdDicForOrderBy(query, 'ICD10-A')
        }, 200)
      } else {
        this.idcCategory = []
      }
    },
    remoteMethod1(query) {
      console.log(`query`, query)
      if (query !== '') {
        setTimeout(() => {
          this.icdLoading = true
          this.getIcdDicForOrderBy(query, 'ICD9-B')
        }, 200)
      } else {
        this.idcCategory = []
      }
    },
    historyRadioChange(type, medType) {
      if (this.historyModel[`${type}Model`] === 'Y') {
        this.addTableRow(type, medType, 1)
      }
    },
    addTableRow(type, medType, rowCount) {
      rowCount = rowCount || 1
      for (let i = 0; i < rowCount; i++) {
        this.pageInfo[type].splice(-1, 0, {
          confirmTime: '',
          medName: '',
          medDesc: '',
          medType,
        })
      }
    },
    deleteTableRow($index, type) {
      this.pageInfo[type].splice($index, 1)
    },
    arraySpanMethod(rowIndex, type) {
      if (rowIndex === this.pageInfo[type].length - 1) {
        return [1, 5]
      }
    },
    handleCellStyle(rowIndex, type) {
      if (rowIndex === this.pageInfo[type].length - 1) {
        return {
          textAlign: 'center',
        }
      }
    },
    handleOtherDiseaseChange(type) {
      const diseaseTypeCode = `${type}DiseaseCode`
      const otherDiseaseType = `${type}OtherDisease`
      if (!this.pageInfo.familyDisease[diseaseTypeCode].includes('12')) {
        this.pageInfo.familyDisease[otherDiseaseType] = ''
      }
      if (this.pageInfo.familyDisease[diseaseTypeCode].includes('1')) {
      }
    },
    handleChangeStretch(flagType) {
      this[flagType] = !this[flagType]
    },
    async submitPageInfo() {
      const result = this.getSubmitData()

      let temp = this.applyDrs.filter((el) => el.doctorUserId === this.pageInfo.patient.doctorUserId)
      console.log(`temp`, temp)
      if (temp.length > 0) {
        result.patient.doctorUserName = temp[0].doctorUserName
      }

      this.$refs.basicInfo.validate((valid) => {
        if (valid) {
          this.$refs.cultureForm.validate((valid) => {
            if (valid) {
              this.$refs.historyForm.validate((valid) => {
                if (valid) {
                  this.$refs.familyForm.validate(async (valid) => {
                    if (valid) {
                      console.log(`result`, result)
                      const resp = await submitPatientRecord(result)
                      this.currentTime = Date.now() + ''
                      this.$message.success('保存成功')
                      this.getPatientRecord()
                      sessionStorage.setItem('hasChanged', false)
                      this.getLogList()
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    getSubmitData() {
      const { patient, familyDisease, disease, operation, trauma, blood } = this.pageInfo
      console.log(`12421412412`, 12421412412)
      console.log(
        `---------`,
        this.applyDrs.find((item) => item.doctorUserId === patient.doctorUserId)
          ? this.applyDrs.find((item) => item.doctorUserId === patient.doctorUserId).doctorUserName
          : '',
      )
      console.log(`this.pageInfo.patient.address`, this.pageInfo.patient.address)
      // 获取地址中文拼接
      console.log('this.$refs.cascader.getCheckedNodes()', this.$refs.cascader.getCheckedNodes())
      const submitPatient = {
        ...patient,
        address: patient.address.join(','),
        addressText: this.$refs.cascader ? this.$refs.cascader.getCheckedNodes() : '',
        bloodType: !patient.blood && !patient.RH ? '' : `${patient.blood}/${patient.RH}`,
        doctorUserName: this.applyDrs.find((item) => item.doctorUserId === patient.doctorUserId)
          ? this.applyDrs.find((item) => item.doctorUserId === patient.doctorUserId).doctorUserName
          : '',
        drugAllergy: patient.drugAllergy.join(','),
        exposureHistory: patient.exposureHistory.join(','),
      }
      const submitFamilyDisease = {
        ...familyDisease,
        fatherDiseaseCode: familyDisease.fatherDiseaseCode.join(','),
        motherDiseaseCode: familyDisease.motherDiseaseCode.join(','),
        siblingDiseaseCode: familyDisease.siblingDiseaseCode.join(','),
        childrenDiseaseCode: familyDisease.childrenDiseaseCode.join(','),
        disabilityCode: familyDisease.disabilityCode.join(','),
      }
      return {
        ...this.pageInfo,
        patient: submitPatient,
        familyDisease: submitFamilyDisease,
        disease: disease.slice(0, disease.length - 1),
        operation: operation.slice(0, operation.length - 1),
        trauma: trauma.slice(0, trauma.length - 1),
        blood: blood.slice(0, blood.length - 1),
      }
    },
    goBack() {
      this.examineFiledIsChanged().then(() => {
        sessionStorage.setItem('hasChanged', 'false')
        this.$setMenuPage('/patientCenter')
        this.$router.go(-1)
      })
    },
    idNoChange() {
      let temp = JSON.parse(JSON.stringify(this.pageInfo.patient.idNo))
      console.log(`pageInfo.patient.idNo`, temp)
      const getBirthdayFromIdCard = (idCard) => {
        var birthday = ''
        if (idCard != null && idCard != '') {
          if (idCard.length == 15) {
            birthday = '19' + idCard.substr(6, 6)
          } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8)
          }
          birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        }
        return birthday
      }
      if (temp.length === 15 || temp.length === 18) {
        this.pageInfo.patient.birthday = getBirthdayFromIdCard(temp)
        console.log(`getBirthdayFromIdCard(temp)`, getBirthdayFromIdCard(temp))
      }
    },
    showRecordDialog(item) {
      this.recordDialogType = item.type
      this.oldTableList = item.oldValue.map((item) => ({
        ...item,
        confirmTime: item.confirmTime ? dayjs(new Date(item.confirmTime)).format('YYYY-MM-DD') : '',
      }))
      this.recordDialogVis = true
    },
    examineFiledIsChanged() {
      const result = this.getSubmitData()
      console.log(`result`, JSON.parse(JSON.stringify(result)))
      const originData = JSON.parse(this.originPageInfoStr)

      let flag = false
      for (const key in result) {
        if (JSON.stringify(result[key]) !== JSON.stringify(originData[key])) {
          console.log('key', key)
          console.log('result[key]', result[key])
          console.log('originData[key]', originData[key])
          flag = true
          break
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          this.$confirm('您有未保存的记录，确认要离开吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              resolve(true)
            })
            .catch(() => {
              reject(false)
            })
        } else {
          resolve(true)
        }
      })
    },
    // 清空 icdCode
    codeClearMethod(index) {
      this.clearObjectValues(this.pageInfo.disease[index])
    },
    // medNameClearMethod
    medNameClearMethod(index) {
      this.clearObjectValues(this.pageInfo.disease[index])
    },
    codeClearMethod2(index) {
      this.clearObjectValues(this.pageInfo.operation[index])
    },
    // medNameClearMethod
    medNameClearMethod2(index) {
      this.clearObjectValues(this.pageInfo.operation[index])
    },
    clearObjectValues(obj) {
      for (let key in obj) {
        // icdId && medName && icdCode
        if (key === 'icdId' || key === 'medName') {
          obj[key] = ''
        }
      }
    },
  },
  watch: {
    pageInfo: {
      deep: true,
      handler(n) {
        console.log(`pageInfo.patient.address`, this.pageInfo.patient.address)
        this.$nextTick(() => {
          setTimeout(() => {
            const result = this.getSubmitData()
            const originData = JSON.parse(this.originPageInfoStr)
            let flag = false
            for (const key in result) {
              if (JSON.stringify(result[key]) !== JSON.stringify(originData[key])) {
                flag = true
                break
              }
            }
            console.log('result', result)
            console.log('originData', result)
            sessionStorage.setItem('hasChanged', flag)
          }, 100)
        })
      },
    },
  },
  components: {
    // PatientInfoCard,
    RecordDialog,
    AddressCascader,
  },
}
</script>

<style lang="scss" scoped>
.basic-archives {
  background-color: #f5f5f5;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding: 0 20px 10px 10px;
  margin-bottom: 25px;
  .title {
    text-align: center;
    font-size: 16px;
    color: rgba(16, 16, 16, 100);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .bg-box {
    background-color: #fff;
    padding: 0 10px;
    margin-bottom: 11px;
    overflow: hidden;
    .title {
      background-color: #f5f5f5;
      line-height: 40px;
      height: 40px;
      margin-top: 10px;
      text-align: left;
      padding: 0 11px;
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
  .archive-info {
    position: relative;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .update-time {
    position: absolute;
    right: 5px;
    top: 8px;
  }
  .history {
    .table-title {
      color: #000;
    }
  }
  .other-input {
    width: 120px;
    margin-left: 15px;
  }
  .actions-fixed {
    position: fixed;
    left: 208px;
    bottom: 0;
    right: 0;
    background-color: #fff;
    overflow: hidden;
    border: 1px solid rgb(245, 245, 245);
    z-index: 100;
    padding: 8px 10px;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
  .retract {
    height: 0;
    overflow: hidden;
    transition: all 0.5s;
    &.stretch {
      height: auto;
    }
  }

  .arrow {
    transform: scale(0.6);
    transition: all 0.5s;
    &.stretch {
      transform: rotate(-90deg) scale(0.6);
    }
  }
}
</style>

<style scoped>
.el-select {
  width: 100%;
}
.el-date-editor {
  width: 100%;
}
.el-cascader {
  width: 100%;
}
.mut-radio ::v-deep .el-radio__label {
  padding-left: 6px;
}
.mut-radio ::v-deep .el-radio {
  margin-right: 10px;
}
.knowledge-level ::v-deep .el-radio {
  margin-right: 10px;
  margin-bottom: 10px;
}
.knowledge-level ::v-deep .el-form-item__label {
  line-height: 25px;
}
::v-deep .el-form-item__content {
  position: relative;
}
::v-deep .el-scrollbar__bar.is-vertical > div {
  background-color: #aaa !important;
}
::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #606266;
  border-color: #606266;
}
::v-deep .el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #606266;
  border-color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
  color: #606266;
}
::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}
</style>

<style lang="scss">
.el-message-box {
  .el-button--primary {
    color: #fff !important;
  }
}
</style>
