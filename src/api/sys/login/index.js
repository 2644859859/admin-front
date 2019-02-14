import ajax from '@/plugin/axios';
import setting from '@/setting.js'
import store from '@/store/';
const REFRESH_TOKEN_URL =  setting.refreshTokenUrl;

export function AccountLogin (data) {
    return ajax({
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': data.deviceId
        },
        url:  setting.loginUrl,
        auth: {
            username: 'paascloud-client-uac',
            password: 'paascloudClientSecret'
        },
        params: data
    })
}

export  function refreshToken() {
    return ajax({
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: REFRESH_TOKEN_URL,
        auth: {
            username: 'paascloud-client-uac',
            password: 'paascloudClientSecret'
        },
        params: {
            refreshToken: store.getters["d2admin/rights/getRefreshToken"],
            accessToken: store.getters["d2admin/rights/getAccessToken"]
        }
    });
}
