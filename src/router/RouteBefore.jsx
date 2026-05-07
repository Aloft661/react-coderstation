import RouteConfig from "./index";
import RouteBeforeConfig from "./RouteBeforeConfig";

import { Alert } from "antd";

// 路由守卫
export default function RouteBefore() {
    const currentPath = RouteBeforeConfig.filter(item => item.path === location.pathname)[0];

    function closeHandle() {
        location.pathname = "/";
    }

    if (currentPath) {
        if (currentPath.needLogin && !localStorage.getItem("userToken")) {
            return <Alert type="warning" message="请先登录" closable onClose={closeHandle} showIcon style={{
                marginTop: 30,
                marginBottom: 30
            }} />
        }
    }
    return <RouteConfig />
}