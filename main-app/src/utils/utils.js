/* 
SM1 为对称加密
sm2 非对称加密,基于ECC
SM3 消息摘要
SM4 无线局域网标准的分组数据算法,对称加密
 */
const { sm2, sm3, sm4 } = require("sm-crypto");
// 加密测试
export function encrypt(msgString) {
  let msg = msgString;
  if (typeof msgString !== "string") {
    msg = JSON.stringify(msgString);
  }

  //sm2
  const { publicKey, privateKey } = sm2.generateKeyPairHex(); //获取密钥对 publicKey公钥 privateKey私钥

  let keypair2 = sm2.generateKeyPairHex("123123123123123"); // 自定义随机数
  let verifyResult = sm2.verifyPublicKey(publicKey); // 验证公钥

  const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
  let encryptData = sm2.doEncrypt(msg, publicKey, cipherMode); // 加密结果
  let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode); // 解密结果
  console.log("sm2加密结果:\n" + encryptData);
  console.log("sm2解密结果:\n" + decryptData);

  //sm3
  let hashData = sm3(msg); // 杂凑
  console.log("sm3加密结果:\n" + hashData);

  //sm4
  let key = "0123456789abcdef"; // 可以为 16 进制串或字节数组，要求为 128 比特
  key = stringToByte(key);

  let encryptData2 = sm4.encrypt(msg, key); // 加密，默认输出 16 进制字符串，默认使用 pkcs#5 填充
  let decryptData2 = sm4.decrypt(encryptData2, key); // 解密，默认输出 utf8 字符串，默认使用 pkcs#5 填充
  console.log("sm4加密结果:\n" + encryptData2);
  console.log("sm4解密结果:\n" + decryptData2);
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

//菜单名称修改
//menu:菜单集合 list:替换的菜单[{path:'菜单路径',name:'替换的名称'}]
export function changeMenuName(menu, list) {
  let keys = Object.keys(list)
  let values = Object.values(list)
  let temp = 0
  const updateNodeInTree = (treeList, keys, values) => {
    if (!treeList || !treeList.length) {
      return
    }
    for (let i = 0; i < treeList.length; i++) {
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        if (treeList[i].path == key) {
          temp++
          treeList[i].meta.title = values[index]
        }
      }
      if (temp === keys.length) {
        break
      }
      updateNodeInTree(treeList[i].children, keys, values)
    }
  }
  updateNodeInTree(menu, keys, values)
  return menu
}