#!/usr/bin/env zx
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const map = {
    'subapp-chronic-disease': 'microapp-mb',
    'subapp-follow-up': 'microapp-mb',
    'subapp-manage-module': 'microapp-manage',
    'subapp-qc-center': 'microapp-qc',
    'subapp-referral': 'microapp-referral',
    'subapp-server-resource-manage': 'microapp-data-dock',
    'subapp-ygt-portal': 'microapp-mh'
}

const configMaps = {
    'microapp-mb': '慢病',
    'microapp-manage': '后台',
    'microapp-qc': '质量',
    'microapp-referral': '转诊',
    'microapp-data-dock': '数据治理',
    'microapp-mh': '门户'
}
const distMaps = {
    'subapp-chronic-disease': 'chronicDisease',
    'subapp-follow-up': 'followup',
    'subapp-manage-module': 'manageModule',
    'subapp-qc-center': 'qcCenter',
    'subapp-referral': 'referral',
    'subapp-server-resource-manage': 'serverResourceManage',
    'subapp-ygt-portal': 'ygtPortal'
}

const sub_app_ath = path.resolve(__dirname, "..");
const sub_apps = fs
    .readdirSync(sub_app_ath)
    .filter((i) => /^master|subapp/.test(i));

const question = [
    {
        type: "checkbox",
        name: "apps",
        message: "请选择要构建的模块（按a全选，按回车直接构建全部）",
        choices: sub_apps,
    },
];


inquirer.prompt(question).then(async (answer) => {
    let sub_apps_ = answer.apps.length ? answer.apps : sub_apps;
    sub_apps_.unshift('main-app');
    run(sub_apps_);
});

async function run(sub_apps_) {
    await $`rm -rf build`;
    await $`mkdir -p build`;

    // 构建App
    await Promise.all(
        sub_apps_.map((app) => $`cd ${app} && npm run build`)
    );

    // sub_apps_ 删除第一项
    sub_apps_.shift();

    // 在build目录下创建对应项目目录 目录与sub_apps_的对应关系为map
    await Promise.all(
        sub_apps_.map((app) => $`mkdir -p build/${map[app]}`)
    );

    let a = sub_apps_.map((app) => `cp -r main-app/main build/${map[app]}`)
    console.log(`a`, a)

    // 复制主应用产物到对应项目目录
    await Promise.all(
        sub_apps_.map((app) => $`cp -r main-app/main build/${map[app]}`)
    );

    // 完成后删除 main-app/main
    await $`rm -rf main-app/main`;

    // 修改主应用config.js
    await Promise.all(
        sub_apps_.map((app) => $`cp scripts/configs/${configMaps[map[app]]}/config.js build/${map[app]}/main/js/config.js`)
    );

    // 复制子应用产物到对应项目目录
    await Promise.all(
        sub_apps_.map((app) => $`cp -r ${app}/${distMaps[app]} build/${map[app]}`)
    );

    await $`scp -P 22 -r build/* root@10.16.140.27:/opt/ygt/web`;
}
