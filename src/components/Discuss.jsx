import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Comment, Avatar, Form, Button, List, Tooltip, Pagination } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";

import { getIssueCommentById } from "../api/comment";
import { getUserById } from "../api/user";
import { formatDate } from "../utils/tools";

// 评论组件
export default function Discuss(props) {
    const { userInfo, isLogin } = useSelector((state) => state.user);
    const [commentList, setCommentList] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
        totalPage: 0
    });
    const editorRef = useRef(null);

    // 处理翻页的回调函数
    function handlePageChange(current, pageSize) {
        setPageInfo({
            current,
            pageSize,
        });
    }

    useEffect(() => {
        async function fetchCommentList() {
            if (props.commentType === 1) {
                const res = await getIssueCommentById(props.targetId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                });
                console.log(res);
                let comment = res.data;
                if (comment.data) {
                    let ids = comment.data.map(item => getUserById(item.userId));
                    const users = await Promise.all(ids);
                    const newCommentList = comment.data.map((item, index) => ({
                        ...item,
                        userInfo: users[index].data,
                    }));
                    setCommentList(newCommentList);
                    setPageInfo({
                        current: comment.currentPage,
                        pageSize: comment.eachPage,
                        total: comment.count,
                        totalPage: comment.totalPage
                    });
                }
            } else if (props.commentType === 2) {

            }
        }
        if (props.targetId) {
            fetchCommentList();
        }
    }, [props.targetId, pageInfo.current, pageInfo.pageSize]);

    // 根据登录状态进行头像处理
    let avatar = null;
    if (isLogin) {
        avatar = (
            <Avatar src={userInfo?.avatar} />
        );
    } else {
        avatar = (
            <Avatar icon={<UserOutlined />} />
        );
    }

    return (
        <div>
            {/* 评论框 */}
            <Comment
                avatar={avatar}
                content={
                    <>
                        <Form.Item>
                            <Editor
                                ref={editorRef}
                                initialValue=""
                                previewStyle="vertical"
                                height="270px"
                                useCommandShortcut={true}
                                language="zh-CN"
                                className="editor"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" disabled={!isLogin}>添加评论</Button>
                        </Form.Item>
                    </>
                }
            />
            {/* 评论列表 */}
            {commentList.length > 0 && (
                <List
                    header="当前评论"
                    dataSource={commentList}
                    renderItem={item => (
                        <Comment
                            author={<a>{item.userInfo.nickname}</a>}
                            avatar={<Avatar src={item.userInfo.avatar} />}
                            content={
                                <div dangerouslySetInnerHTML={{ __html: item.commentContent }}>
                                </div>
                            }
                            datetime={
                                <Tooltip title={formatDate(item.commentDate, "year")}>
                                    <span>{formatDate(item.commentDate, "year")}</span>
                                </Tooltip>
                            }
                        />
                    )}
                >
                </List>
            )}
            {/* 分页 */}
            <div className="paginationContainer">
                <Pagination
                    showQuickJumper
                    defaultCurrent={1}
                    total={pageInfo.total}
                    {...pageInfo}
                    onChange={handlePageChange}
                    pageSizeOptions={["5", "10", "15", "20"]}
                    showSizeChanger
                />
            </div>
        </div>
    );
}
