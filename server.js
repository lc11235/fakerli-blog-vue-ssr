process.env.VUE_ENV = 'server';
const isProd = process.env.NODE_ENV === 'production';

const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const express = require('express');
const compression = require('compression');
// const HTMLStream = require('vue-ssr-html-stream');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { createBundleRenderer } = require('vue-server-renderer');
const config = require('./src/api/config-server');
const resolve = file => path.resolve(__dirname, file);

const serverInfo = `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

// 引入mongoose相关模型
require('./server/models/admin');
require('./server/models/article');
require('./server/models/tag');

// 引入api路由
const routes = require('./server/routes/index');

// 引入题图的定时更新组件
const headerPhoto = require('./headerPhotoFromBing');
headerPhoto.getPhotoFromBing();

function createRenderer(bundle, template) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, {
        template,
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    });
}

const app = express();

// 由html-webpack-plugin生成
let frontend;
let backend;
// 创建来自webpack生成的服务端包
let renderer;
if (isProd) {
    // 生产模式：从fs创建服务器HTML渲染器和索引
    const bundle = require('./dist/vue-ssr-bundle.json');
    frontend = fs.readFileSync(resolve('./dist/server.html'), 'utf-8');
    renderer = createRenderer(bundle, frontend);
} else {
    // 开发模式：设置带有热重新加载的dev服务器，并在文件更改时更新渲染器和索引 HTML
    require('./build/setup-dev-server')(app, (bundle, _template) => {
        frontend = _template.frontend;
        backend = _template.backend;
        renderer = createRenderer(bundle, frontend);
    });
}

// 设置静态文件缓存时间
const serve = (pathStatic, cache) => express.static(resolve(pathStatic), { maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0 });

// 使用ejs模板引擎
app.set('views', path.join(__dirname, 'dist'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');

app.use(favicon('./favicon.ico'));
app.use(compression({ threshold: 0 }));

// 日志
app.use(logger('":method :url" :status :res[content-length] ":referrer" ":user-agent"'));
// body解析中间件
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
// cookie解析中间件
app.use(cookieParser());
// 设置express静态目录
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/server', serve('./dist/server', true));
app.use('/static', serve('./dist/static', true));
app.use('/manifest.json', serve('./manifest.json'));
app.use('/service-worker.js', serve('./dist/service-worker.js'));

// api路由
app.use('/api', routes);

// 前台路由， SSR渲染
app.get(['/', '/tag/:tag', '/search/:qs', '/article/:title', '/about', '/tags', '/archives'], (req, res) => {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.');
    }

    const s = Date.now();
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Server', serverInfo);

    const errorHandler = err => {
        if (err && err.code === 404) {
            res.status(404).end('404 | Page Not Found');
        } else {
            // Render Error Page Or Redirect
            res.status(500).end('Internal Error 500');
            console.error(`error during render: ${req.url}`);
            console.error(err);
        }
    };

    const context = {
        title: '学习是为了探索这个世界的本质',
        description: '学习是为了探索这个世界的本质',
        url: req.url,
        cookies: req.cookies
    };

    renderer.renderToString(context, (err, html) => {
        if (err) {
            return errorHandler(err);
        }
        res.end(html);
        console.log(`whole request: ${Date.now() - s}ms`);
    });

    // 流式渲染
    // const htmlStream = new HTMLStream({ template: frontend, context });
    // htmlStream.on('beforeStart', () => {
    //     const meta = context.meta.inject();
    //     context.head = (context.head || '') + meta.title.text();
    // });
    // renderer.renderToStream(context)
    //     .on('error', errorHandler)
    //     .pipe(htmlStream)
    //     .on('end', () => console.log(`whole request: ${Date.now() - s}ms`))
    //     .pipe(res);
});

// 后台渲染
app.get(['/backend', '/backend/*'], (req, res) => {
    if (req.originalUrl !== '/backend' && req.originalUrl !== '/backend/' && req.originalUrl !== '/backend/login' && req.originalUrl !== '/backend/register' && !req.cookies.b_user) {
        return res.redirect('/backend/login');
    }
    if (isProd) {
        res.render('admin.html', { title: '登录' });
    } else {
        res.send(backend);
    }
});

// 404页面
app.get('*', (req, res) => {
    res.send('HTTP STATUS: 404');
});

app.use(function (req, res, next) {
    let err = new Error(req.originalUrl + ' Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.send(err.message);
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

const port = process.env.PORT || config.port || 8090;
app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
});

