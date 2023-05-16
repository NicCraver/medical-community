let menuData = [
  { path: '/welcome', name: 'welcome', meta: { title: '欢迎', icon: 'icon-icon-test' } },
  {
    path: '/app-vue2',
    name: 'app-vue2',
    meta: { title: '子应用', icon: 'icon-tuijian', flat: true },
    children: [
      {
        path: '/app-vue2/',
        meta: { title: '首页', name: 'app-vue2' },
      },
      {
        path: '/app-vue2/page2',
        meta: { title: 'page2', name: 'app-vue2' },
      },
      {
        path: '/app-vue2/page3',
        meta: { title: '子应用-3', i·con: 'icon-tuijian', flat: true },
        children: [
          {
            path: '/app-vue2/page3',
            meta: { title: '3级页面' },
          },
        ],
      },
    ],
  },
  {
    path: '/admins',
    name: 'admins',
    meta: { title: '管理页', icon: 'icon-tuijian', flat: true },
    children: [
      {
        path: '/admins/page-1',
        meta: { title: '一级页面' },
      },
      {
        path: '/admins/page-2',
        meta: { title: '二级页面' },
      },
      {
        path: '/admins/page-3',
        meta: { title: 'page3', icon: 'icon-tuijian', flat: true },
        children: [
          {
            path: '/admins/page-3/page3-1',
            meta: { title: '3级页面' },
          },
        ],
      },
    ],
  },
  { path: '/version', name: 'version', meta: { title: 'Version', icon: 'icon-antdesign' } },
];

let path = '/admins/page-3/page3-1';

// result
let openKeys = ['/admins', '/admins/page-3'];
let selectedKeys = ['/admins', '/admins/page-3', '/admins/page-3/page3-1'];
