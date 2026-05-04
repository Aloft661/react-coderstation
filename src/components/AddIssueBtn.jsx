import { Button, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// 添加问答组件
export default function AddIssueBtn() {
    const { isLogin } = useSelector(state => state.user);
    const navigate = useNavigate();
    // 点击事件处理函数
    function clickHandle() {
        if (isLogin) {
            navigate("/addIssue");
        } else {
            message.warning("请先登录");
        }
    }
    return (
        <div>
            <Button 
                type="primary" 
                size="large" 
                style={{ width: "100%", marginBottom: "30px" }}
                onClick={clickHandle}
            >我要发问</Button>    
        </div>
    );
}
