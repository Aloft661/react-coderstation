import request from "./request";

// 获取验证码
export function getCaptcha() {
    return request({
        url: "/res/captcha",
        method: "GET"
    });
}

// 查询用户是否存在
export function userIsExist(loginId) {
    return request({
        url: `/api/user/userIsExist/${loginId}`,
        method: "GET",
    });
}

// 注册
export function addUser(data) {
    return request({
        url: "/api/user",
        method: "POST",
        data
    });
}
