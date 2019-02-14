<template>
    <el-row>
        <el-col :span="6" style='margin-top:5px;'>
            <div style="display: block">
                <el-tree
                        :data="treeData"
                        node-key="id"
                        highlight-current
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        ref="tree"
                        :default-expanded-keys="idArr"
                        @node-click="getNodeData"
                >
                </el-tree>
            </div>

        </el-col>
        <el-col :span="18" style='margin-top:5px;'>
            <el-table :key='tableKey' size="mini" :data="list" ref="actionTable" v-loading.body="listLoading" border fit
                      highlight-current-row style="width: 100%" @selection-change="changeFun">
                <el-table-column type="selection" width="35" prop="id" @selection-change="changeFun"></el-table-column>
                <el-table-column v-for="item in tableColum" :prop="item.prop" align="center"
                                 :label="item.label"></el-table-column>
                <!--  <li v-for="item in icons[0].icon" >
                    <svg class="icon" aria-hidden="true" @click="select(item.icon)">
                        <use :xlink:href="'#'+item.icon"></use>
                    </svg>
                    <div class="name"> {{ item.name }}</div>
                </li>
                -->
                <!--<el-table-column prop="actionCode" align="center" width="200" label="权限码"></el-table-column>
                <el-table-column prop="actionName" align="center" label="权限名称"></el-table-column>
                <el-table-column prop="url" align="center" width="250" label="action地址"></el-table-column>
                <el-table-column prop="menuName" align="center" label="所属菜单"></el-table-column>
                <el-table-column prop="menuId" align="center" v-if="1==2" label="所属菜单id"></el-table-column>
                <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
                <el-table-column prop="status" align="center" label="状态" :formatter="formatStatus"></el-table-column>-->
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
    import {fetchTree, page} from '@/api/components/common/index';


    import {mapGetters} from 'vuex';

    export default {
        name: 'wc-tree-table-select',
        props: {
            selected: {
                type: Array,
                required: false
            },
            treeUrl: {
                type: String,
                required: true
            },
            tableUrl: {
                type: String,
                required: true
            },
            tableColum: {
                type: Array,
                required: true
            },
            treeProps: {
                type: Object,
                required: false,
                defalut: {
                    children: 'subMenu',
                    label: 'menuName'
                }
            },
            queryProps:{
                type: String,
                required: false,
                defalut: 'id'}
            ,
            treeMutiqueryProps:{
                type: String,
                required: false,
                defalut: '0'}
        },
        data() {
            return {
                idArr: [],
                filterText1: '',
                list: undefined,
                tableKey: 0,
                treeData: [],
                clickNode: undefined,
                checkIds: [],
                oldTableSelected: [],
                multipleSelection: [],
                listLoading: false,
                statusValue: [{value: 'ENABLE', label: '启用'}, {value: 'DISABLE', label: '禁用'}],
                defaultProps: this.treeProps,
            }
        },
        watch: {
            filterText1(val) {
                this.$refs.tree.filter(val);
            },
            selected(val) { // 这样重新赋值后，就得到了父组件动态改变的数据
                this.selected = val;
            },
            treeUrl(val) {
                this.treeUrl = val;
                this.getList();
                /*if(this.treeUrl.indexOf("undefined") == -1){
                    this.getList();
                }*/
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters([
                'elements'
            ])
        },
        methods: {
            getList() {
                fetchTree(this.treeUrl).then(data => {
                    this.treeData = data.result;
                    this.treeData.forEach(m => {
                        this.idArr.push(m.id) //第一级默认展开
                    })
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data;
            },
            getActionList(data) {
                let query = { pageSize: 500, pageNum: 1};
                if(!this.queryProps)this.queryProps ='id';
                query[this.queryProps] = this.clickNode ? this.clickNode.id : -1;
                page(this.tableUrl, query).then(data1 => {

                    this.list = data1.result.list;
                    this.total = parseInt(data1.result.total);
                    this.listLoading = false;

                    this.checkIds = [];
                    this.list.forEach((item, index) => { // 遍历当前分页被选中数据
                        if (this.selected.includes(item.id)) { // id匹配上，则选中
                            this.checkIds.push(item.id)
                        }
                    })

                    this.$nextTick(() => {
                        this.$refs.actionTable.clearSelection();
                        this.list.forEach((item, index) => { // 遍历当前分页被选中数据
                            if (this.selected.includes(item.id)) { // id匹配上，则选中
                                //alert(this.selected)
                                this.$refs.actionTable.toggleRowSelection(item, true);
                                //this.checkIds.push(item.id)
                            }
                        })
                        //this.oldTableSelected = this.multipleSelection;
                    })

                });
            },
            getNodeData(data) {
                this.setSelectedVal();
                this.clickNode = data;
                this.getActionList(data);
            },
            changeFun(val) {
                this.multipleSelection = val;
            },
            formatStatus(row, column) {
                return row.status === 'ENABLE' ? '启用' : row.status === 'DISABLE' ? '禁用' : '未知'
            },
            setSelectedVal() {
                var checked_before_idx = []; //当前选中数据中原有selected中也有的 选中的index
                var checked_after_idx = []; //原有selectd中 被当前数据选中的 选中index
                this.multipleSelection.forEach((item, index) => { // 遍历当前分页被选中数据
                    this.checkIds.forEach((item1, index1) => { // 遍
                        if (item1 == item.id) { // id匹配上，则选中
                            checked_after_idx.push(index);
                            checked_before_idx.push(index1);
                        }
                    })
                })
                var addIds = [];
                var deletIds = [];
                //if(checked_after_idx.length > 0){
                this.multipleSelection.forEach((item, index) => {
                    if (checked_after_idx.length == 0 || !checked_after_idx.includes(index)) {
                        addIds.push(item.id);
                    }
                })
                //}
                this.checkIds.forEach((item, index) => {
                    if (checked_before_idx.length == 0 || !checked_before_idx.includes(index)) {
                        deletIds.push(item);
                    }
                })
                if (deletIds.length > 0) {
                    for (var i = 0; i < this.selected.length; i++) {
                        if (deletIds.includes(this.selected[i])) { // id匹配上，则选中
                            this.selected.splice(i, 1);
                            i--;
                        }
                    }
                }
                //alert(deletIds.length +"--"+this.selected.length)
                addIds.forEach((item, index) => { // 遍
                    this.selected.push(item)
                })
            },
            clearSelection() {
                this.multipleSelection = [];
                this.checkIds = [];
                this.$refs.actionTable.clearSelection();
                this.$refs.tree.setCurrentKey(null);
                this.list = [];
            },
            getCheckedActionKeys() {
                this.setSelectedVal();
                return this.selected;
            }
        }
    }
</script>

