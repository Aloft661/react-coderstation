import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Comment, Avatar, Form, Button, List, Tooltip, Pagination, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import styles from "../css/Discuss.module.css"

import { getIssueCommentById, addComment, getBookCommentById } from "../api/comment";
import { updateIssue } from "../api/issue";
import { updateBook } from "../api/book";
import { editUser, getUserById } from "../api/user";
import { updateUserInfoAsync } from "../redux/userSlice";
import { formatDate } from "../utils/tools";

// 评论组件
export default function Discuss(props) {
    const { userInfo, isLogin } = useSelector((state) => state.user);
    const [commentList, setCommentList] = useState([]);
    const [value, setValue] = useState("");
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

    const handleCommentData = async res => {
        const comment = res.data;
        if (!comment.data) return;

        const userIds = comment.data.map(item => item.userId);
        const usersRes = await Promise.all(userIds.map(id => getUserById(id)));

        const newCommentList = comment.data.map((item, index) => ({
            ...item,
            userInfo: usersRes[index].data
        }));
        setCommentList(newCommentList);
        setPageInfo({
            current: comment.currentPage,
            pageSize: comment.eachPage,
            total: comment.count,
            totalPage: comment.totalPage
        });
    }

    useEffect(() => {
        async function fetchCommentList() {
            let res;
            if (props.commentType === 1) {
                res = await getIssueCommentById(props.targetId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                });
            } else if (props.commentType === 2) {
                res = await getBookCommentById(props.targetId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                });
            }
            if (res) {
                await handleCommentData(res);
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
            <Avatar src={userInfo?.avatar} alt="用户头像" />
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
            newComment = value;
        }
        if (!newComment) {
            message.warning("请输入评论内容");
            return;
        } else {
            addComment({
                userId: userInfo._id,
                typeId: props.issueInfo ? props.issueInfo.typeId : props.bookInfo.typeId,
                commentContent: newComment,
                commentType: props.commentType,
                bookId: props.bookInfo?._id,
                issueId: props.issueInfo?._id
            });

            if (props.commentType === 1) {
                updateIssue(props.issueInfo._id, {
                    commentNumber: ++props.issueInfo.commentNumber
                });
                editUser(userInfo._id, {
                    points: userInfo.points + 4
                });
                dispathc(updateUserInfoAsync({
                    userId: userInfo._id,
                    newInfo: {
                        points: userInfo.points + 4
                    }
                }));
                message.success("评论成功，积分+4");
                editorRef.current.getInstance().setHTML("");
            } else if(props.commentType === 2) {
                updateBook(props.bookInfo._id, {
                    commentNumber: ++props.bookInfo.commentNumber
                });
                editUser(userInfo._id, {
                    points: userInfo.points + 2
                });
                dispathc(updateUserInfoAsync({
                    userId: userInfo._id,
                    newInfo: {
                        points: userInfo.points + 2
                    }
                }));
                message.success("评论成功，积分+2");
                setValue("");
            }
            setRefresh(!refresh);
        }
    }

    return (
        <div>
            {/* 评论框 */}
            <Comment
                avatar={avatar}
                content={
                    <>
                        <Form.Item>
                            {
                                props?.commentType === 1 ?
                                    (
                                        <Editor
                                            ref={editorRef}
                                            initialValue=""
                                            previewStyle="vertical"
                                            height="270px"
                                            useCommandShortcut={true}
                                            language="zh-CN"
                                            className="editor"
                                        />
                                    ) : (
                                        <Input.TextArea
                                            rows={4}
                                            placeholder={isLogin ? "" : "请登录后评论..."}
                                            value={value}
                                            onChange={e => setValue(e.target.value)}
                                        />
                                    )
                            }

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
