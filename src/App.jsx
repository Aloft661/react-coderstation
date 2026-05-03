import { useState } from "react";
import { Layout } from "antd";
import NavHeader from "./components/NavHeader";
import PageFoot from "./components/PageFoot";
import "./css/App.css";

import RouterConfig from "./router";
import LoginForm from "./components/LoginForm";

const { Header, Footer, Content } = Layout;

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <LoginForm isShow={isModalOpen} close={closeModal}/>
        </div>
    );
}

export default App;
