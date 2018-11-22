const fs = require('fs');
// const pattern = /!\[[\s\S]*{1, 50}\]\([\s\S]*\)/ig;
const pattern = /!\[(.*?)\]\((.*?)\)/mg;
const result = [];
let matcher;

fs.readFile('./1.md', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    } else {
        let fileString = data.toString();
        while ((matcher = pattern.exec(fileString)) !== null) {
            result.push({
                alt: matcher[1],
                url: matcher[2]
            });
        }        
    }
});