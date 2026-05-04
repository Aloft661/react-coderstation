import styles from "../css/PageHeader.module.css";

/**
 * 每一页的页头
 */
export default function PageHeader(props) {
    return (
        <div className={styles.row}>
            <div className={styles.pageHeader}>
                {props.title}
            </div>
            {/* 分类选择 */}
            {props.children}
        </div>
    );
}
