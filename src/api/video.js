import request from "./request";

export function getVideoByPage(params) {
    return request({
        url: "/api/video",
        method: "GET",
        params
    });
}