import IssueItem from "./IssueItem";

// 容器组件
// 该组件是根据搜索的类型返回不同类型的搜索项目组件 (IssueItem or BookItem)
// 没有自己的JSX视图，只是充当容器
export default function SearchResultItem(props) {
    return (
        <div>
            {
                props.info.issueTitle ? <IssueItem issueInfo={props.info} /> : null
            }
        </div>
    )
}
