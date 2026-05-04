import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Comment, Avatar, Form, Button, List, Tooltip, Pagination, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import styles from "../css/Discuss.module.css"

import { getIssueCommentById, addComment } from "../api/comment";
import { updateIssue } from "../api/issue";
import { getUserById } from "../api/user";
import { updateUserInfoAsync } from "../redux/userSlice";
import { formatDate } from "../utils/tools";

// 评论组件
export default function Discuss(props) {
    const { userInfo, isLogin } = useSelector((state) => state.user);
    const [commentList, setCommentList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
        totalPage: 0
    });
    const dispathc = useDispatch();
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
    }, [props.targetId, pageInfo.current, pageInfo.pageSize, refresh]);

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

    // 添加评论的回调函数
    function onSubmit() {
        let newComment = null;
        if (props.commentType === 1) {
            // 新增问答评论
            newComment = editorRef.current.getInstance().getHTML();
            if (newComment === "<p><br></p>") {
                newComment = "";
            }
        } else if (props.commentType === 2) {
            // 新增书籍评论
        }
        if (!newComment) {
            message.warning("请输入评论内容");
            return;
        }
        addComment({
            userId: userInfo._id,
            typeId: props.issueInfo ? props.issueInfo.typeId : props.bookInfo.typeId,
            commentContent: newComment,
            commentType: props.commentType,
            bookId: null,
            issueId: props.targetId
        });
        message.success("评论成功");
        setRefresh(!refresh);
        editorRef.current.getInstance().setHTML("");
        updateIssue(props.targetId, {
            commentNumber: props.issueInfo ? ++props.issueInfo.commentNumber : ++props.booksInfo.commentNumber
        });
        dispathc(updateUserInfoAsync({
            userId: userInfo._id,
            newInfo: {
                points: userInfo.points + 4
            }
        }));
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
                            <Button type="primary" disabled={!isLogin} onClick={onSubmit}>添加评论</Button>
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
            {
                commentList.length > 0 ? ( // 三目运算
                    <div className={styles.paginationContainer}>
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
                ) : (
                    <div style={{
                        fontWeight: "200",
                        textAlign: "center",
                        margin: "50px"
                    }}>暂无评论</div>
                )
            }
        </div>
    );
}
