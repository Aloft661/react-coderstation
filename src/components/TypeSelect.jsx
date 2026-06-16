import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTypeList, updateBookTypeId, updateIssueTypeId, updateVideoTypeId } from "../redux/typeSlice";

import { Tag } from "antd";

// 分类
export default function TypeSelect() {
    const { typeList } = useSelector(state => state.type);
    const dispath = useDispatch();
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
    const [tagContainer, setTagContainer] = useState([]);

    useEffect(() => {
        if (!typeList.length) {
            dispath(getTypeList());
        }
        if (typeList.length) {
            const arr = [];
            arr.push(
                <Tag
                    color="magenta"
                    value="all"
                    key="all"
                    style={{ cursor: "pointer" }}
                    onClick={() => changeType("all")}
                >全部</Tag>
            );
            for (let i = 0; i < typeList.length; i++) {
                arr.push(
                    <Tag
                        color={colorArr[i % colorArr.length]}
                        value={typeList[i]._id}
                        key={typeList[i]._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => changeType(typeList[i]._id)}
                    >{typeList[i].typeName}</Tag>
                );
            }
            setTagContainer(arr);
        }
    }, [typeList]);

    function changeType(typeId) {
        // 更新状态仓库对应的issueTypeId 或者 bookTypeId
        if (location.pathname === "/issues") {
            dispath(updateIssueTypeId(typeId));
        } else if (location.pathname === "/books") {
            dispath(updateBookTypeId(typeId));
        } else if (location.pathname === "/video") {
            dispath(updateVideoTypeId(typeId));
        }
    }

    return (
        <div>
            {tagContainer}
        </div>
    );
}
