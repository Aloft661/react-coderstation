import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PageHeader from "../components/PageHeader";
import IssueItem from "../components/IssueItem";
import AddIssueBtn from "../components/AddIssueBtn";
import Recommend from "../components/Recommend";
import ScoreRank from "../components/ScoreRank";
import TypeSelect from "../components/TypeSelect";
import { Pagination } from "antd";

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
    const { issueTypeId } = useSelector(state => state.type);

    // 处理翻页的回调函数
    function handlePageChange(current, pageSize) {
        setPageInfo({
            current,
            pageSize,
        });
    }

    useEffect(() => {
        async function fetchData() {
            let searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                issueStatus: true
            };
            if (issueTypeId !== "all") {
                searchParams.typeId = issueTypeId;
                searchParams.current = 1;
            }
            const { data } = await getIssueByPage(searchParams);
            setIssueInfo(data.data);
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count,
            });
        }
        fetchData();
    }, [pageInfo.current, pageInfo.pageSize, issueTypeId]);

    let issueList = [];
    for (let i = 0; i < issueInfo.length; i++) {
        issueList.push(<IssueItem key={issueInfo[i]._id} issueInfo={issueInfo[i]} />);
    }

    return (
        <div className={styles.container}>
            <PageHeader title="问答列表">
                <TypeSelect />
            </PageHeader>
            <div className={styles.issueContainer}>
                {/* 左边 */}
                <div className={styles.leftSide}>
                    {issueList}
                    {
                        issueInfo.length > 0 ? (// 三目运算
                            <div className="paginationContainer">
                                <Pagination
                                    showQuickJumper
                                    defaultCurrent={1}
                                    total={pageInfo.total}
                                    {...pageInfo}
                                    onChange={handlePageChange}
                                    pageSizeOptions={["5", "10", "15", "20"]}
                                    showSizeChanger
                                />
                            </div>
                        ) : (
                            <div className={styles.noIssue}>有问题，就来 Corder Station</div>
                        )
                    }


                </div>
                {/* 右边 */}
                <div className={styles.rightSide}>
                    <AddIssueBtn />
                    <div style={{ marginBottom: "30px" }}>
                        <Recommend />
                    </div>
                    <ScoreRank />
                </div>
            </div>
        </div>
    );
}
