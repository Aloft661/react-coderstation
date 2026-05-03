import { useSelector } from "react-redux";
import { Button, List, Popover, Avatar, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { clearUserInfo, changeLoginStatus } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

import styles from "../css/LoginAvatar.module.css";

export default function LoginAvatar(props) {
    const { isLogin, userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function listClickHandle(item) {
        if (item === "个人中心") {
        } else {
            localStorage.removeItem("userToken");
            dispatch(clearUserInfo());
            dispatch(changeLoginStatus(false));
            navigate("/");
        }
    }

    let loginStatus = null;
    if (isLogin) {
        const content = (
            <List
                dataSource={["个人中心", "退出登录"]}
                size="large"
                renderItem={(item) => {
                    return (
                        <List.Item style={{ cursor: "pointer" }} onClick={() => listClickHandle(item)}>{item}</List.Item>
                    );
                }}
            />
        );
        loginStatus = (
            <Popover content={content} trigger="hover" placement="bottom">
                <div className={styles.avatarContainer}>
                    <Avatar src={<Image src={userInfo?.avatar} preview={false} />} size="large" icon={<UserOutlined />} />
                </div>
            </Popover>
        )
    } else {
        loginStatus = (
            <Button type="primary" size="large" onClick={props.loginHandle}>注册/登录</Button>
        );
    }
    return (
        <div>
            {loginStatus}
        </div>
    );
}
