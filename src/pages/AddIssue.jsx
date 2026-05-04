import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Form, Input, Select, Button, message } from "antd";
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";

import { typeOptionCreator } from "../utils/tools";
import { getTypeList } from "../redux/typeSlice";
import { addIssue } from "../api/issue";

import styles from "../css/AddIssue.module.css";

export default function AddIssue() {
    const formRef = useRef();
    const editorRef = useRef();
    const navigate = useNavigate();
    const [issueInfo, setIssueInfo] = useState({
        issueTitle: "",
        typeId: "",
        issueContent: "",
        userId: ""
    });
    const { typeList } = useSelector(state => state.type);
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!typeList.length) {
            dispatch(getTypeList());
        }
    }, []);

    // 提交问答的回调函数
    async function addHandle() {
        const content = editorRef.current.getInstance().getHTML();
        try {
            const data = await addIssue({
                issueTitle: issueInfo.issueTitle,
                typeId: issueInfo.typeId,
                issueContent: content,
                userId: userInfo._id
            });
            if (data) {
                message.success("你的问题已经提交，等待审核");
                navigate("/");
            } else {
                message.error("提交失败");
            }
        } catch (error) {
            message.error(error.msg);
        }
    }

    function updateInfo(newContent, key) {
        const newIssueInfo = { ...issueInfo };
        newIssueInfo[key] = newContent;
        setIssueInfo(newIssueInfo);
    }

    // 下拉列表选项改变的时候会触发的回调
    function handleChange(value) {
        updateInfo(value, "typeId");
    }

    return (
        <div className={styles.container}>
            <Form
                name="basic"
                initialValues={issueInfo}
                autoComplete="off"
                ref={formRef}
                onFinish={addHandle}
            >
                {/* 问答标题 */}
                <Form.Item
                    label="标题"
                    name="issueTitle"
                    rules={[{ required: true, message: "请输入标题" }]}
                >
                    <Input
                        placeholder="请输入标题"
                        size="large"
                        value={issueInfo.issueTitle}
                        onChange={e => updateInfo(e.target.value, "issueTitle")}
                    />
                </Form.Item>
                {/* 问答类型 */}
                <Form.Item
                    label="问题分类"
                    name="typeId"
                    rules={[{ required: true, message: "请选择问题所属分类" }]}
                >
                    <Select
                        style={{ width: 200 }}
                        onChange={handleChange}
                    >
                        {typeOptionCreator(Select, typeList)}
                    </Select>
                </Form.Item>
                {/* 问答内容 */}
                <Form.Item
                    label="问题描述"
                    name="issueContent"
                    rules={[{ required: true, message: "请输入问题描述" }]}
                >
                    <Editor
                        initialValue=""
                        previewStyle="vertical"
                        height="600px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        language="zh-CN"
                        ref={editorRef}
                    />
                </Form.Item>
                {/* 确认按钮 */}
                <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        确认新增
                    </Button>

                    <Button
                        type="link"
                        htmlType="reset"
                        className="resetBtn"
                        onClick={() => setIssueInfo({
                            issueTitle: "",
                            typeId: "",
                            issueContent: "",
                            userId: ""
                        })}>
                        重置
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
