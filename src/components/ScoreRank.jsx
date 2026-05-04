import { getUserByPointsRank } from "../api/user";
import { useEffect, useState } from "react";
import ScoreItem from "./ScoreItem";
import { Card } from "antd";

// 积分排名
export default function ScoreRank() {
    const [userRankInfo, setUserRankInfo] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            const { data } = await getUserByPointsRank();
            setUserRankInfo(data);
        }
        fetchUser();
    }, []);

    const userPointsRankArr = [];
    if (userRankInfo.length) {
        for (let i = 0; i < userRankInfo.length; i++) {
            userPointsRankArr.push(
                <ScoreItem
                    rankInfo={userRankInfo[i]}
                    rank={i + 1}
                    key={userRankInfo[i]._id}
                />
            );
        }
    }

    return (
        <Card title="积分排行榜">
            {userPointsRankArr}
        </Card>
    );
}
