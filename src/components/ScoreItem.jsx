import { useState } from "react";
import styles from "../css/ScoreItem.module.css";
import { Avatar } from "antd";
import classnames from "classnames";

export default function ScoreItem(props) {
    const [classNameCollection] = useState({
        "iconfont": true,
        "icon-jiangbei": true,
    });

    let rankNum = null;
    switch (props.rank) {
        case 1: {
            rankNum = (
                <div
                    style={{ color: "#ffda23", fontSize: "22px" }}
                    className={classnames(classNameCollection)}>
                </div>
            );
            break;
        }
        case 2: {
            rankNum = (
                <div
                    style={{ color: "#c5c5c5", fontSize: "22px" }}
                    className={classnames(classNameCollection)}>
                </div>
            );
            break;
        }
        case 3: {
            rankNum = (
                <div 
                    style={{ color: "#cd9a62", fontSize: "22px" }}
                    className={classnames(classNameCollection)}>
                </div>
            );
            break;
        }
        default: {
            rankNum = (
                <div className={styles.rank}>{props.rank}</div>
            );
            break;
        }
    }

    return (
        <div className={styles.container}>
            {/* 名次，头像和昵称 */}
            <div className={styles.left}>
                {rankNum}
                <div className={styles.avatar}>
                    <Avatar src={props.rankInfo.avatar} size="small" />
                </div>
                <div className={styles.nickname}>{props.rankInfo.nickname}</div>

            </div>
            <div className={styles.right}>
                {props.rankInfo.points}
            </div>
        </div>
    );
}
