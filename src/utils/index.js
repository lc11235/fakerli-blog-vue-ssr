import Vue from 'vue';
import store2 from 'store2';

export const inBrowser = typeof window !== 'undefined';

export const ua = () => {
    const userAgentInfo = inBrowser ? navigator.userAgent : '';
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod', 'iPad'];
    let flag = 'PC';
    for (let vv = 0; vv < Agents.length; vv++) {
        if (userAgentInfo.indexOf(Agents[vv]) > 0) {
            flag = Agents[vv];
            break;
        }
    }
    return flag;
};

export const ssp = path => {
    if (!inBrowser) return;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = store2.get(path);
    if (scrollTop) {
        Vue.nextTick().then(() => {
            if (document.body.clientHeight >= scrollTop + clientHeight) {
                window.scrollTo(0, screenTop);
            }
            store2.remove(path);
        });
    }
};

export const strlen = str => {
    let charCode = -1;
    const len = str.length;
    let realLength = 0;
    for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            realLength += 2;
        }
    }
    return realLength;
};