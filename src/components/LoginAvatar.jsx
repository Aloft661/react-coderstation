import React from "react";
import { useSelector } from "react-redux";
import { Button, List, Popover, Avatar, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "../css/LoginAvatar.module.css";

export default function LoginAvatar(props) {
    const { isLogin, userInfo } = useSelector(state => state.user);

    let loginStatus = null;
    if (isLogin) {
        const content = (
            <List
                dataSource={["个人中心", "退出登录"]}
                size="large"
                renderItem={(item) => {
                    return (
                        <List.Item style={{cursor: "pointer"}}>{item}</List.Item>
                    );
                }}
            />
        );
        loginStatus = (
            <Popover content={content} trigger="hover" placement="bottom">
                <div className={styles.avatarContainer}>
                    <Avatar src={<Image src={userInfo?.avatar} />} preview={false}  size="large" icon={<UserOutlined />} />
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
