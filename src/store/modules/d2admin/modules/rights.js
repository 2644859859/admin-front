import util from '@/libs/util'
import setting from '@/setting.js';
import { refreshToken } from '@/api/sys/login'
import store from '@/store'

const state = {
    loginName: '',
    rememberMe: '',
    menuList: [],
    aside1: [{aaa:`111`}],
    authToken: {
        access_token: '',
        expires_in: '',
        timestamp: ''
    },
    refreshToken: {
        refresh_token: ''
    },
    REFRESH_TOKEN_URL: setting.refreshTokenUrl,
}
const getters = {
    getLoginName: (state) => {
        if (!state.authToken || state.authToken.access_token === '') {
            state.authToken = util.cookies.get(setting.enums.USER.AUTH_TOKEN) ? JSON.parse(util.cookies.get(setting.enums.USER.AUTH_TOKEN)) : {};
        }
        if (state.authToken) {
            // 判断是否需要续租
            if ((new Date().getTime() - state.authToken.timestamp) > 120 * 60 * 1000) {
                return '';
            }
        }
        return state.authToken.loginName;
    },
        getMenuList: (state) => {
        if (!state.menuList || state.menuList.length === 0) {
            state.menuList = PcLockr.get(setting.enums.USER.MENU_LIST);
        }
        return state.menuList;
    },
        getRememberMe: (state) => {
        if (!state.rememberMe) {
            state.rememberMe = !!util.cookies.get(setting.enums.USER.REMEMBER_ME);
        }
        return state.rememberMe;
    },
    getRefreshToken: (state) => {
        if (!state.refreshToken || !state.refreshToken.refreshToken) {
            state.refreshToken = util.cookies.get(setting.enums.USER.REFRESH_TOKEN) ? JSON.parse(util.cookies.get(setting.enums.USER.REFRESH_TOKEN)) : {};
        }
        return state.refreshToken.refresh_token;
    },
    getAccessToken: (state) => {
        if (!state.authToken || !state.authToken.access_token) {
            state.authToken = util.cookies.get(setting.enums.USER.AUTH_TOKEN) ? JSON.parse(util.cookies.get(setting.enums.USER.AUTH_TOKEN)) : {};
        }
        return state.authToken.access_token;
    },
    getAuthToken: (state) => {
        if (!state.authToken || !state.authToken.access_token) {
            state.authToken = util.cookies.get(setting.enums.USER.AUTH_TOKEN) ? JSON.parse(util.cookies.get(setting.enums.USER.AUTH_TOKEN)) : {};
        }
        return state.authToken;
    },
}
export default {
    namespaced: true,
    state,
    getters,
    mutations: {
        updateRememberMe(state) {
            state.rememberMe = !state.rememberMe;
            if (state.rememberMe) {
                util.cookies.set({
                    key: setting.enums.USER.REMEMBER_ME,
                    value: state.rememberMe
                });
            } else {
                util.cookies.delete({
                    key: setting.enums.USER.REMEMBER_ME
                });
            }
        },
        updateUserInfo(state, loginName) {
            state.loginName = loginName;
            util.cookies.set({
                key: setting.enums.USER.LOGIN_NAME,
                value: loginName
            });
        },
        updateUserMenu(state, menuList) {
            state.menuList = menuList;
            //PcLockr.set(enums.USER.MENU_LIST, menuList);
        },
        updateAuthToken(state, authToken) {
            let expires = 2 / 24;
            let isRemember = !!util.cookies.get("rememberMe");
            if (isRemember) {
                expires = 7;
            }
            // debugger;
            delete authToken['jti'];
            delete authToken['token_type'];
            let refreshToken = {};
            Object.assign(refreshToken, authToken);
            // delete authToken['scope'];
            delete authToken['refresh_token'];
            delete refreshToken['access_token'];
            state.refreshToken = refreshToken;
            state.authToken = authToken;
            console.info( authToken);
            util.cookies.set(setting.enums.USER.AUTH_TOKEN, authToken, {expires: expires});
            util.cookies.set(setting.enums.USER.REFRESH_TOKEN, refreshToken, {expires: expires});
        },
        deleteUserInfo(state) {
            util.cookies.remove(setting.enums.USER.LOGIN_NAME);
            state.loginName = '';
            util.cookies.remove(setting.enums.USER.REMEMBER_ME);
            state.rememberMe = false;
        },
        deleteAuthToken(state) {
            util.cookies.remove( setting.enums.USER.AUTH_TOKEN);
            state.authToken = {};
        },
        deleteMenuList(state) {
            //PcLockr.delete(setting.enums.USER.MENU_LIST);
            state.menuList = {};
        },
        deleteRememberMe(state) {
            //PcLockr.delete(setting.enums.USER.REMEMBER_ME);
            //state.rememberMe = '';
        },
        setRememberMe(state, rememberMe) {
            state.rememberMe = rememberMe;
        }
    },

    actions: {
        async update_remember_me({commit}) {
            commit('updateRememberMe');
        },
        update_user_info({commit}, loginName) {
            commit('updateUserInfo', loginName);
        },
        update_user_menu({commit}, menuList) {
            commit('updateUserMenu', menuList);
        },
        delete_user_info({commit},cb) {
            commit('deleteUserInfo');
            commit('deleteAuthToken');
            commit('deleteMenuList');
            commit('deleteRememberMe');
        },
        update_auth_token({commit}, authToken) {
            commit('updateAuthToken', authToken);
        },
        get_access_token1({commit}, cb) {
            const token = store.getters["d2admin/rights/getAuthToken"];
            state.authToken = token;
            if (!state.authToken || state.authToken.access_token === '') {
                state.authToken = util.cookies.get(setting.enums.USER.AUTH_TOKEN) ? JSON.parse(util.cookies.get(setting.enums.USER.AUTH_TOKEN)) : {};
            }
            console.info("get_access_token::::"+JSON.stringify(state.authToken))
            if (state.authToken) {
                // 判断是否需要续租
                if ((new Date().getTime() - state.authToken.timestamp) > 100 * 60 * 1000) {
                    refreshToken().then(res => {
                        if (res.code === 200) {
                            //alert("new refreshToken"+res.result)
                            console.info(res)
                            if(!res.result.access_token){
                                const newtoken = JSON.parse(res.result)
                                console.info(newtoken.access_token)
                                commit('updateAuthToken', newtoken);
                            }else{
                                commit('updateAuthToken', res.result);
                            }

                        } else {
                            commit('deleteUserInfo');
                            commit('deleteAuthToken');
                            commit('deleteMenuList');
                            commit('deleteRememberMe');
                            jumpLoginPage();
                        }
                        cb && cb(state.authToken.access_token);
                    });
                }else{
                    cb && cb(state.authToken.access_token);
                }
            }

        },
        async get_access_token({ commit, dispatch }, cb) {
            await dispatch('get_access_token1',cb)
        }

    }
}
