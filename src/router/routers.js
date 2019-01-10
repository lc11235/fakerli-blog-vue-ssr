import Main from '@/components/main';
import parentView from '@/components/parent-view';

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/backend/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/views/login/login.vue')
    },
    {
        path: '/backend/register',
        name: 'register',
        meta: {
            title: 'Register - 注册',
            hideInMenu: true
        },
        component: () => import('@/views/register/register.vue')
    },
    {
        path: '/backend/',
        name: '_home',
        redirect: '/backend/home',
        component: Main,
        meta: {
            hideInMenu: false,
            notCache: true
        },
        children: [
            {
                path: '/backend/home',
                name: 'home',
                meta: {
                    hideInMenu: false,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/views/single-page/home')
            }
        ]
    },
    {
        path: '/backend/article',
        name: 'article',
        component: Main,
        meta: {
            title: '文章',
            icon: 'ios-book'
        },
        children: [
            {
                path: 'article_manage',
                name: 'article_manage',
                meta: {
                    title: '文章管理',
                    icon: 'ios-book'
                },
                component: () => import('@/views/article/article-manage.vue')
            },
            {
                path: 'article_insert',
                name: 'article_insert',
                meta: {
                    title: '文章发表',
                    icon: 'ios-book'
                }
            },
            {
                path: 'article_modify',
                name: 'article_modify',
                meta: {
                    title: '文章修正',
                    icon: 'ios-book'
                }
            }
        ]
    },
    {
        path: '/backend/tag',
        name: 'tag',
        component: Main,
        meta: {
            title: '标签',
            icon: 'md-pricetag'
        },
        children: [
            {
                path: 'tag_manage',
                name: 'tag_manage',
                meta: {
                    title: '标签管理',
                    icon: 'md-pricetag'
                },
                component: () => import('@/views/article/article-manage.vue')
            },
            {
                path: 'tag_insert',
                name: 'tag_insert',
                meta: {
                    title: '标签发表',
                    icon: 'md-pricetag'
                }
            },
            {
                path: 'tag_modify',
                name: 'tag_modify',
                meta: {
                    title: '标签修正',
                    icon: 'md-pricetag'
                }
            }
        ]
    },
    {
        path: '/backend/user',
        name: 'user',
        component: Main,
        meta: {
            title: '用户',
            icon: 'md-person'
        },
        children: [
            {
                path: 'user_manage',
                name: 'user_manage',
                meta: {
                    title: '用户管理',
                    icon: 'md-person'
                },
                component: () => import('@/views/article/article-manage.vue')
            },
            {
                path: 'user_insert',
                name: 'user_insert',
                meta: {
                    title: '用户新增',
                    icon: 'md-person-add'
                }
            },
            {
                path: 'user_access',
                name: 'user_access',
                meta: {
                    title: '用户权限',
                    icon: 'md-person'
                }
            }
        ]
    },
    {
        path: '/backend/join',
        name: 'join',
        component: Main,
        meta: {
            hideInBread: true
        },
        children: [
            {
                path: 'join_page',
                name: 'join_page',
                meta: {
                    icon: '_qq',
                    title: 'QQ群'
                },
                component: () => import('@/views/join-page.vue')
            }
        ]
    },
    {
        path: '/backend/message',
        name: 'message',
        component: Main,
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        children: [
            {
                path: 'message_page',
                name: 'message_page',
                meta: {
                    icon: 'md-notifications',
                    title: '消息中心'
                },
                component: () => import('@/views/single-page/message/index.vue')
            }
        ]
    },
    {
        path: '/backend/components',
        name: 'components',
        meta: {
            icon: 'logo-buffer',
            title: '组件'
        },
        component: Main,
        children: [
            {
                path: 'count_to_page',
                name: 'count_to_page',
                meta: {
                    icon: 'md-trending-up',
                    title: '数字渐变'
                },
                component: () => import('@/views/components/count-to/count-to.vue')
            },
            {
                path: 'drag_list_page',
                name: 'drag_list_page',
                meta: {
                    icon: 'ios-infinite',
                    title: '拖拽列表'
                },
                component: () => import('@/views/components/drag-list/drag-list.vue')
            },
            {
                path: 'drag_drawer_page',
                name: 'drag_drawer_page',
                meta: {
                    icon: 'md-list',
                    title: '可拖拽抽屉'
                },
                component: () => import('@/views/components/drag-drawer')
            },
            {
                path: 'org_tree_page',
                name: 'org_tree_page',
                meta: {
                    icon: 'ios-people',
                    title: '组织结构树'
                },
                component: () => import('@/views/components/org-tree')
            },
            {
                path: 'tree_table_page',
                name: 'tree_table_page',
                meta: {
                    icon: 'md-git-branch',
                    title: '树状表格'
                },
                component: () => import('@/views/components/tree-table/index.vue')
            },
            {
                path: 'cropper_page',
                name: 'cropper_page',
                meta: {
                    icon: 'md-crop',
                    title: '图片裁剪'
                },
                component: () => import('@/views/components/cropper/cropper.vue')
            },
            {
                path: 'tables_page',
                name: 'tables_page',
                meta: {
                    icon: 'md-grid',
                    title: '多功能表格'
                },
                component: () => import('@/views/components/tables/tables.vue')
            },
            {
                path: 'split_pane_page',
                name: 'split_pane_page',
                meta: {
                    icon: 'md-pause',
                    title: '分割窗口'
                },
                component: () => import('@/views/components/split-pane/split-pane.vue')
            },
            {
                path: 'markdown_page',
                name: 'markdown_page',
                meta: {
                    icon: 'logo-markdown',
                    title: 'Markdown编辑器'
                },
                component: () => import('@/views/components/markdown/markdown.vue')
            },
            {
                path: 'editor_page',
                name: 'editor_page',
                meta: {
                    icon: 'ios-create',
                    title: '富文本编辑器'
                },
                component: () => import('@/views/components/editor/editor.vue')
            },
            {
                path: 'icons_page',
                name: 'icons_page',
                meta: {
                    icon: '_bear',
                    title: '自定义图标'
                },
                component: () => import('@/views/components/icons/icons.vue')
            }
        ]
    },
    {
        path: '/backend/update',
        name: 'update',
        meta: {
            icon: 'md-cloud-upload',
            title: '数据上传'
        },
        component: Main,
        children: [
            {
                path: 'update_table_page',
                name: 'update_table_page',
                meta: {
                    icon: 'ios-document',
                    title: '上传CSV'
                },
                component: () => import('@/views/update/update-table.vue')
            },
            {
                path: 'update_paste_page',
                name: 'update_paste_page',
                meta: {
                    icon: 'md-clipboard',
                    title: '粘贴表格数据'
                },
                component: () => import('@/views/update/update-paste.vue')
            }
        ]
    },
    {
        path: '/backend/excel',
        name: 'excel',
        meta: {
            icon: 'ios-stats',
            title: 'EXCEL导入导出'
        },
        component: Main,
        children: [
            {
                path: 'upload-excel',
                name: 'upload-excel',
                meta: {
                    icon: 'md-add',
                    title: '导入EXCEL'
                },
                component: () => import('@/views/excel/upload-excel.vue')
            },
            {
                path: 'export-excel',
                name: 'export-excel',
                meta: {
                    icon: 'md-download',
                    title: '导出EXCEL'
                },
                component: () => import('@/views/excel/export-excel.vue')
            }
        ]
    },
    {
        path: '/backend/tools_methods',
        name: 'tools_methods',
        meta: {
            hideInBread: true
        },
        component: Main,
        children: [
            {
                path: 'tools_methods_page',
                name: 'tools_methods_page',
                meta: {
                    icon: 'ios-hammer',
                    title: '工具方法',
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/views/tools-methods/tools-methods.vue')
            }
        ]
    },
    {
        path: '/backend/i18n',
        name: 'i18n',
        meta: {
            hideInBread: true
        },
        component: Main,
        children: [
            {
                path: 'i18n_page',
                name: 'i18n_page',
                meta: {
                    icon: 'md-planet',
                    title: 'i18n - {{ i18n_page }}'
                },
                component: () => import('@/views/i18n/i18n-page.vue')
            }
        ]
    },
    {
        path: '/backend/error_store',
        name: 'error_store',
        meta: {
            hideInBread: true
        },
        component: Main,
        children: [
            {
                path: 'error_store_page',
                name: 'error_store_page',
                meta: {
                    icon: 'ios-bug',
                    title: '错误收集'
                },
                component: () => import('@/views/error-store/error-store.vue')
            }
        ]
    },
    {
        path: '/backend/error_logger',
        name: 'error_logger',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        component: Main,
        children: [
            {
                path: 'error_logger_page',
                name: 'error_logger_page',
                meta: {
                    icon: 'ios-bug',
                    title: '错误收集'
                },
                component: () => import('@/views/single-page/error-logger.vue')
            }
        ]
    },
    {
        path: '/backend/directive',
        name: 'directive',
        meta: {
            hideInBread: true
        },
        component: Main,
        children: [
            {
                path: 'directive_page',
                name: 'directive_page',
                meta: {
                    icon: 'ios-navigate',
                    title: '指令'
                },
                component: () => import('@/views/directive/directive.vue')
            }
        ]
    },
    {
        path: '/backend/multilevel',
        name: 'multilevel',
        meta: {
            icon: 'md-menu',
            title: '多级菜单'
        },
        component: Main,
        children: [
            {
                path: 'level_2_1',
                name: 'level_2_1',
                meta: {
                    icon: 'md-funnel',
                    title: '二级-1'
                },
                component: () => import('@/views/multilevel/level-2-1.vue')
            },
            {
                path: 'level_2_2',
                name: 'level_2_2',
                meta: {
                    access: ['super_admin'],
                    icon: 'md-funnel',
                    showAlways: true,
                    title: '二级-2'
                },
                component: parentView,
                children: [
                    {
                        path: 'level_2_2_1',
                        name: 'level_2_2_1',
                        meta: {
                            icon: 'md-funnel',
                            title: '三级'
                        },
                        component: () => import('@/views/multilevel/level-2-2/level-2-2-1.vue')
                    },
                    {
                        path: 'level_2_2_2',
                        name: 'level_2_2_2',
                        meta: {
                            icon: 'md-funnel',
                            title: '三级'
                        },
                        component: () => import('@/views/multilevel/level-2-2/level-2-2-2.vue')
                    }
                ]
            },
            {
                path: 'level_2_3',
                name: 'level_2_3',
                meta: {
                    icon: 'md-funnel',
                    title: '二级-3'
                },
                component: () => import('@/views/multilevel/level-2-3.vue')
            }
        ]
    },
    {
        path: '/backend/argu',
        name: 'argu',
        meta: {
            hideInMenu: true
        },
        component: Main,
        children: [
            {
                path: 'params/:id',
                name: 'params',
                meta: {
                    icon: 'md-flower',
                    title: route => `{{ params }}-${route.params.id}`,
                    notCache: true,
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/views/argu-page/params.vue')
            },
            {
                path: 'query',
                name: 'query',
                meta: {
                    icon: 'md-flower',
                    title: route => `{{ query }}-${route.query.id}`,
                    notCache: true
                },
                component: () => import('@/views/argu-page/query.vue')
            }
        ]
    },
    {
        path: '/backend/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/error-page/401.vue')
    },
    {
        path: '/backend/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/error-page/404.vue')
    }
];