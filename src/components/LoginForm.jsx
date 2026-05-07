import { useState, useEffect } from "react";
import { Modal, Radio, Form, Row, Col, Input, Checkbox, Button, message } from "antd";
import { getCaptcha, userIsExist, addUser, userLogin, getUserById } from "../api/user";
import { initUserInfo, changeLoginStatus } from "../redux/userSlice";
import { useDispatch } from "react-redux";

import styles from "../css/LoginForm.module.css";

const rememberedLoginInfoKey = "rememberedLoginInfo";

const initialLoginErrors = {
    loginId: "",
    loginPwd: "",
    captcha: "",
};

const initialRegisterErrors = {
    loginId: "",
    captcha: "",
};

export default function LoginForm(props) {
    const [value, setValue] = useState(1);
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
    const [loginErrors, setLoginErrors] = useState(initialLoginErrors);
    const [registerErrors, setRegisterErrors] = useState(initialRegisterErrors);
    // 验证码状态
    const [captcha, setCaptcha] = useState(null);

    useEffect(() => {
        // 初始化验证码
        captchaClickHandle();

        if (props.isShow) {
            const rememberedLoginInfo = localStorage.getItem(rememberedLoginInfoKey);
            if (rememberedLoginInfo) {
                const { loginId, loginPwd } = JSON.parse(rememberedLoginInfo);
                setLoginInfo({
                    loginId,
                    loginPwd,
                    captcha: "",
                    remember: true
                });
            }
        }
    }, [props.isShow]);

    function onChange(e) {
        setValue(e.target.value);
    }
    async function loginHandle() {
        if (!validateLoginInfo()) {
            return;
        }

        try {
            const res = await userLogin(loginInfo);
            if (res.data) {
                const data = res.data;
                if (!data.data) {
                    message.warning("账号或密码错误");
                    captchaClickHandle();
                } else if (!data.data.enabled) {
                    message.warning("账号已被禁用");
                    captchaClickHandle();
                } else {
                    message.success("登录成功");
                    if (loginInfo.remember) {
                        localStorage.setItem(rememberedLoginInfoKey, JSON.stringify({
                            loginId: loginInfo.loginId,
                            loginPwd: loginInfo.loginPwd,
                        }));
                    } else {
                        localStorage.removeItem(rememberedLoginInfoKey);
                    }
                    localStorage.setItem("userToken", data.token);
                    const user = await getUserById(data.data._id);
                    dispatch(initUserInfo(user.data));
                    dispatch(changeLoginStatus(true));
                    handleCancel();
                }
            } else {
                message.warning(res.msg);
                captchaClickHandle();
            }
        } catch (error) {
            handleSubmitError(error, setLoginErrors);
        }
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
        setLoginErrors(initialLoginErrors);
        setRegisterErrors(initialRegisterErrors);
        props.close();
    }

    // 注册处理函数
    async function registerHandle() {
        if (!validateRegisterInfo()) {
            return;
        }
        const isExist = await checkLoginIdIsExist(registerInfo.loginId);
        if (isExist) {
            return;
        }

        try {
            const res = await addUser(registerInfo);
            if (res.data) {
                message.success("注册成功");
                localStorage.setItem("userToken", res.data.token);
                dispatch(initUserInfo(res.data));
                dispatch(changeLoginStatus(true));
                handleCancel();
            } else {
                message.warning(res.msg);
                captchaClickHandle();
            }
        } catch (error) {
            handleSubmitError(error, setRegisterErrors);
        }
    }
    // 刷新验证码
    async function captchaClickHandle() {
        const res = await getCaptcha();
        setCaptcha(res);
    }

    function handleSubmitError(error, setErrors) {
        const errorMsg = error?.response?.data?.msg || error?.message || "操作失败";
        if (errorMsg.includes("验证码")) {
            setErrors((oldErrors) => ({
                ...oldErrors,
                captcha: errorMsg,
            }));
        } else {
            message.warning(errorMsg);
        }
        captchaClickHandle();
    }

    /**
     * 
     * @param {Object} oldInfo 之前整体的状态
     * @param {String} newContent 用户输入的新的内容
     * @param {String} key 对应的键名
     * @param {Function} setInfo 修改状态值的函数
     */
    function updateInfo(oldInfo, newContent, key, setInfo, setErrors) {
        const obj = { ...oldInfo };
        obj[key] = newContent;
        setInfo(obj);

        if (setErrors) {
            setErrors((oldErrors) => ({
                ...oldErrors,
                [key]: "",
            }));
        }
    }

    function validateLoginInfo() {
        const errors = {
            loginId: loginInfo.loginId ? "" : "请输入账号",
            loginPwd: loginInfo.loginPwd ? "" : "请输入密码",
            captcha: loginInfo.captcha ? "" : "请输入验证码",
        };

        setLoginErrors(errors);
        return !errors.loginId && !errors.loginPwd && !errors.captcha;
    }

    function validateRegisterInfo() {
        const errors = {
            loginId: registerInfo.loginId ? "" : "请输入账号，仅此项为必填项",
            captcha: registerInfo.captcha ? "" : "请输入验证码",
        };

        setRegisterErrors(errors);
        return !errors.loginId && !errors.captcha;
    }

    /**
     * 验证登录账号是否存在
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    async function checkLoginIdIsExist(loginId = registerInfo.loginId) {
        if (!loginId) {
            setRegisterErrors((oldErrors) => ({
                ...oldErrors,
                loginId: "请输入账号，仅此项为必填项",
            }));
            return true;
        }

        const { data } = await userIsExist(loginId);
        if (data) {
            setRegisterErrors((oldErrors) => ({
                ...oldErrors,
                loginId: "该用户已存在",
            }));
            return true;
        }

        setRegisterErrors((oldErrors) => ({
            ...oldErrors,
            loginId: "",
        }));
        return false;
    }

    let container = null;
    if (value === 1) {
        container = (
            <div className={styles.container}>
                <Form
                    name="basic1"
                    autoComplete="off"
                    onFinish={loginHandle}
                >
                    <Form.Item
                        label="登录账号"
                        validateStatus={loginErrors.loginId ? "error" : ""}
                        help={loginErrors.loginId}
                    >
                        <Input
                            placeholder="请输入你的登录账号"
                            value={loginInfo.loginId}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo, setLoginErrors)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        validateStatus={loginErrors.loginPwd ? "error" : ""}
                        help={loginErrors.loginPwd}
                    >
                        <Input.Password
                            placeholder="请输入你的登录密码，新用户默认为123456"
                            value={loginInfo.loginPwd}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginPwd', setLoginInfo, setLoginErrors)}
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item
                        label="验证码"
                        validateStatus={loginErrors.captcha ? "error" : ""}
                        help={loginErrors.captcha}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={loginInfo.captcha}
                                    onChange={(e) => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo, setLoginErrors)}
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
                        <Button
                            htmlType="button"
                            onClick={() => {
                                setLoginInfo({
                                    loginId: "",
                                    loginPwd: "",
                                    captcha: "",
                                    remember: false
                                });
                                setLoginErrors(initialLoginErrors);
                                localStorage.removeItem(rememberedLoginInfoKey);
                            }}
                        >
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
                    onFinish={registerHandle}
                >
                    <Form.Item
                        label="登录账号"
                        validateStatus={registerErrors.loginId ? "error" : ""}
                        help={registerErrors.loginId}
                    >
                        <Input
                            placeholder="请输入账号"
                            value={registerInfo.loginId}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo, setRegisterErrors)}
                            onBlur={(e) => checkLoginIdIsExist(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="用户昵称"
                    >
                        <Input
                            placeholder="请输入昵称，不填则有默认昵称"
                            value={registerInfo.nickname}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                        validateStatus={registerErrors.captcha ? "error" : ""}
                        help={registerErrors.captcha}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={registerInfo.captcha}
                                    onChange={(e) => updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo, setRegisterErrors)}
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
                        <Button
                            htmlType="button"
                            onClick={() => {
                                setRegisterInfo({
                                    loginId: "",
                                    nickname: "",
                                    captcha: "",
                                });
                                setRegisterErrors(initialRegisterErrors);
                            }}
                        >
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    return (
        <div>
            <Modal title="注册/登录" open={props.isShow} onCancel={props.close} footer={null}>
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
