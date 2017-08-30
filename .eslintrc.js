module.exports = {
    extends: [
        'eslint-config-alloy/vue',
    ],
    globals: {
        $: true,
        _: true,
        window: true,
        document: true,
        FormData: true,
        navigator: true,
        process: true,
        __dirname: true
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