import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import TypeSelect from "../components/TypeSelect";
import { Card, Pagination } from "antd";
const { Meta } = Card;

import { getBookByPage } from "../api/book";

import styles from '../css/Books.module.css';

export default function Books() {
    const [bookInfo, setBookInfo] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0
    });

    const { bookTypeId } = useSelector(state => state.type);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            let searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize
            }
            if (bookTypeId !== "all") {
                searchParams.typeId = bookTypeId;
                searchParams.current = 1;
            }
            const { data } = await getBookByPage(searchParams);
            console.log(data);
            setBookInfo(data.data);
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count
            });
        }
        fetchData();
    }, [bookTypeId, pageInfo.current, pageInfo.pageSize]);

    const bookData = [];
    if (bookInfo.length) {
        for (let i = 0; i < bookInfo.length; i++) {
            bookData.push(
                <Card
                    hoverable
                    style={{
                        width: 200,
                        marginBottom: 30
                    }}
                    cover={
                        <img alt="example" style={{
                            width: 160,
                            height: 200,
                            margin: "auto",
                            marginTop: 10
                        }} src={bookInfo[i]?.bookPic} />
                    }
                    key={bookInfo[i]._id}
                    onClick={() => navigate(`/books/${bookInfo[i]._id}`)}
                >
                    <Meta title={bookInfo[i]?.bookTitle} />
                    <div className={styles.numberContainer}>
                        <div>浏览数：{bookInfo[i]?.scanNumber}</div>
                        <div>评论数：{bookInfo[i]?.commentNumber}</div>
                    </div>
                </Card>
            );
        }
        if (bookInfo.length % 5 !== 0) {
            let blank = 5 - bookInfo.length % 5;
            for (let i = 1; i <= blank; i++) {
                bookData.push(<div style={{ width: 220, marginBottom: 20 }} key={i * Math.random()}></div>);
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
            <PageHeader title="最新资源" >
                <TypeSelect />
            </PageHeader>
            <div className={styles.bookContainer}>
                {bookData}
            </div>
            <div className="paginationContainer">
                {
                    bookData.length > 0 ? (
                        <Pagination showQuickJumper defaultCurrent={1}  {...pageInfo} onChange={handlePageChange} />
                    ) : (
                        <div style={{
                            fontSize: "26px",
                            fontWeight: "200"
                        }}>该分类下暂无书籍</div>
                    )
                }
            </div>
        </div>
    );
}
