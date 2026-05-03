import { NavLink } from "react-router-dom";
import { Input, Select } from "antd";
import LoginAvatar from "./LoginAvatar";
const { Option } = Select;
const { Search } = Input;

export default function NavHeader(props) {
    return (
        <div className="headerContainer">
            {/* logo */}
            <div className="logoContainer">
                <div className="logo"></div>
            </div>
            {/* 导航栏 */}
            <nav className="navContainer">
                <NavLink to="/" className="navigation">问答</NavLink>
                <NavLink to="/books" className="navigation">书籍</NavLink>
                <NavLink to="/interviews" className="navigation">面试题</NavLink>
                <a
                    href="http://www.bilibili.com"
                    className="navigation"
                    target="_blank"
                    rel="noreferrer"
                >
                    视频教程
                </a>
            </nav>
            {/* 搜索栏 */}
            <div className="searchContainer">
                <Input.Group compact>
                    <Select defaultValue="issue" size="large" style={{width: "20%"}}>
                        <Option value="issue">问答</Option>
                        <Option value="book">书籍</Option>
                    </Select>
                    <Search
                        style={{
                            width: "80%",
                        }}
                        placeholder="请输入要搜索的内容..."
                        allowClear
                        enterButton="搜索"
                        size="large"
                    />
                </Input.Group>
            </div>
            {/* 登录注册 */}
            <div className="loginBtnContainer">
                <LoginAvatar loginHandle={props.loginHandle} />
            </div>
        </div>
    );
}


