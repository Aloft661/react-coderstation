import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import IssueItem from "../components/IssueItem";
import { getIssueByPage } from "../api/issue";

import styles from "../css/Issue.module.css";

export default function Issues() {
    // 用于存储状态列表
    const [issueInfo, setIssueInfo] = useState([]);
    // 用于存储分页信息
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    useEffect(() => {
        async function fetchData() {
            const { data } = await getIssueByPage({
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                issueStatus: true
            });
            console.log(data);
            setIssueInfo(data.data);
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count,
            });
        }
        fetchData();
    }, [pageInfo.current, pageInfo.pageSize]);

    let issueList = [];
    for (let i = 0; i < issueInfo.length; i++) {
        issueList.push(<IssueItem key={issueInfo[i]._id} issueInfo={issueInfo[i]} />);
    }

    return (
        <div className={styles.container}>
            <PageHeader title="问答列表" />
            <div className={styles.issueContainer}>
                {/* 左边 */}
                <div className={styles.leftSide}>
                    {issueList}
                </div>
                {/* 右边 */}
                <div className={styles.rightSide}>
                    
                </div>
            </div>
        </div>
    );
}
