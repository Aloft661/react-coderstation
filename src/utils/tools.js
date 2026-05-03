export function formatDate(timestamp, part) {
    if (!timestamp) {
        return;
    }

    let date = new Date(parseInt(timestamp));

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let weekArr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
    ];
    let week = weekArr[date.getDay()];

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 1 && day <= 9) {
        day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    if (second >= 0 && second <= 9) {
        second = "0" + second;
    }
    
    var str = "";

    switch (part) {
        case "year": {
            str = `${year}-${month}-${day}`;
            break;
        }
        case "time": {
            str = `${hour}:${minute}:${second}`;
            break;
        }
        case "year-time": {
            str = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            break;
        }
        case "time-week": {
            str = `${hour}:${minute}:${second} ${week}`;
            break;
        }
        default: {
            str = `${year}-${month}-${day} ${hour}:${minute}:${second} ${week}`;
            break;
        }
    }
    return str;
}