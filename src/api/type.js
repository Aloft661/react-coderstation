import request from "./request";

// 获取所有问题类型
export function getType() {
    return request({
        url: "/api/type",
        method: "GET",
    });
}
