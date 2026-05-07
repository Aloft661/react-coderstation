import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getInterviewTitleAsync } from "../redux/interviewSlice";
import { getTypeList } from "../redux/typeSlice";
import { getInterviewById } from "../api/interview";

import PageHeader from "../components/PageHeader";
import { Tree, BackTop } from "antd";

import styles from "../css/Interview.module.css";

export default function Interviews() {
    const dispatch = useDispatch();
    const [treeData, setTreeData] = useState([]);
    // 存储 id 对应的面试题内容
    const [interviewInfo, setInterviewInfo] = useState(null);
    const { interviewTitleList } = useSelector(state => state.interview);
    const { typeList } = useSelector(state => state.type);

    useEffect(() => {
        if (!interviewTitleList.length) {
            dispatch(getInterviewTitleAsync());
        }
        if (!typeList.length) {
            dispatch(getTypeList());
        }
        if (typeList.length && interviewTitleList.length) {
            const arr = [];
            for (let i = 0; i < typeList.length; i++) {
                arr.push({
                    title: <h3 style={{ fontWeight: 200 }}>{typeList[i]?.typeName}</h3>,
                    key: i,
                });
            }
            for (let j = 0; j < interviewTitleList.length; j++) {
                const childArr = [];
                for (let k = 0; k < interviewTitleList[j].length; k++) {
                    childArr.push({
                        title: (
                            <h4 style={{ fontWeight: 200 }} onClick={() => clickHandle(interviewTitleList[j][k]._id)}>
                                {interviewTitleList[j][k].interviewTitle}
                            </h4>
                        ),
                        key: `${j}-${k}`
                    });
                }
                arr[j].children = childArr;
            }
            setTreeData(arr);
        }
    }, [typeList, interviewTitleList]);

    async function clickHandle(id) {
        const { data } = await getInterviewById(id);
        setInterviewInfo(data);
    }

    let interviewRightSide = null;
    if (interviewInfo) {
        interviewRightSide = (
            <div className={styles.content}>
                <h1 className={styles.interviewRightTitle}>
                    {interviewInfo?.interviewTitle}
                </h1>
                <div className={styles.contentContainer}>
                    <div dangerouslySetInnerHTML={{ __html: interviewInfo?.interviewContent }}></div>
                </div>
            </div>
        );
    } else {
        interviewRightSide = (
            <div
                style={{
                    textAlign: "center",
                    fontSize: "40px",
                    fontWeight: 100,
                    marginTop: "150px"
                }}
            >
                请在左侧选择面试题
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <PageHeader title="面试题大全" />
            <div className={styles.interviewContainer}>
                <div className={styles.leftSide}>
                    <Tree treeData={treeData} />
                </div>
                <div className={styles.rightSide}>
                    {interviewRightSide}
                </div>
            </div>
            <BackTop />
        </div>
    );
}
