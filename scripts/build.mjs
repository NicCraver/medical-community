#!/usr/bin/env zx

// 1. 构建main-app
// 2. 将产物 main 复制到 build/microapp-mb、microapp-manage管理、microapp-referral、qc质控、microapp-data-dock、microapp-mh
// 3. 将config覆盖

// 创建build目录,如果有build文件夹,则删除
await $`rm -rf build`;
await $`mkdir -p build`;

// build 所有包
await Promise.all([
    await $`cd main-app && npm run build`,
    $`cd subapp-chronic-disease && npm run build`,
    $`cd subapp-follow-up && npm run build`,
    $`cd subapp-manage-module && npm run build`,
    $`cd subapp-qc-center && npm run build`,
    $`cd subapp-referral && npm run build`,
    $`cd subapp-server-resource-manage && npm run build`,
    $`cd subapp-ygt-portal && npm run build`,
]);

// 在build目录下创建对应项目目录
await Promise.all([
    await $`mkdir -p build/microapp-mb`,
    await $`mkdir -p build/microapp-manage`,
    await $`mkdir -p build/microapp-qc`,
    await $`mkdir -p build/microapp-mh`,
    await $`mkdir -p build/microapp-data-dock`,
    await $`mkdir -p build/microapp-referral`,
])

// 复制主应用产物到对应项目目录
await Promise.all([
    await $`cp -r main-app/main build/microapp-mb`,
    await $`cp -r main-app/main build/microapp-manage`,
    await $`cp -r main-app/main build/microapp-qc`,
    await $`cp -r main-app/main build/microapp-mh`,
    await $`cp -r main-app/main build/microapp-data-dock`,
    await $`cp -r main-app/main build/microapp-referral`,
])

// 完成后删除 main-app/main
await $`rm -rf main-app/main`;

// 修改主应用config.js
await Promise.all([
    await $`cp scripts/configs/慢病/config.js build/microapp-mb/main/js/config.js`,
    await $`cp scripts/configs/后台/config.js build/microapp-manage/main/js/config.js`,
    await $`cp scripts/configs/质量/config.js build/microapp-manage/main/js/config.js`,
    await $`cp scripts/configs/门户/config.js build/microapp-mh/main/js/config.js`,
    await $`cp scripts/configs/数据治理/config.js build/microapp-data-dock/main/js/config.js`,
    await $`cp scripts/configs/转诊/config.js build/microapp-referral/main/js/config.js`,
]);

// 复制子应用产物到对应项目目录
await Promise.all([
    await $`mv subapp-chronic-disease/chronicDisease build/microapp-mb`,
    await $`mv subapp-follow-up/followup build/microapp-mb`,
    await $`mv subapp-manage-module/manageModule build/microapp-manage`,
    await $`mv subapp-qc-center/qcCenter build/microapp-qc`,
    await $`mv subapp-referral/referral build/microapp-referral`,
    await $`mv subapp-server-resource-manage/serverResourceManage build/microapp-data-dock`,
    await $`mv subapp-ygt-portal/ygtPortal build/microapp-mh`,
]);