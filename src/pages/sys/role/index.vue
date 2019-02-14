<template>
    <d2-container >
        <el-row>
            <el-col :span="5" style='margin-top:5px;'>
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <el-tree
                        class="filter-tree"
                        :data="treeData"
                        node-key="id"
                        highlight-current
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        ref="menuTree"
                        :default-expanded-keys="idArr"
                        @node-click="getNodeData"
                >
                </el-tree>
            </el-col>
            <el-col :span="19" style='margin-top:5px;'>
                <div class="filter-container">
                    <el-form :inline="true" :model="form" :rules="rules" ref="form" size="mini" style="margin-bottom: -18px;">
                        <el-form-item label="角色编码:">
                            <el-input v-model="listQuery.roleCode" placeholder="角色编码" style="width: 120px;"/>
                        </el-form-item>
                        <!-- <el-input size="mini" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="角色编码" v-model="listQuery.roleCode"> </el-input>-->
                        <el-form-item label="角色名称:">
                            <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 120px;"/>
                        </el-form-item>
                        <el-form-item label="角色描述:">
                            <el-input v-model="listQuery.remark" placeholder="角色描述" style="width: 120px;"/>
                        </el-form-item>
                        <el-form-item label="最后更新时间:" prop="key">
                            <el-date-picker  style="width: 320px;padding-right: 0px"
                                             v-model="listQuery.updateTimeR" type="datetimerange" range-separator="至" start-placeholder="最后更新开始日期" end-placeholder="最后更新结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态:" prop="key">
                            <el-select style="width: 120px;" v-model="listQuery.status" placeholder="请选择状态">
                                <el-option  v-for="item in statusValue" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-button size="small" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" ><d2-icon name="search"/> 搜索</el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="resetFilter" type="success" icon="reset">重置</el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="success" icon="edit">添加</el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="handleBatchDelte" type="danger" icon="edit">删除</el-button>
                    </el-form>
                </div>
                <el-table :key='tableKey' size="mini" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="changeFun">
                    <el-table-column type="selection" width="35" prop="id" @selection-change="changeFun"></el-table-column>
                    <el-table-column prop="roleCode" width="130px" align="center" label="角色编码"></el-table-column>
                    <el-table-column prop="roleName"align="center" label="角色名称"></el-table-column>
                    <el-table-column prop="groupName" align="groupName" label="所属组织"></el-table-column>
                    <el-table-column prop="remark" align="center" label="角色描述"></el-table-column>
                    <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
                    <!--<el-table-column prop="lastOperator"align="center" label="最后更新人"></el-table-column>
                     <el-table-column prop="creator" width="170px" align="center" label="创建人"></el-table-column>-->
                    <el-table-column prop="status" width="80px" align="center" label="状态" :formatter="formatStatus"></el-table-column>

                    <el-table-column align="center" label="操作" width="330" ><template scope="scope">
                        <el-button type="warning" size="mini" v-if="roleManager_btn_edit" icon="edit" @click="handleMenu(scope.row)">配置菜单</el-button>
                        <el-button type="warning" size="mini" v-if="roleManager_btn_edit" icon="edit" @click="handleAction(scope.row)">配置权限</el-button>

                        <el-button v-if="roleManager_btn_edit" size="mini" type="success" @click="handleUpdate(scope.row)"> 编辑 </el-button>
                        <el-button v-if="roleManager_btn_del" size="mini" type="danger" @click="handleDelete(scope.row)">删除 </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout=" prev, pager, next, jumper,sizes,total" :total="total"> </el-pagination>
                </div>
                <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
                    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                        <el-form-item label="所属组织" prop="parentName">
                            <el-input v-model="form.groupName" placeholder="请输入所属组织" readonly class="inputColor_Blue"></el-input>
                            <el-input v-model="form.groupId" v-if="1==2"></el-input>
                        </el-form-item>
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input v-model="form.roleCode" placeholder="请输入角色编码"></el-input>
                        </el-form-item>
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="remark">
                            <el-input v-model="form.remark" placeholder="请输入角色描述"></el-input>
                        </el-form-item>
                        <el-form-item label="状态:" prop="key">
                            <el-select style="width: 120px;" v-model="form.status" placeholder="请选择状态">
                                <el-option v-for="item in statusValue" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel('form')">取 消</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>


        <el-dialog title="选择权限" :visible.sync="dialogAction" width="65%">
            <div style="min-height: 500px">
                <wc-tree-table-select :selected="selectedTableTree" :treeUrl="actionTreeUrl+selectRoleId"
                                      :tableUrl="actionTreeSelectTableUrl" :tableColum="selectedTableColumn"
                                      :treeProps="treeTableProper" ref="treeTableSelect"></wc-tree-table-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindAction('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择菜单" :visible.sync="dialogMenu" width="35%">
            <div style="height: 500px">
                <wc-tree-select :selected="selectedMenuTree" :url="menuTreeUrl" :treeProps="treeTableProper"
                                ref="treeMenuSelect"></wc-tree-select>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindMenu('form')">确 定</el-button>
            </div>
        </el-dialog>
    </d2-container>
</template>

<script>
    import {fetchTree} from '@/api/sys/group/index';
    import {
        page,
        saveObj,
        getObjById,
        delObj,
        delObjBatch,
        getBindAction,
        getBindMenu,
        bindAction,
        bindMenu
    } from '@/api/sys/role';


    import { mapGetters } from 'vuex';
    export default {
        name: 'uas-role-list',
        components: {
            'wc-tree-select': () => import('@/components/wc-tree-select/index'),
            'wc-tree-table-select': () => import('@/components/wc-tree-table-select/index')
        },
        data() {
            return {
                defaultProps: {
                    children: 'subMenu',
                    label: 'menuName'
                },
                treeData: [],
                idArr: [],
                clickTreeNode: undefined,
                filterText: '',

                selectRoleId: '',
                treeTableProper: {children: 'subMenu', label: 'menuName'},
                selectedTableTree: [],
                selectedMenuTree: [],
                selectedTableColumn: [{prop: "menuName", label: "所属菜单"}, {
                    prop: "actionCode",
                    label: "权限码"
                }, {prop: "actionName", label: "权限名称"}, {prop: "url", label: "action地址"}],
                menuTreeUrl: '/menu/getTree',
                actionTreeUrl: '/role/getMenuTreeByRoleId/',
                actionTreeSelectTableUrl: '/action/queryListByMenuId',
                dialogAction: false,
                dialogMenu: false,


                form: {
                    code: undefined,
                    name: undefined,
                    description: undefined
                },
                rules: {
                    code: [{
                        required: true,
                        message: '请输入编码',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 20,
                        message: '长度在 3 到 20 个字符',
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: '请输入类型名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 20,
                        message: '长度在 3 到 20 个字符',
                        trigger: 'blur'
                    }],
                    description: [{
                        required: true,
                        message: '请输入描述',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 20,
                        message: '长度在 3 到 20 个字符',
                        trigger: 'blur'
                    }]
                },
                multipleSelection: [],
                list: null,
                total: null,
                listLoading: true,
                statusValue: [{value:'ENABLE',label:'启用'},{value:'DISABLE',label:'禁用'}],
                listQuery: {
                    pageSize: 20,
                    pageNum: 1,
                    roleName: undefined,
                    roleCode: undefined,
                    remark: undefined,
                    updateTime: undefined,
                    updateTimeR: undefined
                },
                dialogFormVisible: false,
                dialogStatus: '',
                roleManager_btn_edit: false,
                roleManager_btn_del: false,
                roleManager_btn_add: false,
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0
            }
        },
        created() {
            this.geTreetList();
            this.getRoleList();
            this.roleManager_btn_edit = true; // this.elements['roleManager:btn_edit'];
            this.roleManager_btn_del = true; // this.elements['roleManager:btn_del'];
            this.roleManager_btn_add = true; // this.elements['roleManager:btn_add'];
        },
        computed: {
            ...mapGetters([
                'elements'
            ])
        },
        methods: {
            filterNode() {
                //this.getList();
            },
            getNodeData(data) {
                this.clickTreeNode = data;
                var groupIds = [];
                if(data.id != 1){
                    if(data.hasMenu){
                        this.getGroupIds(groupIds,data.subMenu);
                    }else{
                        groupIds.push(data.id);
                    }
                    this.listQuery.groupIds = groupIds;
                }else{
                    this.listQuery.groupIds = undefined;
                }
                this.getRoleList();
            },
            geTreetList() {
                fetchTree(null).then(data => {
                    this.treeData = data.result;
                    this.treeData.forEach(m => {
                        this.idArr.push(m.id)
                    })
                });
            },
            getGroupIds(groupIds, group){
                for(var i =0;i < group.length;i++){
                    if(group[i].hasMenu){
                        this.getGroupIds(groupIds, group[i].subMenu);
                    }else{
                        groupIds.push(group[i].id);
                    }
                }
            },


            getRoleList() {
                this.listLoading = true;
                page(this.listQuery).then(data => {
                    this.list = data.result.list;
                    this.total = parseInt(data.result.total);
                    this.listLoading = false;
                })
            },
            handleFilter() {
                this.getRoleList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getRoleList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getRoleList();
            },
            handleCreate() {
                if(!this.clickTreeNode || this.clickTreeNode.hasMenu){
                    this.$notify({
                        title: '提示',
                        message: '请选择组织，并且组织不能有下级',
                        type: 'info',
                        duration: 3000
                    });
                    return;
                }
                this.resetTemp();
                this.form.groupId = this.clickTreeNode.id;
                this.form.groupName = this.clickTreeNode.menuName;
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                getObjById(row.id).then(data => {
                    this.form = data.result;
                    this.dialogFormVisible = true;
                    this.dialogStatus = 'update';
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(row.id).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        const index = this.list.indexOf(row);
                        this.list.splice(index, 1);
                        this.total = this.total-1;
                    });
                });
            },
            handleBatchDelte(){
                if(this.multipleSelection.length ==0){
                    this.$notify({
                        title: '提示',
                        message: '请选择要删除的行！！',
                        type: 'info',
                        duration: 3000
                    });
                    return;
                }
                var ids = [];
                this.multipleSelection.forEach((row, index) => {
                    ids.push(row.id)
                })
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObjBatch(ids).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.listQuery.pageNum = 1;
                        this.getList();
                        this.multipleSelection = [];
                    });
                });
            },
            create(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        saveObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getRoleList();
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                            });
                        })
                    } else {
                        return false;
                    }
                });
            },
            cancel(formName) {
                this.dialogFormVisible = false;
                this.dialogAction = false;
                this.dialogMenu = false;
                this.$refs[formName].resetFields();
            },
            update(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.form.password = undefined;
                        saveObj( this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getRoleList();
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetTemp() {
                this.form = {
                    username: undefined,
                    name: undefined,
                    status:'ENABLE',
                    password: undefined,
                    description: undefined
                };
            },
            changeFun(val) {
                this.multipleSelection = val;
            },
            formatStatus(row, column){
                return row.status === 'ENABLE' ? '启用' : row.status === 'DISABLE' ? '禁用' : '未知'
            },
            resetFilter() {
                this.listQuery = {
                    pageSize: 20,
                    pageNum: 1,
                    roleName: undefined,
                    roleCode: undefined,
                    remark: undefined,
                    updateTime: undefined,
                    updateTimeR: undefined
                }
                this.getRoleList();
            },


            handleAction(row) {
                this.selectRoleId = row.id;
                this.selectedTableTree = [];
                getBindAction(row.id).then(data => {
                    if (data && data.result) {
                        this.selectedTableTree = data.result.checkedAuthList;
                    }
                    this.dialogAction = true;
                    this.$nextTick(() => {
                        this.$refs.treeTableSelect.clearSelection()
                    })
                });
            },
            handleMenu(row) {
                this.selectRoleId = row.id;
                this.selectedMenuTree = [];
                getBindMenu(this.selectRoleId).then(data => {
                    if (data && data.result) {
                        this.selectedMenuTree = data.result.checkedAuthList;
                    }
                    this.dialogMenu = true;
                    this.$nextTick(() => {
                        //this.$refs.treeMenuSelect.clearSelection();
                    })
                });
            },
            saveBindAction() {
                bindAction({
                    bindId: this.selectRoleId,
                    bindList: this.$refs.treeTableSelect.getCheckedActionKeys()
                }).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogAction = false;
                });
            },
            saveBindMenu() {
                bindMenu({
                    bindId: this.selectRoleId,
                    bindList: this.$refs.treeMenuSelect.getCheckedKeys()
                }).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    if (this.$refs.treeTableSelect) {
                        this.$refs.treeTableSelect.getList(); //从新刷新权限菜单树
                    }
                    this.dialogMenu = false;
                });
            }
        }
    }
</script>
