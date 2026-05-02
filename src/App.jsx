import { Layout } from "antd";
import NavHeader from "./components/NavHeader";
import PageFoot from "./components/PageFoot";
import "./css/App.css";
import RouterConfig from "./router";

const { Header, Footer, Content } = Layout;

function App() {
    return (
        <div className="App">
            <Header className="header">
                <NavHeader/>
            </Header>
            <Content className="content">
                <RouterConfig />
            </Content>
            <Footer className="footer">
                <PageFoot />
            </Footer>
        </div>
    );
}

export default App;
