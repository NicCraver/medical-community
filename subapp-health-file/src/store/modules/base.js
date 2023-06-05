export default {
  namespaced: true,
  state: {
    // 系统模块配置
    infomationPlatforms: [],
    //个人健康档案基本信息
    personalArchInfo: {},
    //健康标签下拉
    healthRecordData: [{
      value: '高血压',
      label: '高血压'
    },
    {
      value: '糖尿病',
      label: '糖尿病'
    },
    {
      value: '骨质疏松',
      label: '骨质疏松'
    },
    {
      value: '冠心病',
      label: '冠心病'
    },
    {
      value: '新冠',
      label: '新冠'
    },
    {
      value: '艾滋病',
      label: '艾滋病'
    },
    {
      value: '高血脂',
      label: '高血脂'
    },
    {
      value: '精神病',
      label: '精神病'
    },
    {
      value: '帕金森病',
      label: '帕金森病'
    },
    {
      value: '白癜风',
      label: '白癜风'
    },
    {
      value: '牛皮癣',
      label: '牛皮癣'
    },
    {
      value: '青光眼',
      label: '青光眼'
    },
    {
      value: '癫痫',
      label: '癫痫'
    },
    ],
    //首页的跳转数据
    jumpToData: {
      // 一级菜单
      firstLevelName: "",
      // 健康事件二级菜单tabName
      healthEventName: "",
      // 健康事件跳转数据
      healthEventItem: {}
    },
    privacyConfig: {}, //隐私配置
  },
  getters: {
    personalArchInfo: state => state.personalArchInfo,
    healthRecord(state) {
      return (type) => state.healthRecordData.find(item => item.value == type)?.label
    },
    infomationPlatforms: state => state.infomationPlatforms,
    // 首页
    indexViewData(state) {
      let infomationPlatforms = state.infomationPlatforms || [];
      return infomationPlatforms.find(item => {
        return item.deptName === "首页"
      });
    },
    // 健康事件
    healthEventData(state) {
      let infomationPlatforms = state.infomationPlatforms || [];
      return infomationPlatforms.find(item => {
        return item.deptName === "健康事件"
      });
    },
    // 健康事件-门诊就诊活动
    medicalRecordData(state, getters) {
      let healthEventData = getters.healthEventData || {};
      let arr = healthEventData.childTreeDto || [];
      let obj = arr.find(item => {
        return item.deptName === "门诊就诊活动"
      });
      return obj || {}
    },
    // 健康事件-住院就诊活动
    inpDepartRecordData(state, getters) {
      let healthEventData = getters.healthEventData || {};
      if (healthEventData.status != "1") {
        return {};
      }
      let arr = healthEventData.childTreeDto || [];
      let obj = arr.find(item => {
        return item.deptName === "住院就诊活动"
      });
      return obj || {}
    },
    // 健康事件-卫生服务活动
    hygieneRecordData(state, getters) {
      let healthEventData = getters.healthEventData || {};
      if (healthEventData.status != "1") {
        return {};
      }
      let arr = healthEventData.childTreeDto || [];
      let obj = arr.find(item => {
        return item.deptName === "卫生服务活动"
      });
      return obj || {}
    },
    //首页的跳转数据 
    jumpToData: state => state.jumpToData,
    // 隐私配置
    privacyConfig: state => state.privacyConfig,
    // 居民姓名隐私
    personalNamePrivacy: state => name => {
      if (state.privacyConfig.namePrivacyEnable === "1" && name) {
        if (state.privacyConfig.namePrivacy === "1") return "*" + name.slice(1);
        else if (state.privacyConfig.namePrivacy === "2") return name.charAt(0) + "*" + name.slice(2);
        else if (state.privacyConfig.namePrivacy === "3") return name.charAt(0) + "**";
      }
      return name
    },
    // 居民身份证隐私
    personalIdPrivacy: state => id => {
      if (state.privacyConfig.idPrivacyEnable === "1" && id) {
        if (state.privacyConfig.idPrivacy === "1") return id.slice(0, 14) + "****"
        else if (state.privacyConfig.idPrivacy === "2") return id.slice(0, 7) + "********" + id.slice(15)
      }
      return id
    },
    // 居民联系电话隐私
    personalTelPrivacy: state => phone => {
      if (state.privacyConfig.telPrivacyEnable === "1" && phone) {
        if (state.privacyConfig.telPrivacy === "1" && phone.length >= 4) return phone.slice(0, phone.length - 4) + "****"
        else if (state.privacyConfig.telPrivacy === "2" && phone.length >= 8) return phone.slice(0, phone.length - 8) + "********"
        else if (state.privacyConfig.telPrivacy === "2" && phone.length < 8) return "********"
      }
      return phone
    },
    // 居民居住地址隐私
    // province省(自治区、直辖市) city市(地、直州) county县(区) town乡(镇、街道办事处) cun村(街、路、弄、居委会、村委会等) addr门牌号码
    personalAddPrivacy: state => (...args) => {
      if (state.privacyConfig.addPrivacyEnable === "1") {
        // if (state.privacyConfig.addPrivacy === "1") {
        //   let arr = [];
        //   arr = args.filter(item => {
        //     return item
        //   })
        //   if (!arr.length) {
        //     return ""
        //   }
        //   return "****";
        // } else if (state.privacyConfig.addPrivacy === "2") {
        //   let str2 = "";
        //   args.forEach((item, index) => {
        //     if (index <= 1) {
        //       str2 += `${item || ""}`
        //     } else {
        //       str2 += `${item ? "*" : ""}`
        //     }
        //   })
        //   return str2;
        //   // return `${args[0] || ""}${args[1] || ""}****`;
        // } else if (state.privacyConfig.addPrivacy === "3") {
        //   // return `${args[0] || ""}${args[1]  || ""}${args[2]  || ""}${args.length ? "****" : ""}`;
        //   return `${args[0] || ""}${args[1] || ""}${args[2] || ""}****`;
        // }
        let obj = {
          "1": -1,
          "2": 1,
          "3": 2,
        }
        let addPrivacy = state.privacyConfig.addPrivacy || "";
        let str = "";
          args.forEach((item, index) => {
            if (index <= Number(obj[addPrivacy])) {
              str += `${item || ""}`
            } else {
              str += `${item ? "*" : ""}`
            }
          })
          return str;
      }
      // return `${args[0] || ""}${args[1]  || ""}${args[2]  || ""}${[...args].join('')}`
      return `${[...args].join('')}`
    },
    // 医生姓名隐私
    doctorNamePrivacy: state => name => {
      if (state.privacyConfig.doctorNamePrivacyEnable === "1" && name && name !== "--") {
        if (state.privacyConfig.doctorNamePrivacy === "1") return "*" + name.slice(1);
        else if (state.privacyConfig.doctorNamePrivacy === "2") return name.charAt(0) + "*" + name.slice(2);
        else if (state.privacyConfig.doctorNamePrivacy === "3") return name.charAt(0) + "**";
      }
      return name
    },
    // 医生身份证隐私
    doctorIdPrivacy: state => id => {
      if (state.privacyConfig.doctorIdPrivacyEnable === "1" && id) {
        if (state.privacyConfig.doctorIdPrivacy === "1") return id.slice(0, 14) + "****"
        else if (state.privacyConfig.doctorIdPrivacy === "2") return id.slice(0, 7) + "********" + id.slice(15)
      }
      return id
    },
  },
  mutations: {
    // 设置父应用信息
    SET_PER_ARCH_INFO(state, data) {
      state.personalArchInfo = data;
    },
    // 设置配置信息
    SET_INFOMATION_PLATFORMS(state, data) {
      state.infomationPlatforms = data;
    },
    //首页的跳转数据 
    SET_JUMP_TO_DATA(state, data) {
      state.jumpToData = data;
    },
    // 隐私配置
    SET_PRIVACY_CONFIG(state, data) {
      state.privacyConfig = data
    }
  },
  actions: {
    // 设置父应用信息
    setPerArchInfo({
      commit
    }, data) {
      commit("SET_PER_ARCH_INFO", data);
    },
    // 设置配置信息
    setInfomationPlatforms({
      commit
    }, data) {
      commit("SET_INFOMATION_PLATFORMS", data);
    },
    // 设置跳转信息
    setJumpToData({
      commit
    }, data) {
      commit("SET_JUMP_TO_DATA", data);
    },
  }
};