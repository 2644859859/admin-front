<template>
    <d2-container>
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
                        :expand-on-click-node="false"
                        ref="groupTree"
                        :default-expanded-keys="idArr"
                        @node-click="getNodeData"
                >
                </el-tree>
            </el-col>
            <el-col :span="19" style='margin-top:5px;'>
                <div class="filter-container">
                    <el-form :inline="true" :model="form" :rules="rules" ref="form" size="mini"
                             style="margin-bottom: -18px;">
                        <el-form-item label="登录名">
                            <el-input v-model="listQuery.loginName" placeholder="登录名" style="width: 120px;"/>
                        </el-form-item>
                        <el-form-item label="用户工号">
                            <el-input v-model="listQuery.userCode" placeholder="用户工号" style="width: 120px;"/>
                        </el-form-item>
                        <el-form-item label="用户性名">
                            <el-input v-model="listQuery.userName" placeholder="用户性名" style="width: 120px;"/>
                        </el-form-item>
                        <el-form-item label="手机">
                            <el-input v-model="listQuery.mobileNo" placeholder="手机" style="width: 120px;"/>
                        </el-form-item>
                        <!--<el-form-item label="所属组织">
                            <el-input v-model="listQuery.groupId" placeholder="所属组织" style="width: 120px;"/>
                        </el-form-item>-->
                        <el-form-item label="最后更新时间:" prop="key">
                            <el-date-picker style="width: 320px;padding-right: 0px"
                                            v-model="listQuery.updateTimeR" type="datetimerange" range-separator="至"
                                            start-placeholder="最后更新开始日期" end-placeholder="最后更新结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态:" prop="key">
                            <el-select style="width: 120px;" v-model="listQuery.status" placeholder="请选择状态">
                                <el-option v-for="item in statusValue" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-button size="small" class="filter-item" type="primary" v-waves icon="search"
                                   @click="handleFilter">
                            <d2-icon name="search"/>
                            搜索
                        </el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;"
                                   @click="resetFilter" type="success" icon="reset">重置
                        </el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;"
                                   @click="handleCreate" type="success" icon="edit">添加
                        </el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;"
                                   @click="handleBatchDelte" type="danger" icon="edit">删除
                        </el-button>
                    </el-form>
                </div>
                <el-table :key='tableKey' size="mini" :data="list" v-loading.body="listLoading" border fit
                          highlight-current-row style="width: 100%" @selection-change="changeFun">
                    <el-table-column type="selection" width="35" prop="id" @selection-change="changeFun"></el-table-column>
                    <el-table-column prop="loginName" align="center" label="登录名"></el-table-column>
                    <el-table-column prop="userCode" align="center" label="用户工号"></el-table-column>
                    <el-table-column prop="userName" align="center" label="用户性名"></el-table-column>
                    <el-table-column prop="mobileNo" align="center" label="手机"></el-table-column>
                    <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
                    <el-table-column prop="groupName" align="center" label="所属组织"></el-table-column>

                    <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
                    <!--<el-table-column prop="lastOperator" align="center" label="最后更新人"></el-table-column>
                    <el-table-column prop="creator" align="center" label="创建人"></el-table-column>-->
                    <el-table-column prop="status" align="center" label="状态" :formatter="formatStatus"></el-table-column>

                    <el-table-column align="center" label="操作" width="420">
                        <template scope="scope">
                            <el-button v-if="roleManager_btn_edit" size="mini" type="warning"
                                       @click="handleRole(scope.row)"> 配置角色
                            </el-button>
                            <el-button v-if="roleManager_btn_edit" size="mini" type="warning"
                                       @click="handleMenu(scope.row)"> 配置菜单
                            </el-button>
                            <el-button v-if="roleManager_btn_edit" size="mini" type="warning"
                                       @click="handleAction(scope.row)"> 配置权限
                            </el-button>
                            <el-button v-if="roleManager_btn_edit" size="mini" type="success"
                                       @click="handleUpdate(scope.row)"> 编辑
                            </el-button>
                            <el-button v-if="roleManager_btn_del" size="mini" type="danger"
                                       @click="handleDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]"
                                   :page-size="listQuery.pageSize" layout=" prev, pager, next, jumper,sizes,total"
                                   :total="total"></el-pagination>
                </div>
                <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
                    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                        <el-form-item label="所属组织" prop="groupName">
                            <ELTreeSelect
                                    ref="treeSelect"
                                    v-model="form.groupIds"
                                    :selectParams="selectParams"
                                    :treeParams="elTreeParams"
                                    @select-clear="fun"
                                    @searchFun="fun"
                            />
                        </el-form-item>
                        <el-form-item label="用户工号" prop="userCode">
                            <el-input v-model="form.userCode" placeholder="请输入用户工号"></el-input>
                        </el-form-item>
                        <el-form-item label="登录名" prop="loginName">
                            <el-input v-model="form.loginName" placeholder="请输入登录名"></el-input>
                        </el-form-item>
                        <el-form-item label="登录密码" prop="loginPwd">
                            <el-input v-model="form.loginPwd" placeholder="请输入登录密码"></el-input>
                        </el-form-item>
                        <el-form-item label="用户性名" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户性名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户手机" prop="mobileNo">
                            <el-input v-model="form.mobileNo" placeholder="请输入用户手机"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="remark">
                            <el-input v-model="form.remark" placeholder="请输入角色描述"></el-input>
                        </el-form-item>
                        <el-form-item label="状态:" prop="key">
                            <el-select style="width: 120px;" v-model="form.status" placeholder="请选择状态">
                                <el-option v-for="item in statusValue" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel('form')">取 消</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="选择角色" :visible.sync="dialogRole" width="50%">
                    <el-table :key='tableKey' size="mini" :data="roleList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"  ref="selectRoleTable" @selection-change="changeFunRole">
                        <el-table-column type="selection" width="35" prop="roleId" @selection-change="changeFunRole"></el-table-column>
                        <el-table-column prop="roleCode" width="130px" align="center" label="角色编码"></el-table-column>
                        <el-table-column prop="roleName"align="center" label="角色名称"></el-table-column>
                        <el-table-column prop="groupName" align="groupName" label="所属组织"></el-table-column>
                        <el-table-column prop="remark" align="center" label="角色描述"></el-table-column>
                        <el-table-column prop="status" width="80px" align="center" label="状态" :formatter="formatStatus"></el-table-column>
                    </el-table>

                    <!--<div style="height: 500px">
                        <wc-tree-select :selected="selectedTree" :url="roleTreeUrl" ref="treeSelect"
                                        :treeProps="treeRoleProper"></wc-tree-select>
                    </div>-->
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel('form')">取 消</el-button>
                        <el-button type="primary" @click="saveBindRole('form')">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="选择权限" :visible.sync="dialogAction" width="65%">
                    <div style="min-height: 500px">
                        <wc-tree-table-select :selected="selectedTableTree" :treeUrl="actionTreeUrl+selectUserId"
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
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import {
        page,
        addObj,
        getObj,
        delObj,
        delObjBatch,
        putObj,
        bindRole,
        getBindAction,
        getBindMenu,
        bindAction,
        bindMenu,
        getBindRole
    } from '@/api/sys/user';
    import {fetchTree} from '@/api/sys/group/index';

    import {getObj as getRoleList} from '@/api/sys/role/index';

    import {mapGetters} from 'vuex';
    export default {
        name: 'uas-user-list',
        components: {
            'wc-tree-select': () => import('@/components/wc-tree-select/index'),
            'wc-tree-table-select': () => import('@/components/wc-tree-table-select/index'),
            'tree-select': () => import( '@riophae/vue-treeselect'),
            'ELTreeSelect': () => import( '@/plugin/element/el-tree-select'),
        },
        data() {
            return {
                selectParams: {
                    'multiple': true,
                    'clearable': true,
                    'placeholder': '请输入内容'
                },
                elTreeParams: {
                    'default-expand-all': false,
                    'filterable': true,
                    'check-strictly': true,
                    'render-content': this._renderFun,
                    'data': [],
                    'expandedKeys': [],
                    'props': {
                        children: 'subMenu',
                        label: 'menuName',
                        value: 'id'
                    }
                },
                value:[],
                normalizer(node) {
                    return {
                        id: node.id,
                        label: node.menuName,
                        children: node.subMenu,
                    }
                },
                filterText: '',
                treeData: [],
                defaultProps: {
                    children: 'subMenu',
                    label: 'menuName'
                },
                idArr: [],
                clickMenu: undefined,
                selectGroupId: undefined,
                form: {
                    userCode: undefined,
                    loginName: undefined,
                    userName: undefined,
                    mobileNo: undefined,
                    email: undefined,
                    loginPwd: undefined,
                    groupIds: undefined,
                    remark: undefined,
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
                    }],
                    description: [{
                        required: true,
                        message: '请输入描述',
                        trigger: 'blur'
                    } ]
                },
                selectUserId: '',
                selectedTree: [],
                treeTableProper: {children: 'subMenu', label: 'menuName'},
                treeRoleProper: {children: 'children', label: 'roleName'},
                selectedTableTree: [],
                selectedMenuTree: [],
                selectedTableColumn: [{prop: "menuName", label: "所属菜单"}, {
                    prop: "actionCode",
                    label: "权限码"
                }, {prop: "actionName", label: "权限名称"}, {prop: "url", label: "action地址"}],
                roleTreeUrl: '/role/getTree',
                actionTreeUrl: '/user/getMenuTreeByUserId/',
                menuTreeUrl: '/menu/getTree',
                actionTreeSelectTableUrl: '/action/queryListByMenuId',
                multipleSelection: [],
                list: null,
                total: null,
                listLoading: false,
                statusValue: [{value: '', label: '请选择'}, {value: 'ENABLE', label: '启用'}, {
                    value: 'DISABLE',
                    label: '禁用'
                }],
                listQuery: {
                    pageSize: 20,
                    pageNum: 1,
                    loginName: undefined,
                    userCode: undefined,
                    userName: undefined,
                    mobileNo: undefined,
                    groupIds: undefined,
                    updateTime: undefined,
                    updateTimeR: undefined
                },
                dialogFormVisible: false,
                dialogRole: false,
                dialogAction: false,
                dialogMenu: false,
                dialogStatus: '',
                roleManager_btn_edit: false,
                roleManager_btn_del: false,
                roleManager_btn_add: false,
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0,

                roleList: [],
                roleSelection : []
            }
        },
        created() {
            this.getTreeList();
            this.getList();
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
            selectGroup (data,node, vm) {
            },
            fun(){

            },
            filterNode(value, data) {
                return data;
            },
            getTreeList() {
                fetchTree().then(data => {
                    this.treeData = data.result;
                    this.elTreeParams.data=data.result;
                    this.treeData.forEach(m => {
                        this.idArr.push(m.id)
                    })
                    this.elTreeParams.expandedKeys =  this.idArr;
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
            getNodeData(data) {
                this.clickMenu = data;
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
                this.getList();
            },
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(data => {
                    this.list = data.result.list;
                    this.total = parseInt(data.result.total);
                    this.listLoading = false;
                })
            },
            handleFilter() {
                this.getList();
            },
            handleQueryRole() {
                this.getList();
            },
            handleQueryAction() {
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleCreate() {
                /*if(!this.clickMenu || this.clickMenu.hasMenu){
                    this.$notify({
                        title: '失败',
                        message: '创建用户时所选组织不能有下级组织！！',
                        type: 'info',
                        duration: 2000
                    });
                    return;
                }*/
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.resetTemp();
                getObj(row.id).then(data => {
                    this.form = data.result;
                    //this.form.groupIds =["531662456632640512", "531662630914360320", "531662713818973184"];
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
                        this.total = this.total - 1;
                    });
                });
            },
            handleAction(row) {
                this.selectUserId = row.id;
                this.selectedTableTree = [];
                getBindAction(row.id).then(data => {
                    this.$nextTick(() => {
                        if(this.$refs.treeTableSelect)
                            this.$refs.treeTableSelect.clearSelection()
                    })
                    if (data && data.result) {
                        this.selectedTableTree = data.result.alreadyBindIdSet;
                    }
                    this.dialogAction = true;
                });
            },
            handleMenu(row) {
                this.selectUserId = row.id;
                this.selectedMenuTree = [];
                getBindMenu(row.id).then(data => {
                    if (data && data.result) {
                        this.selectedMenuTree = data.result.alreadyBindIdSet;
                    }
                    this.dialogMenu = true;
                    this.$nextTick(() => {
                        //this.$refs.treeMenuSelect.clearSelection();
                    })
                });
            },
            handleBatchDelte() {
                if (this.multipleSelection.length == 0) {
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
                        addObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
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

            saveBindAction() {
                bindAction({
                    bindId: this.selectUserId,
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
                    bindId: this.selectUserId,
                    bindList: this.$refs.treeMenuSelect.getCheckedKeys()
                }).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogMenu = false;
                });
            },
            cancel(formName) {
                this.dialogFormVisible = false;
                this.dialogRole = false;
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
                        //this.form.groupId = this.selectGroupId;
                        putObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
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
                    password: undefined,
                    groupIds: [],
                    description: undefined
                };
            },
            changeFun(val) {
                this.multipleSelection = val;
            },
            formatStatus(row, column) {
                return row.status === 'ENABLE' ? '启用' : row.status === 'DISABLE' ? '禁用' : '未知'
            },
            resetFilter() {
                this.listQuery = {
                    pageSize: 20,
                    pageNum: 1,
                    loginName: undefined,
                    userCode: undefined,
                    userName: undefined,
                    mobileNo: undefined,
                    groupId: undefined,
                    updateTime: undefined,
                    updateTimeR: undefined
                }
                this.getList();
            },


            handleRole(row) {
                this.selectedTree = [];
                getBindRole(row.id).then(data => {
                    if (data && data.result) {
                        this.selectedTree = data.result.alreadyBindRoleIdSet;
                        this.roleList = data.result.allRoleSet;
                    }
                    this.selectUserId = row.id;
                    this.dialogRole = true;

                    this.$nextTick(() => {
                        this.$refs.selectRoleTable.clearSelection();
                        this.roleList.forEach((item, index) => { // 遍历当前分页被选中数据
                            if (this.selectedTree.includes(item.roleId)) { // id匹配上，则选中
                                this.$refs.selectRoleTable.toggleRowSelection(item, true);
                            }
                        })
                    })
                });
                /*getRoleList({groupIds: [row.groupId]}).then(data => {
                    this.roleList = data.result;
                });*/
            },
            saveBindRole() {
                bindRole({userId: this.selectUserId, roleIdList: this.roleSelection.map(v => {return v.roleId})}).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogRole = false;
                });
            },
            changeFunRole(val){
                this.roleSelection = val;
            }
        }
    }
</script>
