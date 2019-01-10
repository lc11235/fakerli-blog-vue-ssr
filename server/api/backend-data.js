exports.getDragList = (req, res) => {
    res.json({
        code: 200,
        message: '取得拖拽列表成功',
        data: {
            list1: [
                {
                    'name': '市力且们话风料七众快局线。',
                    'id': 30
                },
                {
                    'name': '制解被化日参线品主相。',
                    'id': 10
                },
                {
                    'name': '活养列声称成界好大此米。',
                    'id': 20
                },
                {
                    'name': '水料规不斯识活动反又青。',
                    'id': 40
                },
                {
                    'name': '展改此部件到办变作七。',
                    'id': 50
                }
            ],
            list2: [{
                'name': '制解被化日参线品主相。',
                'id': 10
            }]
        }
    });
};