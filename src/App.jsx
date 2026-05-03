import { useState, useEffect } from "react";
import { Layout } from "antd";
import NavHeader from "./components/NavHeader";
import PageFoot from "./components/PageFoot";
import "./css/App.css";
import { getInfo, getUserById } from "./api/user";
import { changeLoginStatus, initUserInfo } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import { message } from "antd";

import RouterConfig from "./router";
import LoginForm from "./components/LoginForm";

const { Header, Footer, Content } = Layout;

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const res = await getInfo();
            if (res.data) {
                // setUserInfo(res.data);
                const { data } = await getUserById(res.data._id);
                dispatch(initUserInfo(data));
                dispatch(changeLoginStatus(true));
            } else {
                message.warning(res.msg);
                localStorage.removeItem("userToken");
            }
        }
        if (localStorage.getItem("userToken")) {
            fetchData();
        }
    }, []);

    /**
     * 关闭登录注册弹窗
     */
    function closeModal() {
        setIsModalOpen(false);
    }

    /**
     * 打开登录注册弹窗
     */
    function loginHandle() {
        setIsModalOpen(true);
    }

    return (
        <div className="App">
            <Header className="header">
                <NavHeader loginHandle={loginHandle} />
            </Header>
            <Content className="content">
                <RouterConfig />
            </Content>
            <Footer className="footer">
                <PageFoot />
            </Footer>
            {/* 登录注册弹窗 */}
            <LoginForm isShow={isModalOpen} close={closeModal} />
        </div>
    );
}

export default App;
