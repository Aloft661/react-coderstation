import request from "./request";

// 分页获取书籍
export function getBookByPage(params) {
    return request({
        url: "/api/book",
        method: "GET",
        params
    });
}

// 根据id获取书籍详情
export function getBookById(id) {
    return request({
        url: `/api/book/${id}`,
        method: "GET"
    });
}

// 修改书籍(回答数和浏览数)
export function updateBook(id, data) {
    return request({
        url: `/api/book/${id}`,
        method: "PATCH",
        data
    });
}