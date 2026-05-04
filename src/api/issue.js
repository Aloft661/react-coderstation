import request from "./request";

// 分页获取问答
export function getIssueByPage(params) {
    return request({
        url: "/api/issue",
        method: "GET",
        params,
    });
}

// 新增问答
export function addIssue(data) {
    return request({
        url: "/api/issue",
        method: "POST",
        data,
    });
}

// 根据id获取问答的详情
export function getIssueById(id) {
    return request({
        url: `/api/issue/${id}`,
        method: "GET",
    });
}