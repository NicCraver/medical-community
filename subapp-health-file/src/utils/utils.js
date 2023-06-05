/* 
SM1 为对称加密
sm2 非对称加密,基于ECC
SM3 消息摘要
SM4 无线局域网标准的分组数据算法,对称加密
 */
const {
  sm2,
  sm3,
  sm4
} = require("sm-crypto");
// 加密测试
export function encrypt(msgString) {
  let msg = msgString;
  if (typeof msgString !== "string") {
    msg = JSON.stringify(msgString);
  }

  //sm2
  const {
    publicKey,
    privateKey
  } = sm2.generateKeyPairHex(); //获取密钥对 publicKey公钥 privateKey私钥

  let keypair2 = sm2.generateKeyPairHex("123123123123123"); // 自定义随机数
  let verifyResult = sm2.verifyPublicKey(publicKey); // 验证公钥

  const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
  let encryptData = sm2.doEncrypt(msg, publicKey, cipherMode); // 加密结果
  let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode); // 解密结果
  // console.log("sm2加密结果:\n" + encryptData);
  // console.log("sm2解密结果:\n" + decryptData);

  //sm3
  let hashData = sm3(msg); // 杂凑
  // console.log("sm3加密结果:\n" + hashData);

  //sm4
  let key = "0123456789abcdef"; // 可以为 16 进制串或字节数组，要求为 128 比特
  key = stringToByte(key);

  let encryptData2 = sm4.encrypt(msg, key); // 加密，默认输出 16 进制字符串，默认使用 pkcs#5 填充
  let decryptData2 = sm4.decrypt(encryptData2, key); // 解密，默认输出 utf8 字符串，默认使用 pkcs#5 填充
  // console.log("sm4加密结果:\n" + encryptData2);
  // console.log("sm4解密结果:\n" + decryptData2);
}

//sm3加密
export function encryptsm3(msgString) {
  let msg = msgString;
  if (typeof msgString !== "string") {
    msg = JSON.stringify(msgString);
  }
  return sm3(msg);
}

// sm4加密
export function encryptsm4(msgString) {
  let msg = msgString;
  if (typeof msgString !== "string") {
    msg = JSON.stringify(msgString);
  }
  let key = stringToByte(sessionStorage.getItem("secretKey"));

  // console.log("sm4.encrypt", msg, key);
  return sm4.encrypt(msg, key);
}

//sm4解密
export function decryptsm4(data) {
  let key = stringToByte(sessionStorage.getItem("secretKey"));
  return sm4.decrypt(data, key);
}

//string转byte
function stringToByte(str) {
  var len, c;
  len = str.length;
  var bytes = [];
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return new Int8Array(bytes);
}

export function throttle(func, wait) {
  let timeout;
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.call(this, arguments);
      }, wait);
    }
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source && source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 通过身份证号码获取出生日期
 */
export function getBirthdayFromIdCard(idCard) {
  var birthday = "";
  if (idCard != null && idCard != "") {
    if (idCard.length == 15) {
      birthday = "19" + idCard.substr(6, 6);
    } else if (idCard.length == 18) {
      birthday = idCard.substr(6, 8);
    }

    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
  }

  return birthday;
}

/**
 * 数字转化中文方法
 */
export function intToChinese(str) {
  str = str + "";
  var len = str.length - 1;
  var idxs = [
    "",
    "十",
    "百",
    "千",
    "万",
    "十",
    "百",
    "千",
    "亿",
    "十",
    "百",
    "千",
    "万",
    "十",
    "百",
    "千",
    "亿",
  ];
  var num = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return str.replace(/([1-9]|0+)/g, function ($, $1, idx, full) {
    var pos = 0;
    if ($1[0] != "0") {
      pos = len - idx;
      if (idx == 0 && $1[0] == 1 && idxs[len - idx] == "十") {
        return idxs[len - idx];
      }
      return num[$1[0]] + idxs[len - idx];
    } else {
      var left = len - idx;
      var right = len - idx + $1.length;
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - (left % 4);
      }
      if (pos) {
        return idxs[pos] + num[$1[0]];
      } else if (idx + $1.length >= len) {
        return "";
      } else {
        return num[$1[0]];
      }
    }
  });
}