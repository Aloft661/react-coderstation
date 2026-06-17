import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import TypeSelect from "../components/TypeSelect";
import { Card, Pagination } from "antd";
const { Meta } = Card;

import { getVideoByPage } from "../api/video";

import styles from "../css/Video.module.css";

export default function Video() {
    const [videoInfo, setVideoInfo] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0
    });

    const { videoTypeId } = useSelector(state => state.type);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            let searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize
            };
            if (videoTypeId !== "all") {
                searchParams.typeId = videoTypeId;
                searchParams.current = 1;
            }
            const { data } = await getVideoByPage(searchParams);
            console.log(data);
            setVideoInfo(data.data);
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count
            });
        }
        fetchData();
    }, [videoTypeId, pageInfo.pageSize, pageInfo.current]);

    const videoData = [];
    if (videoInfo.length) {
        for (let i = 0; i < videoInfo.length; i++) {
            videoData.push(
                <Card
                    hoverable
                    style={{
                        width: 200,
                        marginBottom: 30
                    }}
                    cover={
                        <img
                            alt="example"
                            style={{
                                width: 160,
                                height: 200,
                                margin: "auto",
                                marginTop: 10
                            }}
                            src={videoInfo[i]?.videoPic}
                        />
                    }
                    onClick={() => navigate(`/video/${videoInfo[i]._id}`)}
                    key={videoInfo[i]._id}
                >
                    <Meta title={videoInfo[i]?.videoTitle} />
                    <div>
                        <span>浏览量：{videoInfo[i]?.scanNumber}</span>
                        <span>评论数：{videoInfo[i]?.commentNumber}</span>
                    </div>
                </Card>
            );
        }
        if (videoInfo.length % 5 !== 0) {
            let blank = 5 - videoInfo.length % 5;
            for (let i = 1; i <= blank; i++) {
                videoData.push(<div style={{ width: 220, marginBottom: 20 }} key={i * Math.random()}></div>);
            }
        }
    }

    function handlePageChange(current, pageSize) {
        setPageInfo({
            current,
            pageSize
        });
    }

    return (
        <div>
            <PageHeader title="视频列表">
                <TypeSelect />
            </PageHeader>
            <div className={styles.videoContainer}>
                {videoData}
            </div>
            <div className="paginationContainer">
                {
                    videoData.length > 0 ? (
                        <Pagination showQuickJumper defaultCurrent={1}  {...pageInfo} onChange={handlePageChange} />
                    ) : (
                        <div style={{
                            fontSize: "26px",
                            fontWeight: "200"
                        }}>该分类下暂无对应视频</div>
                    )
                }
            </div>
        </div>
    );
}
