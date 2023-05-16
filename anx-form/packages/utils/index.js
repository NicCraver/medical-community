// 判断传入列表是否为grid
export const judgeIsGrid = (formComponentList, cb) => {
  formComponentList.forEach(item => {
    if (item.type === 'grid') {
      item.columns.forEach(colItem => {
        colItem.list.forEach(innerFormItem => {
          cb(innerFormItem);
        });
      });
    } else {
      cb(item);
    }
  });
};

// 新增表单元素时重新更正唯一值
export const extendExtraKeys = formItemType => {
  const extra = {
    id: `anx-form-${new Date().getTime()}`,
    key: new Date().getTime(),
    model: `${formItemType}_${new Date().getTime()}`,
    remoteFunc: `func_${new Date().getTime()}`
  };
  if (formItemType === 'whether' || formItemType === 'checkboxOther') {
    extra.inputModel = `input_${new Date().getTime()}`;
  }
  if (formItemType === 'BMI') {
    extra.heightModel = 'height_' + new Date().getTime();
    extra.weightModel = 'weight_' + new Date().getTime();
    extra.BMIModel = 'BMIModel__' + new Date().getTime();
  }
  console.log(`extra`, extra);
  return extra;
};

// 创建script
export const createScript = ({ ...args }) => {
  if (!args.text && !args.src) {
    return;
  }
  const script = document.createElement('script');
  script.type = 'text/javascript';
  for (const key in args) {
    script[key] = args[key];
  }
  document.head.appendChild(script);
  return script;
};

// 判断所有插入的script文件是否读取完毕,并执行对应方法
export const loadAllScripts = (scriptList, cb, index) => {
  if (!scriptList || !scriptList.length) {
    if (typeof cb === 'function') {
      cb();
    } else {
      console.error('cb need to be a function');
    }
    return;
  }
  index = index || 0;
  const script = createScript({
    src: scriptList[index]
  });
  script.onload = () => {
    if (index === scriptList.length - 1) {
      if (typeof cb === 'function') {
        cb();
      } else {
        console.error('cb need to be a function');
      }
    } else {
      loadAllScripts(scriptList, ++index, cb);
    }
  };
};

// 通过ID移除script
export const removeScriptById = id => {
  const scriptDom = document.getElementById(id);
  scriptDom && document.head.removeChild(scriptDom);
};

// 通过src移除script
export const removeScriptBySrc = src => {
  if (!src) {
    console.error('arguments of removeScriptBySrc is needed');
    return;
  }
  const scripts = document.head.getElementsByTagName('script');
  let scriptDom;
  for (const index in scripts) {
    if (scripts[index].src && scripts[index].src === src) {
      scriptDom = scripts[index];
      break;
    }
  }
  scriptDom && document.head.removeChild(scriptDom);
};

// 创建link
export const createLink = ({ ...args }) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  for (const key in args) {
    link[key] = args[key];
  }
  document.head.appendChild(link);
};

// 通过href移除link
export const removeLinkByHref = href => {
  const links = document.head.getElementsByTagName('link');
  let linkDom;
  for (const index in links) {
    if (links[index].href && links[index].href === href) {
      linkDom = links[index];
      break;
    }
  }
  linkDom && document.head.removeChild(linkDom);
};

export const convertImageToBase64 = (file, cb) => {
  const reader = new FileReader();
  if (file) {
    reader.readAsDataURL(file);
  }
  reader.onloadend = () => {
    cb(reader.result);
  };
};
