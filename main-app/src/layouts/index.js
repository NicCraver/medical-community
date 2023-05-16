export default function () {
  // 删除lastNode节点后面的数据
  function treeFilter(list) {
    list.forEach((_) => {
      if (_.children && _.children.length) {
        if (_.meta.lastNode) {
          delete _.children
        } else {
          treeFilter(_.children)
        }
      }
    })
  }

  // /app-manageModule/page2 ===> /page
  function fnDisposeChildPath(path) {
    let childPath = null
    // path的值形式如：/app-manageModule/page2，这里/app-manageModule是子应用的基础路由，/page2才是页面地址，所以我们需要将/app-manageModule部分删除
    childPath = path.replace(/^\/app-[^/]+/, '')
    !childPath && (childPath = '/') // 防止地址为空
    return childPath
  }

  // 返回面包屑数据结构
  function getBreadcrumbById(tree, func, path = []) {
    if (!tree) return []
    for (const data of tree) {
      path.push({
        meta: data.meta,
        path: data.path,
      })
      if (func(data)) return path
      if (data.children) {
        const findChildren = getBreadcrumbById(data.children, func, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  }
  return {
    treeFilter,
    fnDisposeChildPath,
    getBreadcrumbById,
  }
}
