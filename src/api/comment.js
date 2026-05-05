import request from "./request";

// 根据问答id获取对应的评论
export function getIssueCommentById(id, params) {
    return request({
        url: `/api/comment/issuecomment/${id}`,
        method: "GET",
        params,
    });
}

// 提交评论
export function addComment(data) {
    return request({
        url: "/api/comment",
        method: "POST",
        data
    });
}

// 根据 bookId 获取该书籍对应的评论
export function getBookCommentById(id, params) {
    return request({
        url: `/api/comment/bookcomment/${id}`,
        method: "GET",
        params,
    });
}
