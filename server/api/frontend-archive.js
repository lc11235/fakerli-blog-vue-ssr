const mongoose = require('../mongoose');
const Article = mongoose.model('Article');

/**
 * 取得归档列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getListTitle = (req, res) => {
    let sort = '-update_date';
    let data = {
        is_delete: 0
    };

    let fields = 'title update_date';


    Article.find(data, fields).sort(sort).exec().then(result => {
        let items = [];
        let item = {};
        let titles = [];
        let timeMonth = '';

        let month = [];
        for (let temp of result) {
            if (temp.update_date.substring(0, 7) !== timeMonth || timeMonth === '') {
                timeMonth = temp.update_date.substring(0, 7);
                month.push(timeMonth);
            }
        }

        for (let m of month) {
            item = {};
            titles = [];
            for (let temp of result) {
                if (temp.update_date.substring(0, 7) === m) {
                    titles.push(temp);
                    item = {
                        titles: titles,
                        month: m
                    };
                }
            }
            if (item.month) {
                items.push(item);
            }

        }
        let json = {
            code: 200,
            data: {
                list: items
            }
        };
        res.json(json);
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};
