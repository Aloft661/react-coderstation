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

// 登录
export function userLogin(data) {
    return request({
        url: "/api/user/login",
        method: "POST",
        data
    });
}

// 根据id来查找用户
export function getUserById(id) {
    return request({
        url: `/api/user/${id}`,
        method: "GET",
    });
}

// 恢复登录状态
export function getInfo() {
    return request({
        url: `/api/user/whoami`,
        method: "GET"
    });
}

// 获取积分前十的用户
export function getUserByPointsRank() {
    return request({
        url: "/api/user/pointsrank",
        method: "GET"
    });
}

// 根据id修改用户
export function editUser(id, data) {
    return request({
        url: `/api/user/${id}`,
        method: "PATCH",
        data
    });
}