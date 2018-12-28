import api from '~api';
import {
    login,
    logout,
    getUserInfo,
    getMessage,
    getContentByMsgId,
    hasRead,
    removeReaded,
    restoreTrash,
    getUnreadCount
} from '@/api/user';
import { setToken, getToken } from '@/libs/util';

const state = {
    lists: {
        hasNext: false,
        hasPrev: false,
        path: '',
        page: 1,
        data: []
    },
    item: {
        data: {},
        path: ''
    },
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
};

const mutations = {
    'receiveAdminList'(states, { list, path, hasNext, hasPrev, page }) {
        let tempList;
        let tempPage;
        if (page === 1) {
            tempList = [].concat(list);
        } else {
            tempList = states.lists.data.concat(list);
        }
        tempPage = page + 1;
        states.lists = {
            data: tempList,
            hasNext,
            hasPrev,
            tempPage,
            path
        };
    },
    'receiveAdminItem'(states, payload) {
        states.item = payload;
    },
    'updateAdminItem'(states, payload) {
        states.item.data = payload;
        const index = states.lists.data.findIndex(ii => ii._id === payload._id);
        if (index > -1) {
            states.lists.data.splice(index, 1, payload);
        }
    },
    'deleteAdmin'(states, username) {
        const obj = states.lists.data.find(ii => ii.username === username);
        if (obj) obj.is_delete = 1;
    },
    'recoverAdmin'(states, username) {
        const obj = states.lists.data.find(ii => ii.username === username);
        if (obj) obj.is_delete = 0;
    },
    saveAvator(state, avatorPath) {
        state.avatorImgPath = avatorPath;
    },
    setUserId(state, id) {
        state.userId = id;
    },
    setUserName(state, name) {
        state.userName = name;
    },
    setAccess(state, access) {
        state.access = access;
    },
    setToken(state, token) {
        state.token = token;
        setToken(token);
    },
    setHasGetInfo(state, status) {
        state.hasGetInfo = status;
    },
    setMessageCount(state, count) {
        state.unreadCount = count;
    },
    setMessageUnreadList(state, list) {
        state.messageUnreadList = list;
    },
    setMessageReadedList(state, list) {
        state.messageReadedList = list;
    },
    setMessageTrashList(state, list) {
        state.messageTrashList = list;
    }
};

const getters = {
    'getAdminList'(states) {
        return states.lists;
    },
    'getAdminItem'(states) {
        return states.item;
    }
};

const actions = {
    async 'getAdminList'({ commit, rootState: { route: { path }}}, config) {
        const { data: { data, code }} = await api.get('backend/admin/list', { ...config, cache: true });
        if (data && code === 200) {
            commit('receiveAdminList', {
                ...data,
                path,
                page: config.page
            });
        }
    },
    async 'getAdminItem'({ commit, rootState: { route: { path, params: { username }}}}) {
        const { data: { data, code }} = await api.get('backend/admin/item', { username });
        if (data && code === 200) {
            commit('receiveAdminItem', {
                data,
                path
            });
        }
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};