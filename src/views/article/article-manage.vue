<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '~components/tables'
import { getArticleList } from '@/api/article'
export default {
  name: 'article_manage',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: '用户名', key: 'username', sortable: true},
        {title: '邮箱', key: 'email', editable: true},
        {title: '最后更新时间', key: 'update_date'},
        {
          title: '操作',
          key: 'action',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getArticleList().then(res => {
      this.tableData = res.data.data.list
    })
  }
}
</script>

<style>

</style>
