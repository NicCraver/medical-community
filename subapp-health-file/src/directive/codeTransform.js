import {
    getPCodesList,
    transNameFuc
} from "@/utils/dictCodes.js";

export default (Vue) => {
    Vue.directive("codeTransform", {
        bind(el, binding, vnode) {},
        inserted: function (el, binding, vnode) {
            getTransFormCode(el);
        },
        componentUpdated: function () {},
        unbind: function (el) {
            el.innerText = ''
        },
        update(el, binding, vnode, oldVnode) {
            // 对比两次虚拟dom中挂载的入参有没有变化
            let codeNew = vnode.data.attrs.code;
            let valNew = vnode.data.attrs.val;
            let codeOld = oldVnode.data.attrs.code;
            let valOld = oldVnode.data.attrs.val;

            if (codeNew === codeOld && valNew === valOld) {
                return;
            }
            getTransFormCode(el);
        },
    });
};

async function getTransFormCode(el) {
    let code = el.getAttribute("code") || "";
    let val = el.getAttribute("val");
    el.innerHTML = "";
    el.title = "";
    if (val === null) {
        return;
    }

    if (val === "" || code === "") {
        el.innerText = "--";
        el.innerHTML = "--";
        el.title = "";
        return;
    }
    let name = await transNameFuc(val, code);
    el.innerText = name;
    el.title = name;

}