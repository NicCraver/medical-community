<template>
  <el-scrollbar style="height: 100%;">
    <div class="basic-archives">
        <div class="title" style="justify-content: center;">个人基本信息表</div>
        <div class="archive-info bg-box">
          <el-form inline disabled>
            <el-form-item label="建档日期">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                v-model="pageInfo.patient.archiveDate"
              />
            </el-form-item>
            <el-form-item label="责任医生">
              <el-select v-model="pageInfo.patient.doctorUserId">
                <el-option
                  v-for="item in applyDrs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="update-time">上次更新时间：{{ pageInfo.patient.modDate }}</div>
        </div>
        <PatientInfoCard :patientInfo="patientInfo"  @open360View="open360View"  />
        <div class="patient-basic-info  bg-box">
          <div class="title">
            基本信息
            <IconSvg
              iconClass="arrow"
              :class="['arrow', {'stretch': !basicInfoStretchFlag }]"
              @click.native="handleChangeStretch('basicInfoStretchFlag')"
            />
          </div>
          <el-form
            label-width="95px"
            label-position="left"
            :rules="basicRules"
            :model="pageInfo.patient"
            :class="['retract', { 'stretch': basicInfoStretchFlag }]"
            disabled
          >
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="姓名：" prop="name">
                  <el-input v-model="pageInfo.patient.name" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="民族：" prop="nation">
                  <el-select v-model="pageInfo.patient.nation">
                    <el-option label="请选择" value="" />
                    <el-option
                      v-for="item in nationList"
                      :label="item.label"
                      :value="item.value"
                      :key="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别：" prop="sex">
                  <el-radio-group v-model="pageInfo.patient.sex">
                    <el-radio
                      :label="value"
                      :key="value"
                      v-for="(value, key) in sexMap"
                    >{{ key }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号：" prop="idNo">
                  <el-input v-model="pageInfo.patient.idNo" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出生日期：" prop="birthday">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    v-model="pageInfo.patient.birthday"
                  />
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
                  <el-cascader
                    v-model="pageInfo.patient.address"
                    :options="areaList"
                    :props="{ value: 'id' }"
                    ref="cascader"
                  />
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
              :class="['arrow', {'stretch': !knowledgeLevelStretchFlag }]"
              @click.native="handleChangeStretch('knowledgeLevelStretchFlag')"
            />
          </div>
          <el-form
            label-width="95px"
            label-position="left"
            :rules="basicRules"
            :model="pageInfo.patient"
            :class="['retract', { 'stretch': knowledgeLevelStretchFlag }]"
            disabled
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="文化程度：" prop="eduLevel">
                  <el-radio-group v-model="pageInfo.patient.eduLevel">
                    <el-radio
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in knowledgeList">{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="职业：" prop="careerCode">
                  <el-radio-group v-model="pageInfo.patient.careerCode">
                    <el-radio
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in positionList">{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="婚姻状况：" prop="maritalStatus">
                  <el-radio-group v-model="pageInfo.patient.maritalStatus">
                    <el-radio
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in marriageList">{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="医疗费用支付方式：" label-width="155px" prop="patType">
                  <el-radio-group v-model="pageInfo.patient.patType">
                    <el-radio
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in paymentList">{{ item.label }}</el-radio>
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
              :class="['arrow', {'stretch': !historyStretchFlag }]"
              @click.native="handleChangeStretch('historyStretchFlag')"
            />
          </div>
          <el-form
            label-width="95px"
            label-position="left"
            :rules="basicRules"
            :model="pageInfo.patient"
            disabled
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="药物过敏史：" label-width="110px" prop="drugAllergy">
                  <el-checkbox-group v-model="pageInfo.patient.drugAllergy">
                    <el-checkbox
                    :label="item.value"
                    :value="item.value"
                    :key="item.value"
                    v-for="item in allergyList">{{ item.label }}</el-checkbox>
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
                    v-for="item in exposeList">{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div :class="['retract', { 'stretch': historyStretchFlag }]">
            <el-form label-width="60px" label-position="left" :model="historyModel" :rules="historyRules" disabled>
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
                <el-table-column label="疾病名称">
                  <template slot-scope="{ row, $index }">
                    <el-button
                      v-if="$index === pageInfo.disease.length - 1"
                      type="text"
                      @click="addTableRow('disease', '1')"
                      disabled
                    >添加一行</el-button>
                    <el-select v-model="row.medName" v-else disabled>
                      <el-option
                        :label="item.label"
                        :value="item.label"
                        :key="item.label"
                        v-for="item in disCategory"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="疾病描述">
                  <template slot-scope="{ row }">
                    <el-input v-model="row.medDesc" disabled />
                  </template>
                </el-table-column>
                <el-table-column label="确诊时间">
                  <template slot-scope="{ row }">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      type="date"
                      v-model="row.confirmTime"
                      disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ $index }">
                    <IconSvg iconClass="delete-disabled" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form label-width="60px" label-position="left" :model="historyModel" :rules="historyRules" disabled>
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
                <el-table-column label="手术名称">
                  <template slot-scope="{ row, $index }">
                    <el-button
                      v-if="$index === pageInfo.operation.length - 1"
                      type="text"
                      @click="addTableRow('operation', '2')"
                      disabled
                    >添加一行</el-button>
                    <el-input v-model="row.medName" v-else disabled />
                  </template>
                </el-table-column>
                <el-table-column label="确诊时间">
                  <template slot-scope="{ row }">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      type="date"
                      v-model="row.confirmTime"
                      disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ $index }">
                    <IconSvg iconClass="delete-disabled" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form label-width="60px" label-position="left" :model="historyModel" :rules="historyRules" disabled>
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
                :span-method="({ rowIndex }) =>  arraySpanMethod(rowIndex, 'trauma')"
                border
                :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'trauma')"
              >
                <el-table-column label="外伤名称">
                  <template slot-scope="{ row, $index }">
                    <el-button
                      v-if="$index === pageInfo.trauma.length - 1"
                      type="text"
                      @click="addTableRow('trauma', '3')"
                      disabled
                    >添加一行</el-button>
                    <el-input v-model="row.medName" v-else disabled />
                  </template>
                </el-table-column>
                <el-table-column label="受伤时间">
                  <template slot-scope="{ row }">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      type="date"
                      v-model="row.confirmTime"
                      disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ $index }">
                    <IconSvg iconClass="delete-disabled" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form label-width="60px" label-position="left" :model="historyModel" :rules="historyRules" disabled>
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
                      disabled
                    >添加一行</el-button>
                    <el-input v-model="row.medName" v-else disabled />
                  </template>
                </el-table-column>
                <el-table-column label="输血时间">
                  <template slot-scope="{ row }">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      type="date"
                      v-model="row.confirmTime"
                      disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ $index }">
                    <IconSvg iconClass="delete-disabled" />
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
              :class="['arrow', {'stretch': !familyStretchFlag }]"
              @click.native="handleChangeStretch('familyStretchFlag')"
            />
          </div>
          <el-form
            label-width="95px"
            label-position="left"
            :model="pageInfo.familyDisease"
            :rules="familyDiseaseRules"
            :class="['retract', { 'stretch': familyStretchFlag }]"
            disabled
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
                        (
                          (item.value === '1' && pageInfo.familyDisease.fatherDiseaseCode.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.familyDisease.fatherDiseaseCode.indexOf('1') > -1)
                        )"
                    >{{ item.label }}</el-checkbox>
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-show="pageInfo.familyDisease.fatherDiseaseCode.indexOf('12') > -1"
                      v-model="pageInfo.familyDisease.fatherOtherDisease"
                    />
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
                        (
                          (item.value === '1' && pageInfo.familyDisease.motherDiseaseCode.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.familyDisease.motherDiseaseCode.indexOf('1') > -1)
                        )"
                    >{{ item.label }}</el-checkbox>
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-show="pageInfo.familyDisease.motherDiseaseCode.indexOf('12') > -1"
                      v-model="pageInfo.familyDisease.motherOtherDisease"
                    />
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
                        (
                          (item.value === '1' && pageInfo.familyDisease.siblingDiseaseCode.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.familyDisease.siblingDiseaseCode.indexOf('1') > -1)
                        )"
                    >{{ item.label }}</el-checkbox>
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-show="pageInfo.familyDisease.siblingDiseaseCode.indexOf('12') > -1"
                      v-model="pageInfo.familyDisease.siblingOtherDisease"
                    />
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
                        (
                          (item.value === '1' && pageInfo.familyDisease.childrenDiseaseCode.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.familyDisease.childrenDiseaseCode.indexOf('1') > -1)
                        )"
                    >{{ item.label }}</el-checkbox>
                    <el-input
                      placeholder="其他"
                      class="other-input"
                      v-show="pageInfo.familyDisease.childrenDiseaseCode.indexOf('12') > -1"
                      v-model="pageInfo.familyDisease.childrenOtherDisease"
                    />
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
                        (
                          (item.value === '1' && pageInfo.familyDisease.disabilityCode.indexOf('1') === -1) ||
                          (item.value !== '1' && pageInfo.familyDisease.disabilityCode.indexOf('1') > -1)
                        )"
                    >{{ item.label }}</el-checkbox>
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
                  修改【{{ item.title }}】由<span
                    style="font-style: italic; color: #000"
                    >{{ item.oldValue }}</span
                  >变更为<span style="font-style: italic; color: #000">{{
                    item.newValue
                  }}</span>
                </span>
                <span v-else
                  >完善【{{ item.title }}】为<span
                    style="font-style: italic; color: #000"
                    >{{ item.newValue }}</span
                  ></span
                >
              </p>
              <p v-for="item in row.listData">
                修改【{{ item.type }}】<span
                  v-if="item.oldValue.length"
                  style="
                    cursor: pointer;
                    color: rgba(94, 132, 215, 100);
                    text-decoration: underline;
                  "
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
import { getPatientRecordById, submitPatientRecord, getPatientInfo, getDoctorList, getLogList } from '@/api/modules/PatientCenter';
import { sexMap, paymentList } from '@/utils/data-map';
import { PatientInfoCard } from 'anx-vue';
import RecordDialog from './RecordDialog';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      patientInfo: {},
      pageInfo: {
        patient: {
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
          siblingOtherDisease: ''
        },
        log: [],
      },
      sexMap: {
        '男': '1',
        '女': '2',
        '未说明':'9',
        '未知': '0'
      },
      applyDrs: [],
      nationList: [
        { label: '汉族', value: '1' },
        { label: '回族', value: '2' },
        { label: '满族', value: '3' },
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
                  parentId: '2'
                },
                {
                  children: null,
                  id: '4',
                  label: '富拉尔基区',
                  parentId: '2'
                },
                {
                  children: null,
                  id: '5',
                  label: '讷河市',
                  parentId: '2'
                }
              ],
              id: '2',
              label: '齐齐哈尔',
              parentId: '1'
            }
          ],
          id: '1',
          label: '黑龙江',
          parentId: null
        }
      ],
      knowledgeList: [
        {
          label: '研究生',
          value: '1'
        },
        {
          label: '大学本科',
          value: '2'
        },
        {
          label: '大学专科和专科学校',
          value: '3'
        },
        {
          label: '中等专科学校',
          value: '4'
        },
        {
          label: '技工学校',
          value: '5'
        },
        {
          label: '高中',
          value: '6'
        },
        {
          label: '初中',
          value: '7'
        },
        {
          label: '小学',
          value: '8'
        },
        {
          label: '文盲或半文盲',
          value: '9'
        },
        {
          label: '不详',
          value: '10'
        },
      ],
      positionList: [
        {
          label: '国家机关、党群组织、企业、事业单位负责人',
          value: '1'
        },
        {
          label: '专业技术人员',
          value: '2'
        },
        {
          label: '办事人员和有关人员',
          value: '3'
        },
        {
          label: '商业、服务业人员',
          value: '4'
        },
        {
          label: '农、林、牧、副、渔、水利业生产人员',
          value: '5'
        },
        {
          label: '生产、运输设备操作人员及有关人员',
          value: '6'
        },
        {
          label: '军人',
          value: '7'
        },
        {
          label: '不便分类的其他从业人员',
          value: '8'
        },
        {
          label: '无职业',
          value: '9'
        },
      ],
      marriageList: [
        {
          label: '未婚',
          value: '1'
        },
        {
          label: '已婚',
          value: '2'
        },
        {
          label: '丧偶',
          value: '3'
        },
        {
          label: '离婚',
          value: '4'
        },
        {
          label: '未说明的婚姻状况',
          value: '5'
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
        },{
          label: '磺胺',
          value: '3',
        },{
          label: '链霉素',
          value: '4',
        },{
          label: '其他',
          value: '5',
        },
      ],
      exposeList: [
        {
          label: '无',
          value: '1'
        },
        {
          label: '化学品',
          value: '2'
        },
        {
          label: '毒物',
          value: '3'
        },
        {
          label: '射线',
          value: '4'
        },
      ],
      disCategory: [
        { label: "高血压", value: '高血压' },
        { label: "糖尿病", value: '糖尿病' },
        { label: "冠心病", value: '冠心病' },
        { label: "慢性阻塞性肺疾病", value: '慢性阻塞性肺疾病' },
        { label: "恶性肿瘤", value: '恶性肿瘤' },
        { label: "脑卒中", value: '脑卒中' },
        { label: "严重精神障碍", value: '严重精神障碍' },
        { label: "结核病", value: '结核病' },
        { label: "肝炎", value: '肝炎' },
        { label: "其他法定传染病", value: '其他法定传染病' },
        { label: "职业病", value: '职业病' },
      ],

      pastHistoryList: [
        {
          field: 'disease',
          formTitle: '疾病',
          tableTitle: '疾病记录',
          tableData: [{}]
        },
      ],
      diseaseList: [
        {
          label: '无',
          value: '1'
        },
        {
          label: '高血压',
          value: '2'
        },
        {
          label: '糖尿病',
          value: '3'
        },
        {
          label: '冠心病',
          value: '4'
        },
        {
          label: '慢性阻塞性肺疾病',
          value: '5'
        },
        {
          label: '恶性肿瘤',
          value: '6'
        },
        {
          label: '脑卒中',
          value: '7'
        },
        {
          label: '严重精神障碍',
          value: '8'
        },
        {
          label: '结核病',
          value: '9'
        },
        {
          label: '肝炎',
          value: '10'
        },
        {
          label: '先天畸形',
          value: '11'
        },
        {
          label: '其他',
          value: '12'
        },
      ],
      disabilityList: [
        {
          label: '无残疾',
          value: '1'
        },
        {
          label: '视力残疾',
          value: '2'
        },
        {
          label: '听力残疾',
          value: '3'
        },
        {
          label: '言语残疾',
          value: '4'
        },
        {
          label: '肢体残疾',
          value: '5'
        },
        {
          label: '智力残疾',
          value: '6'
        },
        {
          label: '精神残疾',
          value: '7'
        },
        {
          label: '其他残疾',
          value: '8'
        },
      ],
      patId: '',
      basicRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        nation: [{ required: true, message: '请选择民族', trigger: 'change'}],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur'}],
        idNo: [{ required: true, message: '请输入身份证号', trigger: 'blur'}],
        birthday: [{ required: true, message: '请选择出生日期', trigger: 'blur'}],
        patType: [{ required: true, message: '请选择常驻类型', trigger: 'blur'}],
        phoneNo: [{ required: true, message: '请输入本人电话', trigger: 'blur'}],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur'}],
        contactPhone: [{ required: true, message: '请输入联系人电话', trigger: 'blur'}],
        workUnits: [{ required: true, message: '请输入工作单位', trigger: 'blur'}],
        address: [{ required: true, message: '请选择居住地址', trigger: 'blur'}],
        street: [{ required: true, message: '请输入详细地址', trigger: 'blur'}],
        blood: [{ required: true, message: '请选择血型', trigger: 'blur'}],
        RH: [{ required: true, message: '请选择RH', trigger: 'blur'}],
        eduLevel: [{ required: true, message: '请选择文化程度', trigger: 'blur'}],
        careerCode: [{ required: true, message: '请选择职业', trigger: 'blur'}],
        maritalStatus: [{ required: true, message: '请选择婚姻状况', trigger: 'blur'}],
        patType: [{ required: true, message: '请选择医疗费用支付方式', trigger: 'blur'}],
        drugAllergy: [{ required: true, message: '请选择药物过敏史', trigger: 'blur'}],
        exposureHistory: [{ required: true, message: '请选择暴露史', trigger: 'blur'}],
      },
      historyModel: {
        diseaseModel: '',
        operationModel: '',
        traumaModel: '',
        bloodModel: '',
      },
      historyRules: {
        diseaseModel: [{ required: true, message: '请选择疾病', trigger: 'blur'}],
        operationModel: [{ required: true, message: '请手术', trigger: 'change'}],
        traumaModel: [{ required: true, message: '请选择外伤', trigger: 'blur'}],
        bloodModel: [{ required: true, message: '请选择输血', trigger: 'blur'}],
      },
      familyDiseaseRules: {
        fatherDiseaseCode: [{ required: true, message: '请选择父亲疾病', trigger: 'change'}],
        motherDiseaseCode: [{ required: true, message: '请选择母亲疾病', trigger: 'change'}],
        siblingDiseaseCode: [{ required: true, message: '请选择兄弟姐妹疾病', trigger: 'change'}],
        childrenDiseaseCode: [{ required: true, message: '请选择子女疾病', trigger: 'change'}],
        geneticHistory: [{ required: true, message: '请选择遗传病史', trigger: 'change'}],
        disabilityCode: [{ required: true, message: '请选择残疾情况', trigger: 'change'}]
      },
      currentTime: '',
      basicInfoStretchFlag: true,
      knowledgeLevelStretchFlag: true,
      historyStretchFlag: true,
      familyStretchFlag: true,
      hisPatientId: '',
      logList: [],
      recordDialogVis: false,
      recordDialogType: "",
      oldTableList: [],
    }
  },
  async mounted() {
    this.patId = this.$route.query.patId;
    this.hisPatientId = this.$route.query.hisPatientId;
    this.getPatientInfo();
    this.getLogList()
    await this.getDoctorList();
    await this.getPatientRecord();
    this.pageInfo.disease.push({});
    this.pageInfo.operation.push({});
    this.pageInfo.trauma.push({});
    this.pageInfo.blood.push({});
  },
  methods: {
    open360View() {
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${this.hisPatientId}`);
    },
    async getDoctorList() {
      try {
        const res = await getDoctorList();
        console.log('getDoctorList===', res)
        this.applyDrs = res.result;
      } catch(err) {
        console.error(err);
      }
    },
    // 获取头部患者卡片信息
    async getPatientInfo() {
      try {
        const res = await getPatientInfo({ patId: this.patId });
        this.patientInfo = {
          ...res.result,
          sex: sexMap[res.result.sex],
          payment: paymentList.find((item) => item.value === res.result.payType)
            ? paymentList.find((item) => item.value === res.result.payType)
                .label
            : "",
          addressDetail: res.result.addressText + res.result.street,
        };
        console.log('this.patientInfo===', this.patientInfo)
      } catch(err) {
        console.log(err);
      }
    },
    async getPatientRecord() {
      const { result: patientInfo } = await getPatientRecordById({ patId: this.patId });
      console.log('patientInfo===', patientInfo)
      for(const key in patientInfo) {
        if (patientInfo[key]) {
          this.pageInfo[key] = patientInfo[key]
        }
      }

      console.log('this.pageInfo==', this.pageInfo.patient.moddate)

      const { familyDisease, patient } = this.pageInfo;

      patient.address = patient.address ? patient.address.split(',') : [];
      patient.blood = patient.bloodType.split('/')[0]
      patient.RH = patient.bloodType.split('/')[1]

      familyDisease.childrenDiseaseCode = familyDisease.childrenDiseaseCode
                                          ? familyDisease.childrenDiseaseCode.split(',')
                                          : [];
      familyDisease.fatherDiseaseCode = familyDisease.fatherDiseaseCode
                                          ? familyDisease.fatherDiseaseCode.split(',')
                                          : [];
      familyDisease.motherDiseaseCode = familyDisease.motherDiseaseCode
                                          ? familyDisease.motherDiseaseCode.split(',')
                                          : [];
      familyDisease.siblingDiseaseCode = familyDisease.siblingDiseaseCode
                                          ? familyDisease.siblingDiseaseCode.split(',')
                                          : [];
      familyDisease.disabilityCode = familyDisease.disabilityCode
                                          ? familyDisease.disabilityCode.split(',')
                                          : [];

      this.historyModel.diseaseModel = this.pageInfo.disease.length ? 'Y' : 'N';
      this.historyModel.operationModel = this.pageInfo.operation.length ? 'Y' : 'N';
      this.historyModel.traumaModel = this.pageInfo.trauma.length ? 'Y' : 'N';
      this.historyModel.bloodModel = this.pageInfo.blood.length ? 'Y' : 'N';

      for(const key in patient) {
        if (!patient[key] || !patient[key].length) {
          this.$set(this.basicRules, key, null)
        }
      }

      console.log('familyDisease====', familyDisease)
      for(const key in familyDisease) {
        if (!familyDisease[key] || !familyDisease[key].length) {
          this.$set(this.familyDiseaseRules, key, null)
        }
      }
    },
    historyRadioChange(type, medType) {
      if (this.historyModel[`${type}Model`] === 'Y') {
        this.addTableRow(type, medType, 2);
      }
    },
    addTableRow(type, medType, rowCount) {
      rowCount = rowCount || 1;
      for(let i = 0; i < rowCount; i++) {
        this.pageInfo[type].splice(-1, 0, {
          confirmTime: '',
          medName: '',
          medDesc: '',
          medType
        });
      }

    },
    deleteTableRow($index, type) {
      this.pageInfo[type].splice($index, 1);
    },
    arraySpanMethod(rowIndex, type) {
      if (rowIndex === this.pageInfo[type].length - 1) {
        return [1, 4]
      }
    },
    handleCellStyle(rowIndex, type){
      if (rowIndex === this.pageInfo[type].length - 1) {
        return {
          textAlign: 'center'
        }
      }
    },
    handleOtherDiseaseChange(type) {
      const diseaseTypeCode = `${type}DiseaseCode`;
      const otherDiseaseType = `${type}OtherDisease`;
      if (!this.pageInfo.familyDisease[diseaseTypeCode].includes('12')) {
        this.pageInfo.familyDisease[otherDiseaseType] = ''
      }
      if (this.pageInfo.familyDisease[diseaseTypeCode].includes('1')) {

      }
    },
    handleChangeStretch(flagType) {
      this[flagType] = !this[flagType]
    },
    async getLogList() {
      try {
        const res = await getLogList({
          pageNum: 1,
          pageSize: 10,
          tenantId: this.patId,
        });
        console.log("res======", res);
        this.logList = res.result.records;
      } catch (err) {
        console.log(err);
      }
    },
    showRecordDialog(item) {
      this.recordDialogType = item.type;
      this.oldTableList = item.oldValue.map((item) => ({
        ...item,
        confirmTime: item.confirmTime
          ? dayjs(new Date(item.confirmTime)).format("YYYY-MM-DD")
          : "",
      }));
      this.recordDialogVis = true;
    },
  },
  components: {
    PatientInfoCard,
    RecordDialog
  }
}
</script>

<style lang="scss" scoped>
.basic-archives {
  background-color: #f2f2f2;
  // padding-bottom: 20px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding: 0 20px 10px 10px;
  // margin-bottom: 25px;
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
