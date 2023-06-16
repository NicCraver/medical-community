#!/usr/bin/env zx
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

async function run() {
    // 计时
    console.time("build-hei");

    await $`rm -rf build-hei`;
    await $`mkdir -p build-hei`;

    // 构建主应用
    // 构建ehr 电子病历
    await $`cd main-app && npm run build:hei-ehr-p`
    await $`cp -r main-app/main build-hei/main-ehr`
    // 构建数据治理
    await $`cd main-app && npm run build:hei-p`
    await $`cp -r main-app/main build-hei/main-serve`
    // 门户
    await $`cd main-app && npm run build:hei-portal-p`
    await $`cp -r main-app/main build-hei/main-mh`
    
    // 完成后删除 main-app/main
    await $`rm -rf main-app/main`;

    // 修改主应用config.js
    await Promise.all(
        [
            $`cp scripts/configs/黑龙江/config.js build-hei/main-ehr/js/config.js`,
            $`cp scripts/configs/黑龙江/config.js build-hei/main-serve/js/config.js`,
            $`cp scripts/configs/黑龙江/config.js build-hei/main-mh/js/config.js`,
        ]
    );
    // 构建子应用
    await Promise.all(
        [
            $`cd subapp-health-file && npm run build:hei`,
            $`cd subapp-ygt-portal && npm run build:hei`,
            $`cd subapp-server-resource-manage && npm run build:hei`,
        ]
    );

    // 复制子应用产物到对应项目目录
    await Promise.all(
        [
            $`cp -r subapp-health-file/healthFile build-hei/healthFile`,
            $`cp -r subapp-ygt-portal/ygtPortal build-hei/ygtPortal`,
            $`cp -r subapp-server-resource-manage/serverResourceManage build-hei/serverResourceManage`,
        ]
    );

    // 完成后删除
    await Promise.all(
        [
            $`rm -rf subapp-health-file/healthFile`,
            $`rm -rf subapp-ygt-portal/ygtPortal`,
            $`rm -rf subapp-server-resource-manage/serverResourceManage`,
        ]
    );
    console.timeEnd("build-hei");
}

run()
