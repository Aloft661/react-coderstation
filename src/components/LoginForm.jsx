import { useState, useRef, useEffect } from "react";
import { Modal, Radio, Form, Row, Col, Input, Checkbox, Button, message } from "antd";
import { getCaptcha, userIsExist, addUser } from "../api/user";
import { initUserInfo, changeLoginStatus } from "../redux/userSlice";
import { useDispatch } from "react-redux";

import styles from "../css/LoginForm.module.css";

export default function LoginForm(props) {
    const [value, setValue] = useState(1);
    // 登录注册表单引用
    const loginFormRef = useRef(null);
    const registerFormRef = useRef(null);
    const dispatch = useDispatch();
    // 登录表单状态
    const [loginInfo, setLoginInfo] = useState({
        loginId: "",
        loginPwd: "",
        captcha: "",
        remember: false
    });
    // 注册表单状态
    const [registerInfo, setRegisterInfo] = useState({
        loginId: "",
        nickname: "",
        captcha: "",
    });
    // 验证码状态
    const [captcha, setCaptcha] = useState(null);

    useEffect(() => {
        // 初始化验证码
        captchaClickHandle();
    }, [props.isShow]);

    function handleOk() {
        // props.close();
    }
    function onChange(e) {
        setValue(e.target.value);
    }
    function loginHandle(values) {
        console.log(values);
    }

    function handleCancel() {
        setRegisterInfo({
            loginId: "",
            nickname: "",
            captcha: "",
        });
        setLoginInfo({
            loginId: "",
            loginPwd: "",
            captcha: "",
            remember: false
        });
        props.close();
    }

    // 注册处理函数
    async function registerHandle() {
        const res = await addUser(registerInfo);
        if (res.data) {
            message.success("注册成功");
            dispatch(initUserInfo(res.data));
            dispatch(changeLoginStatus(true));
            handleCancel();
        } else {
            message.warning(res.msg);
            captchaClickHandle();
        }
    }
    // 刷新验证码
    async function captchaClickHandle() {
        const res = await getCaptcha();
        setCaptcha(res);
    }

    /**
     * 
     * @param {Object} oldInfo 之前整体的状态
     * @param {String} newContent 用户输入的新的内容
     * @param {String} key 对应的键名
     * @param {Function} setInfo 修改状态值的函数
     */
    function updateInfo(oldInfo, newContent, key, setInfo) {
        const obj = { ...oldInfo };
        obj[key] = newContent;
        setInfo(obj);
    }

    /**
     * 验证登录账号是否存在
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    async function checkLoginIdIsExist() {
        if (registerInfo.loginId) {
            const { data } = await userIsExist(registerInfo.loginId);
            if (data) {
                return Promise.reject("该用户已存在");
            }
        }
    }

    let container = null;
    if (value === 1) {
        container = (
            <div className={styles.container}>
                <Form
                    name="basic1"
                    autoComplete="off"
                    onFinish={loginHandle}
                    ref={loginFormRef}
                >
                    <Form.Item
                        label="登录账号"
                        name="loginId"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号",
                            },
                        ]}
                    >
                        <Input
                            placeholder="请输入你的登录账号"
                            value={loginInfo.loginId}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        name="loginPwd"
                        rules={[
                            {
                                required: true,
                                message: "请输入密码",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入你的登录密码，新用户默认为123456"
                            value={loginInfo.loginPwd}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginPwd', setLoginInfo)}
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item
                        name="logincaptcha"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={loginInfo.captcha}
                                    onChange={(e) => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo)}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={styles.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Checkbox
                            onChange={(e) => updateInfo(loginInfo, e.target.checked, 'remember', setLoginInfo)}
                            checked={loginInfo.remember}
                        >记住我</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            登录
                        </Button>
                        <Button type="primary" htmlType="submit">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    } else {
        container = (
            <div className={styles.container}>
                <Form
                    name="basic2"
                    autoComplete="off"
                    ref={registerFormRef}
                    onFinish={registerHandle}
                >
                    <Form.Item
                        label="登录账号"
                        name="loginId"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号，仅此项为必填项",
                            },
                            // 验证用户是否已经存在
                            { validator: checkLoginIdIsExist },
                        ]}
                        validateTrigger='onBlur'
                    >
                        <Input
                            placeholder="请输入账号"
                            value={registerInfo.loginId}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="用户昵称"
                        name="nickname"
                    >
                        <Input
                            placeholder="请输入昵称，不填则有默认昵称"
                            value={registerInfo.nickname}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="registercaptcha"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            }
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={registerInfo.captcha}
                                    onChange={(e) => updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo)}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={styles.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            注册
                        </Button>
                        <Button type="primary" htmlType="submit">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    return (
        <div>
            <Modal title="注册/登录" open={props.isShow} onOk={handleOk} onCancel={props.close}>
                <Radio.Group
                    className={styles.radioGroup}
                    value={value}
                    onChange={(e) => onChange(e)}
                    buttonStyle="solid"
                >
                    <Radio.Button value={1} className={styles.radioButton}>登录</Radio.Button>
                    <Radio.Button value={2} className={styles.radioButton}>注册</Radio.Button>
                </Radio.Group>
                {container}
            </Modal>
        </div>
    )
}
