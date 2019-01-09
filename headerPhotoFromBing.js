const schedule = require('node-schedule');
const http = require('http');
const fs = require('fs');
const path = require('path');
const resolve = file => path.resolve(__dirname, file);

const dir = resolve('./headerImage');
const dir1 = resolve('./dist/static/img');

exports.getPhotoFromBing = () => {
    schedule.scheduleJob('* * 8 * * *', () => {
        let url = 'http://cn.bing.com/HPImageArchive.aspx?idx=0&n=1';
        http.get(url, res => {
            if (res.statusCode === 200) {
                let html = '';
                res.setEncoding('utf-8');
                res.on('data', chunk => {
                    html += chunk;
                });
                res.on('end', () => {
                    getJpg(html);
                });
            }
        });
    });
};

function getJpg(html) {
    let collection = html.match(/<Url>?.+?<\/Url>/ig);
    // let collectionCopy = html.match(/<copyright>?.+?<\/copyright>/ig);
    if (collection.length > 0) {
        let imgUrl = 'http://www.bing.com' + collection[0].replace(/<\/?url>/g, '').replace('1366x768', '1920x1080');
        // let copyright = collectionCopy[0].replace(/<\/?copyright>/g, '');
        http.get(imgUrl, result => {
            if (result.statusCode === 200) {
                let image = '';
                result.setEncoding('binary');
                result.on('data', data => {
                    image += data;
                });
                result.on('end', () => {
                    writeFile(image, dir);
                    if (process.env.NODE_ENV === 'production') {
                        writeFile(image, dir1);
                    }
                });
            }
        });
    }
}

function writeFile(image, pathStatic) {
    fs.exists(pathStatic + '/header.jpg', exists => {
        if (exists) {
            fs.unlink(pathStatic + '/header.jpg', err => {
                if (err) {
                    console.log(err.toString());
                    return;
                }
                fs.writeFile(pathStatic + '/header.jpg', image, 'binary', err => {
                    if (err) {
                        console.log(err.toString());
                        return;
                    }
                });
            });
        } else {
            fs.writeFile(pathStatic + '/header.jpg', image, 'binary', err => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
    });
}