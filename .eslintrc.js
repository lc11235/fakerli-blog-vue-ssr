module.exports = {
    extends: [
        'eslint-config-alloy',
    ],
    globals: {
        "$": true,
        "_": true,
        "window": true,
        "document": true,
        "FormData": true,
        "navigator": true,
        "process": true,
        "__dirname": true
    },
    root: true,
    env: {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    parserOptions: {
        "parser": "babel-eslint",
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "generators": true,
            // 对象的扩展运算符
            "experimentalObjectRestSpread": true,
            // rest参数
            "restParams": true,
            // 对象字面量方法名简写
            "objectLiteralShorthandMethods": true,
            // 对象字面量属性名简写
            "objectLiteralShorthandProperties": true,
            // 扩展运算符
            "spread": true,
            // 模板字符串
            "templateStrings": true,
            "objectLiteralComputedProperties": true,
            "destructuring": true
        }
    },
    plugins: [
        "import",
        "babel",
        "html"
    ],
    settings: {
        "import/ignore": [
            "node_modules",
            "\\.(json|css|less|scss|jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$",
            "\\.eslintrc"
        ],
        "import/extensions": [
            ".js",
            ".vue"
        ],
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".json"
                ]
            }
        }
    }
};