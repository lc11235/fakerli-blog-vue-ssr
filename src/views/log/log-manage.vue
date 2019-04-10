<template>
  <div>
    <Card>
        <tables ref="tables" editable searchable search-place="top" :loading="loading" v-model="tableData" :columns="columns"/>
        <div style="margin: 10px;overflow: hidden;">
            <div style="float: right;">
                <Page :total="total" :current="current" @on-change="changePage"></Page>
            </div>
        </div>
    </Card>
  </div>
</template>

<script>
import Tables from '~components/tables';
import { timeAgo } from '@/filters';
import { mapGetters, mapActions } from 'vuex';
const fetchInitialData = async (store, config = { page: 1, limit: 10 }) => {
    await store.dispatch('backend/log/handleGetLogReqResList', config);
};
export default {
    name: 'log_manage',
    components: {
        Tables
    },
    data () {
        return {
            loading: false,
            total: 0,
            current: 1,
            columns: [
                    {
                        title: '请求时间',
                        key: 'reqTime',
                        align: 'center'
                    },
                    {
                        title: 'HTTP版本',
                        key: 'reqHttpVersion',
                        align: 'center',
                    },
                    {
                        title: '请求方法',
                        key: 'reqMethod',
                        align: 'center',
                    },
                    {
                        title: '请求地址',
                        key: 'reqUrl',
                        align: 'center',
                    },
                    {
                        title: '请求来源',
                        key: 'reqReferrer',
                        align: 'center',
                    },
                    {
                        title: '请求IP',
                        key: 'reqRemoteAddr',
                        align: 'center',
                    },
                    {
                        title: '用户代理',
                        key: 'reqUserAgent',
                        align: 'center',
                    },
                    {
                        title: '回应状态',
                        key: 'resStatus',
                        align: 'center',
                    },
                    {
                        title: '响应时间',
                        key: 'resTime',
                        align: 'center',
                    },
                    {
                        title: '内容长度',
                        key: 'resContentLength',
                        align: 'center',
                    },
                    {
                        title: '最后更新日期',
                        key: 'update_date',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', timeAgo(this.tableData[params.index].update_date))
                            ]);
                        }
                    }
                ],
            tableData: [],
        }
    },
    methods: {
        ...mapActions({
            handleGetLogReqResList: 'backend/log/handleGetLogReqResList'
        }),
        exportExcel () {
            this.$refs.tables.exportCsv({
                filename: `table-${(new Date()).valueOf()}.csv`
            });
        },
        changePage(page) {
            this.loading = true;
            this.current = page;
            fetchInitialData(this.$store, { page: page});
        }
    },
    computed: {
        ...mapGetters({
            logReqResList: 'backend/log/getLogReqResList'
        })
    },
    mounted () {
        if (this.logReqResList.data.length <= 0) {
            fetchInitialData(this.$store);
        } else {
            this.tableData = this.logReqResList.data;
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.path !== '/') {
                fetchInitialData(vm.$store);
            }
        });
    },
    watch: {
        'logReqResList.data'(val) {
            this.tableData = val;
            this.loading = false;
        },
        'logReqResList.total'(val) {
            this.total = val;
        }
    } 
}
</script>

<style>

</style>
