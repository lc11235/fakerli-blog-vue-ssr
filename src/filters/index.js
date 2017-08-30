function pluralize(time, label) {
    return time + label;
}

export function timeAgo(time) {
    let tmpTime = time;
    const preg = /^[\d]+$/;
    const timestamp = preg.test(tmpTime);
    if (!timestamp) {
        const tmp = Date.parse(tmpTime);
        tmpTime = tmp / 1000;
    }
    const between = Date.now() / 1000 - Number(tmpTime);
    if (between < 60) {
        return '刚刚';
    } else if (between < 3600) {
        return pluralize(parseInt(between / 60, 10), ' 分钟前');
    } else if (between < 86400) {
        return pluralize(parseInt(between / 3600, 10), ' 小时前');
    } else {
        return pluralize(parseInt(between / 86400, 10), ' 天前');
    }
}

export function timeYmd(timestamp) {
    let tempTimestamp = timestamp;
    const preg = /^[\d]+$/;
    const isTimestamp = preg.test(tempTimestamp);
    if (!isTimestamp) {
        let time = Date.parse(tempTimestamp);
        time /= 1000;
        tempTimestamp = time;
    }
    const tmp = new Date(tempTimestamp * 1000);
    const year = tmp.getFullYear();
    const month = tmp.getMonth() + 1;
    const date = tmp.getDate();
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
}