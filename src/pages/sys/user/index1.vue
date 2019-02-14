<template>
    <d2-container >
        <div class="filter-container">
          <el-form :inline="true" :model="form" :rules="rules" ref="form" size="mini" style="margin-bottom: -18px;">
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
            <el-form-item label="所属组织">
              <el-input v-model="listQuery.groupId" placeholder="所属组织" style="width: 120px;"/>
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
            <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="resetFilter" type="primary" icon="reset">重置</el-button>
            <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
            <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="handleBatchDelte" type="primary" icon="edit">删除</el-button>
            </el-form>
        </div>
        <el-table :key='tableKey' size="mini" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="changeFun">
            <el-table-column type="selection" width="35" prop="id" @selection-change="changeFun"></el-table-column>
            <el-table-column prop="loginName"  align="center" label="登录名"></el-table-column>
            <el-table-column prop="userCode"  align="center" label="用户工号"></el-table-column>
            <el-table-column prop="userName"  align="center" label="用户性名"></el-table-column>
            <el-table-column prop="mobileNo" align="center" label="手机"></el-table-column>
            <el-table-column prop="email" align="center" width="200px" label="邮箱"></el-table-column>
            <el-table-column prop="groupName" align="center" label="所属组织"></el-table-column>

            <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
            <el-table-column prop="lastOperator" align="center" label="最后更新人"></el-table-column>
            <el-table-column prop="creator" align="center" label="创建人"></el-table-column>
            <el-table-column prop="status" align="center" label="状态" :formatter="formatStatus"></el-table-column>

            <el-table-column align="center" label="操作" width="420"><template scope="scope">
                <el-button v-if="roleManager_btn_edit" size="mini" type="warning" @click="handleRole(scope.row)"> 配置角色 </el-button>
                <el-button v-if="roleManager_btn_edit" size="mini" type="warning" @click="handleMenu(scope.row)"> 配置菜单 </el-button>
                <el-button v-if="roleManager_btn_edit" size="mini" type="warning" @click="handleAction(scope.row)"> 配置权限 </el-button>
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
                <el-form-item label="所属组织" prop="groupName">
                    <el-input v-model="form.groupId" placeholder="所属组织"></el-input>
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

        <el-dialog title="选择角色" :visible.sync="dialogRole" width="35%">
            <div style="height: 500px">
            <wc-tree-select :selected="selectedTree" :url="roleTreeUrl" ref="treeSelect" :treeProps="treeRoleProper"></wc-tree-select>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindRole('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择权限" :visible.sync="dialogAction" width="65%">
            <div style="min-height: 500px">
                <wc-tree-table-select :selected="selectedTableTree" :treeUrl="actionTreeUrl" :tableUrl="actionTreeSelectTableUrl" :tableColum="selectedTableColumn"
                                      :treeProps="treeTableProper" ref="treeTableSelect"></wc-tree-table-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindAction('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择菜单" :visible.sync="dialogMenu" width="35%">
            <div style="height: 500px">
                <wc-tree-select :selected="selectedMenuTree" :url="menuTreeUrl" :treeProps="treeTableProper" ref="treeMenuSelect"></wc-tree-select>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindMenu('form')">确 定</el-button>
            </div>
        </el-dialog>

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
    import { mapGetters } from 'vuex';
    export default {
        name: 'uas-user-list',
        components: {
            'wc-tree-select': () => import('@/components/wc-tree-select/index'),
            'wc-tree-table-select': () => import('@/components/wc-tree-table-select/index')
        },
        data() {
            return {
                form: {
                    userCode: undefined,
                    loginName: undefined,
                    userName: undefined,
                    mobileNo: undefined,
                    email: undefined,
                    loginPwd: undefined,
                    groupName: undefined,
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
                selectUserId:'',
                selectedTree: [],
                treeTableProper: { children: 'subMenu',label: 'menuName'},
                treeRoleProper:{ children: 'children',  label: 'roleName'},
                selectedTableTree: [],
                selectedMenuTree: [],
                selectedTableColumn: [{prop:"menuName",label:"所属菜单"},{prop:"actionCode",label:"权限码"},{prop:"actionName",label:"权限名称"},{prop:"url",label:"action地址"}],
                roleTreeUrl: '/role/getTree',
                actionTreeUrl: '/menu/getTree',
                menuTreeUrl: '/menu/getTree',
                actionTreeSelectTableUrl: '/action/queryListByMenuId',
                multipleSelection: [],
                list: null,
                total: null,
                listLoading: true,
                statusValue: [{value:'',label:'请选择'},{value:'ENABLE',label:'启用'},{value:'DISABLE',label:'禁用'}],
                listQuery: {
                    pageSize: 20,
                    pageNum: 1,
                    loginName: undefined,
                    userCode: undefined,
                    userName: undefined,
                    mobileNo: undefined,
                    groupId: undefined,
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
                tableKey: 0
            }
        },
        created() {
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
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                getObj(row.id).then(data => {
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
            getRoleList(){

            },
            handleRole(row){
                this.selectedTree = [];
                getBindRole(row.id).then(data => {
                    if(data && data.result){
                        this.selectedTree = data.result.alreadyBindRoleIdSet;
                    }
                    this.selectUserId = row.id;
                    this.dialogRole = true;
                });

            },
            handleAction(row){
                this.selectedTableTree = [];
                getBindAction(row.id).then(data => {
                    if(data && data.result){
                        this.selectedTableTree = data.result.alreadyBindIdSet;
                    }
                    this.selectUserId = row.id;
                    this.dialogAction = true;
                    this.$nextTick(() => {
                        this.$refs.treeTableSelect.clearSelection()
                    })
                });
            },
            handleMenu(row){
                this.selectedMenuTree = [];
                getBindMenu(row.id).then(data => {
                    if(data && data.result){
                        this.selectedMenuTree = data.result.alreadyBindIdSet;
                    }
                    this.selectUserId = row.id;
                    this.dialogMenu = true;
                    this.$nextTick(() => {
                        //this.$refs.treeMenuSelect.clearSelection();
                    })
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
            saveBindRole(){
                bindRole({userId:this.selectUserId, roleIdList:this.$refs.treeSelect.getCheckedKeys()}).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogRole = false;
                });
            },
            saveBindAction(){
                bindAction({bindId: this.selectUserId, bindList:this.$refs.treeTableSelect.getCheckedActionKeys()}).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogAction = false;
                });
            },
            saveBindMenu(){
                bindMenu({bindId: this.selectUserId, bindList:this.$refs.treeMenuSelect.getCheckedKeys()}).then(data => {
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
                        putObj( this.form).then(() => {
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
                        loginName: undefined,
                        userCode: undefined,
                        userName: undefined,
                        mobileNo: undefined,
                        groupId: undefined,
                        updateTime: undefined,
                        updateTimeR: undefined
                }
                this.getList();
            }
        }
    }
</script>
