import { useNavigate } from "react-router-dom";

import { Image } from "antd";

import styles from '../css/BookItem.module.css';

export default function BookItem(props) {
    const reg = /<[^<>]+>/g;
    const bookIntro = props.bookInfo.bookIntro.replace(reg, "");
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            {/* 评论 */}
            <div className={styles.bookNum}>
                <div>{props.bookInfo.commentNumber}</div>
                <div>评论</div>
            </div>
            {/* 浏览数 */}
            <div className={styles.bookNum}>
                <div>{props.bookInfo.scanNumber}</div>
                <div>浏览</div>
            </div>
            {/* 书籍内容 */}
            <div className={styles.bookContainer}>
                <div className={styles.left}>
                    <Image className={styles.bookPic} src={props.bookInfo.bookPic} />
                </div>
                <div className={styles.right}>
                    <div className={styles.top} onClick={() => navigate(`/books/${props.bookInfo._id}`)}>{props.bookInfo.bookTitle}</div>
                    <div className={styles.bottom}>{bookIntro.slice(0, 55) + "..."}</div>
                </div>
            </div>
        </div>
    );
}
