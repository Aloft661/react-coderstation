import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import PageHeader from "../components/PageHeader";
import PersonalInfoItem from "../components/PersonalInfoItem";
import { Card, Image, Upload, Modal, Form, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { formatDate } from "../utils/tools";
import { updateUserInfoAsync } from "../redux/userSlice";
import { checkPassword } from "../api/user";

import styles from "../css/Personal.module.css";

// 个人中心
export default function Personal() {
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [panelName, setPanelName] = useState("");
    const [passwordInfo, setPasswordInfo] = useState({
        oldpassword: "",
        newpassword: "",
        passwrodConfirm: false
    });
    const [editInfo, setEditInfo] = useState({});

    function onChange(e) {
        if (e.file.status === "done") {
            const url = e.file.response.data;
            handleAvatar(url, "avatar");
        }
    }

    function handleAvatar(newUrl, key) {
        dispatch(updateUserInfoAsync({
            userId: userInfo._id,
            newInfo: {
                [key]: newUrl
            }
        }));
        message.success("更新头像成功");
    }

    const showModal = (name) => {
        setIsModalOpen(true);
        setEditInfo({});
        setPanelName(name);
    };

    const handleOk = () => {
        dispatch(updateUserInfoAsync({
            userId: userInfo._id,
            newInfo: editInfo
        }));
        message.success("更新信息成功");
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 更新用户输入的密码信息
    function updatePasswordInfo(newInfo, key) {
        const newPasswordInfo = { ...newInfo };
        newPasswordInfo[key] = newInfo.trim();
        setPasswordInfo(newPasswordInfo);
        if (key === "newpassword") {
            updateUserInfo(newInfo, "loginPwd");
        }
    }
    // 更新用户信息
    function updateUserInfo(newInfo, key) {
        if (key === "nickname" && !newInfo) {
            message.warning("昵称不能为空");
            return;
        }
        const newUserInfo = { ...editInfo };
        newUserInfo[key] = newInfo;
        setEditInfo(newUserInfo);
    }
    async function checkPasswordIsRight() {
        if (passwordInfo.oldpassword) {
            const { data } = await checkPassword(userInfo._id, passwordInfo.oldpassword);
            if (!data) {
                return Promise.reject("旧密码错误");
            }
        }
    }
    // 模态框内容
    let modalContent = null;
    switch (panelName) {
        case "基本信息": {
            modalContent = (
                <>
                    <Form
                        name="basic1"
                        autoCapitalize="off"
                        onFinish={handleOk}
                        initialValues={userInfo}
                    >
                        <Form.Item
                            label="登录密码"
                            name="oldpassword"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入旧密码"
                                },
                                {
                                    validator: checkPasswordIsRight
                                }
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input.Password
                                rows={6}
                                value={passwordInfo.oldpassword}
                                placeholder="如果要修改密码，请先输入旧密码"
                                onChange={e => updatePasswordInfo(e.target.value, "oldpassword")}
                            />
                        </Form.Item>
                        <Form.Item
                            label="新密码"
                            name="newpassword"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入新密码"
                                }
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input.Password
                                rows={6}
                                value={passwordInfo.newpassword}
                                placeholder="请输入新密码"
                                onChange={e => updatePasswordInfo(e.target.value, "newpassword")}

                            />
                        </Form.Item>
                        <Form.Item
                            label="确认密码"
                            name="passwrodConfirm"
                            rules={[
                                {
                                    required: true,
                                    message: "请确认密码"
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newpassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("两次输入密码不一致");
                                    }
                                })
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input.Password
                                rows={6}
                                value={passwordInfo.passwrodConfirm}
                                placeholder="请确认密码"
                                onChange={e => updatePasswordInfo(e.target.value, "passwrodConfirm")}
                            />
                        </Form.Item>
                        <Form.Item
                            label="用户昵称"
                            name="nickname"
                        >
                            <Input
                                value={userInfo.nickname}
                                placeholder="昵称可选，默认为新用户"
                                onBlur={e => updateUserInfo(e.target.value, "nickname")}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">确认</Button>
                            <Button type="link" className="resetBtn">重置</Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;
        }
        case "社交账号": {
            modalContent = (
                <>
                    <Form
                        name="basic2"
                        initialValues={userInfo}
                        autoCapitalize="off"
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label="邮箱"
                            name="mail"
                        >
                            <Input
                                value={userInfo.mail}
                                placeholder="请输入邮箱"
                                onBlur={e => updateUserInfo(e.target.value, "mail")}
                            />
                        </Form.Item>
                        <Form.Item
                            label="QQ号"
                            name="qq"
                        >
                            <Input
                                value={userInfo.qq}
                                placeholder="请输入QQ号"
                                onBlur={e => updateUserInfo(e.target.value, "qq")}
                            />
                        </Form.Item>
                        <Form.Item
                            label="微信"
                            name="wechat"
                        >
                            <Input
                                value={userInfo.wechat}
                                placeholder="请输入微信"
                                onBlur={e => updateUserInfo(e.target.value, "wechat")}
                            />
                        </Form.Item>
                        <Form.Item
                            label="github"
                            name="github"
                        >
                            <Input
                                value={userInfo.github}
                                placeholder="请输入github"
                                onBlur={e => updateUserInfo(e.target.value, "github")}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">确认</Button>
                            <Button type="link" className="resetBtn">重置</Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;
        }
        case "个人简介": {
            modalContent = (
                <>
                    <Form
                        name="basic3"
                        initialValues={userInfo}
                        autoCapitalize="off"
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label="自我介绍"
                            name="intro"
                        >
                            <Input.TextArea
                                rows={6}
                                value={userInfo.intro}
                                placeholder="选填"
                                onChange={e => updateUserInfo(e.target.value, "intro")}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">确认</Button>
                            <Button type="link" className="resetBtn">重置</Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;
        }
    }

    return (
        <div>
            <PageHeader title="个人中心" />
            <div className={styles.container}>
                {/* 基本信息 */}
                <div className={styles.row}>
                    <Card title="基本信息" extra={<div className={styles.edit} onClick={() => showModal("基本信息")}>编辑</div>} >
                        <PersonalInfoItem info={{ itemName: "登录账号", itemValue: userInfo.loginId }} />
                        <PersonalInfoItem info={{ itemName: "账号密码", itemValue: "*** *** ***" }} />
                        <PersonalInfoItem info={{ itemName: "用户昵称", itemValue: userInfo.nickname }} />
                        <PersonalInfoItem info={{ itemName: "用户积分", itemValue: userInfo.points }} />
                        <PersonalInfoItem info={{ itemName: "注册时间", itemValue: formatDate(userInfo.registerDate, "year") }} />
                        <PersonalInfoItem info={{ itemName: "上次登录时间", itemValue: formatDate(userInfo.lastLoginDate, "year") }} />
                        <div style={{ fontWeight: 100, height: "50px" }}>当前头像：</div>
                        <Image src={userInfo.avatar} width={100} />
                        <div style={{ fontWeight: 100, height: "50px" }}>上传新头像：</div>
                        <Upload
                            action="/api/upload"
                            maxCount={1}
                            listType="picture-card"
                            onChange={onChange}
                        >
                            <PlusOutlined />
                        </Upload>
                    </Card>
                </div>
                {/* 社交账号 */}
                <div className={styles.row}>
                    <Card title="社交账号" extra={<div className={styles.edit} onClick={() => showModal("社交账号")}>编辑</div>} >
                        <PersonalInfoItem info={{ itemName: "邮箱", itemValue: userInfo.mail || "未填写" }} />
                        <PersonalInfoItem info={{ itemName: "QQ号", itemValue: userInfo.qq || "未填写" }} />
                        <PersonalInfoItem info={{ itemName: "微信号", itemValue: userInfo.wechat || "未填写" }} />
                        <PersonalInfoItem info={{ itemName: "github", itemValue: userInfo.github || "未填写" }} />
                    </Card>
                </div>
                {/* 个人简介 */}
                <div className={styles.row}>
                    <Card title="个人简介" extra={<div className={styles.edit} onClick={() => showModal("个人简介")}>编辑</div>} >
                        <p className={styles.intro}>
                            {userInfo.intro || "未填写"}
                        </p>
                    </Card>
                </div>
            </div>
            {/* 修改信息 */}
            <Modal title={panelName} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                {modalContent}
            </Modal>
        </div>
    );
}
