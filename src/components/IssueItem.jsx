import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../utils/tools";
import { getTypeList } from "../redux/typeSlice";
import { Tag } from "antd";
import { getUserById } from "../api/user";

import styles from "../css/IssueItem.module.css";

// 每一条问答项目
export default function IssueItem(props) {
    const { typeList } = useSelector(state => state.type);
    const [userInfo, setUserInfo] = useState({});
    const dispatch = useDispatch();
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    const navigate = useNavigate();
    useEffect(() => {
        if (!typeList.length) {
            dispatch(getTypeList());
        }

        async function fetchData() {
            const { data } = await getUserById(props.issueInfo.userId);
            setUserInfo(data);
        }
        fetchData();
    }, []);

    const type = typeList.find(itme => itme._id === props.issueInfo.typeId);

    return (
        <div className={styles.container}>
            {/* 回答数 */}
            <div className={styles.issueNum}>
                <div>{props.issueInfo.commentNumber}</div>
                <div>回答</div>
            </div>
            {/* 浏览数 */}
            <div className={styles.issueNum}>
                <div>{props.issueInfo.scanNumber}</div>
                <div>浏览</div>
            </div>
            {/* 问题内容 */}
            <div className={styles.issueContainer}>
                <div className={styles.top} onClick={() => navigate(`/issue/${props.issueInfo._id}`)}>{props.issueInfo.issueTitle}</div>
                <div className={styles.bottom}>
                    <div className={styles.left}>
                        <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
                    </div>
                    <div className={styles.right}>
                        <Tag color="volcano">{userInfo.nickname}</Tag>
                        <span>{formatDate(props.issueInfo.issueDate, "year")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
