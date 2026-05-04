import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getIssueById } from "../api/issue";
import { getUserById } from "../api/user";
import { formatDate } from "../utils/tools";

import PageHeader from "../components/PageHeader";
import Recommend from "../components/Recommend";
import ScoreRank from "../components/ScoreRank";
import Discuss from "../components/Discuss";
import { Avatar } from "antd";

import styles from "../css/IssueDetail.module.css";

// 问答详情页
export default function IssueDetail() {
    const { id } = useParams();
    const [issueInfo, setIssueInfo] = useState(null);
    const [issueUser, setIssueUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const { data } = await getIssueById(id);
            setIssueInfo(data);
            const res = await getUserById(data?.userId);
            setIssueUser(res.data);
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <PageHeader title="问题详情" />
            <div className={styles.detailContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.question}>
                        {/* 标题 */}
                        <h1>{issueInfo?.issueTitle}</h1>
                        {/* 发布者信息 */}
                        <div className={styles.questioner}>
                            <Avatar src={issueUser?.avatar} size="small" />
                            <span className={styles.user}>{issueUser?.nickname}</span>
                            <span>发布于：{formatDate(issueInfo?.issueDate, "year-week")}</span>
                        </div>
                        {/* 问题详情 */}
                        <div className={styles.content}>
                            <div dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}></div> 
                        </div>
                    </div>
                    {/* 评论组件 */}
                    <Discuss 
                        commentType={1}
                        targetId={issueInfo?._id}
                        issueInfo={issueInfo}
                    />
                </div>
                <div className={styles.rightSide}>
                    <div style={{ marginBottom: 30 }}>
                        <Recommend />
                    </div>
                    <div style={{ marginBottom: 30 }}>
                        <ScoreRank />
                    </div>
                </div>
            </div>
        </div>
    );
}
