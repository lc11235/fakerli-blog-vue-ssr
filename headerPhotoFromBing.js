const schedule = require('node-schedule');
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname + '/headerImage');

schedule.scheduleJob('30 * * * * *', () => {
    let url = 'http://cn.bing.com/HPImageArchive.aspx?idx=0&n=1';
    http.get(url, res => {
        if (res.statusCode === 200) {
            let html = '';
            res.setEncoding('utf-8');
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                let collection = html.match(/<Url>?.+?<\/Url>/ig);
                if (collection.length > 0) {
                    let imgUrl = 'http://www.bing.com' + collection[0].replace(/<\/?url>/g, '').replace('1366x768', '1920x1080');
                    http.get(imgUrl, res => {
                        if (res.statusCode === 200) {
                            let image = '';
                            res.setEncoding('binary');
                            res.on('data', data => {
                                image += data;
                            });
                            res.on('end', () => {
                                fs.exists(dir + '/' + '1.jpg', exists => {
                                    if (exists) {
                                        fs.unlink(dir + '/' + '1.jpg', err => {
                                            if (err) {
                                                console.log(1);
                                                return;
                                            }
                                            fs.writeFile(dir + '/' + '1.jpg', image, 'binary', err => {
                                                if (err) {
                                                    console.log(2);
                                                    return;
                                                }
                                            });
                                        })
                                    } else {
                                        fs.writeFile(dir + '/' + '1.jpg', image, 'binary', err => {
                                            if (err) {
                                                console.log(3);
                                                return;
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});