import request from "./request";

// 根据问答id获取对应的评论
export function getIssueCommentById(id, params) {
    return request({
        url: `/api/comment/issuecomment/${id}`,
        method: "GET",
        params,
    });
}
