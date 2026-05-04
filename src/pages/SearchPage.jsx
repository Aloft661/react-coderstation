import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import AddIssueBtn from "../components/AddIssueBtn";
import Recommend from "../components/Recommend";
import ScoreRank from "../components/ScoreRank";
import SearchResultItem from "../components/SearchResultItem";

import { getIssueByPage } from "../api/issue";

import styles from "../css/SearchPage.module.css";

// 搜索页
export default function SearchPage() {
    const location = useLocation();
    const [searchResult, setSearchResult] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0
    });

    useEffect(() => {
        async function fetchData(state) {
            const { value, searchOption } = state;
            let searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                issueStatus: true
            }
            switch (searchOption) {
                case "issue": {
                    searchParams.issueTitle = value;
                    const { data } = await getIssueByPage(searchParams);
                    setSearchResult(data.data);
                    setPageInfo({
                        current: data.currentPage,
                        pageSize: data.eachPage,
                        total: data.count
                    })
                    break;
                }
                case "book": {
                    break;
                }
            }
        }
        if (location.state) {
            fetchData(location.state);
        }
    }, [location.state]);

    return (
        <div className="container">
            <PageHeader title="搜索结果" />
            <div className={styles.searchPageContainer}>
                <div className={styles.leftSide}>
                    {
                        searchResult.map(item => {
                            return <SearchResultItem info={item} key={item._id} />
                        })
                    }
                </div>
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
