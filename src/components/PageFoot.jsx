import React from "react";

export default function PageFoot() {
    return (
        <div>
            <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="http://www.bilibili.com"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    专业学习平台
                </a>
                <a
                    href="https://github.com/Aloft661/react-coderstation"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    github
                </a>
                <a
                    href="https://18.react.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    React 18 文档
                </a>
                <a
                    href="https://ant.design/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    ant design 文档
                </a>
            </p>
            <p>© 2026 - Coder Station</p>
            <p>Powered by Create React App</p>
        </div>
    );
}
