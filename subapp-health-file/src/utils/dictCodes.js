import {
    getDictSimpleByCodes,
    getZDDictSimpleByCodes
} from "@/api/modules/dictCodes/index.js";
import localForage from "localforage";

// 获取全部的数据字典
export async function getDictCodesList(list) {
    let codeInit = ["DEPT_DIC", "CV02.01.101", "GB/T 4761-2008", "CV05.10.024", "CV05.10.023", "CT01.00.030", "CT05.10.013", "CV06.00.229", "CT01.00.002", "GB/T 15657-1995", "GB/T 15657-1995-6", "CV06.00.221", "CV06.00.224"];
    let codeList = list ? list.join(",") : codeInit.join(",");
    try {
        let res = await getDictSimpleByCodes({
            codes: codeList
        });
        if (res.code === 0) {
            console.log("获取缓存字典列表信息:", res);
            setLocalForage("dictCodes", res.result || []);
        }
    } catch (error) {}
}

// 获取某一个数据字典
export async function getPCodesList(list, fn) {
    let codeList = list ? list.join(",") : "";
    try {
        let res = await getDictSimpleByCodes({
            codes: codeList
        });
        if (res.code === 0) {
            console.log("获取某个类型的字典列表信息:" + codeList, res);
            let newList = res.result;
            fn && fn(newList)
            localForage.getItem("dictCodes").then(list => {
                let allList = list.concat(newList);
                setLocalForage("dictCodes", allList || []);
            })
        }
    } catch (error) {}
}

// 获取诊断数据字典
export async function getDiaCodesList(fn) {
    try {
        let res = await getZDDictSimpleByCodes({
            codes: "GB/T 14396-2016"
        });
        if (res.code === 0) {
            console.log("获取诊断的字典列表信息:", res.result);
            setLocalForage("diaDictCodes", res.result || []);
            fn && fn(res)
        }
    } catch (error) {}
}

// 数据字典反显方法
export async function transNameFuc(val, code) {
    if (val === "" || !code) {
        return "--";
    }
    let transName = "";
    try {
        // 诊断反显
        if (code === "GB/T 14396-2016") {
            transName = await transNameDiaFuc(val);
            return transName || "--";
        }

        // 其他数据字典
        transName = await transNameOthFuc(val, code);
        return transName || "--";
    } catch (error) {
        return "--"
    }
}

// 反显通用的数据字典
export async function transNameOthFuc(val, code) {
    let transName = "";
    let dictCodesList = await localForage.getItem("dictCodes");
    // 查询有没有包含code的数据
    let pCodeArr = dictCodesList.filter((item) => {
        return item && item.partentCode === code;
    });

    let textObj = {};
    if (!pCodeArr || !pCodeArr.length) {
        getPCodesList([code], (list) => {
            textObj = list.find(item => {
                return item && item.partentCode === code
            });
            transName = textObj && textObj.hasOwnProperty("name") ? textObj.name : "--";

        })
        return transName || "--";
    }

    textObj = pCodeArr.find(item => {
        return item && item.partentCode === code && item.code === val
    });
    transName = textObj && textObj.hasOwnProperty("name") ? textObj.name : "--";
    return transName;
}

// 反显诊断编码
export async function transNameDiaFuc(val) {
    let transName = "";
    let dictCodesList = await localForage.getItem("diaDictCodes");
    let textObj = {};
    if (!dictCodesList.length) {
        await getDiaCodesList((list) => {
            textObj = list.find(item => {
                return item.code === val
            });
            transName = textObj && textObj.hasOwnProperty("name") ? textObj.name : "--";
        })
        return transName || "--";
    }
    textObj = dictCodesList.find(item => {
        return item.code === val
    });
    transName = textObj && textObj.hasOwnProperty("name") ? textObj.name : "--";
    return transName;
}

export async function setLocalForage(name, data) {
    try {
        const value = await localForage.setItem(name, data);
        console.log("setLocalForage成功", value.length);
    } catch (error) {
        console.log("setLocalForage失败", err);
    }
}