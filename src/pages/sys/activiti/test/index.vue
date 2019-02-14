<template>
    <d2-container>
        <el-row>
            <el-col :span="24" style='margin-top:5px;'>
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
                    <!--<el-table-column prop="email" align="center" label="邮箱"></el-table-column>-->
                    <el-table-column prop="groupName" align="center" label="所属组织"></el-table-column>
                    <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
                    <el-table-column prop="status" align="center" label="状态" :formatter="formatStatus"></el-table-column>
                    <el-table-column prop="flowTaskName" align="center" label="流程阶段"></el-table-column>
                    <el-table-column align="center" label="操作" width="300">
                        <template scope="scope">
                            <el-button v-if="scope.row.flowTaskName==null" size="mini" type="warning"
                                       @click="handleStart(scope.row)"> 启动流程
                            </el-button>
                            <el-button v-if="scope.row.canCheck" size="mini" type="success"
                                       @click="handleCheck(scope.row)"> 审核
                            </el-button>
                            <el-button v-if="scope.row.flowTaskName != null" size="mini" type="success"
                                       @click="handleViewPic(scope.row)">查看流程图
                            </el-button>
                            <el-button v-if="scope.row.flowTaskName==null" size="mini" type="danger"
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
                        <!--<el-form-item label="任务id" prop="taskId">
                            <el-input v-model="form.taskId" placeholder="请输入任务id"></el-input>
                        </el-form-item>-->
                        <el-form-item label="审批人" prop="assignee">
                            <el-input v-model="form.assignee" placeholder="请输入审批人" >{{info.name}}</el-input>
                        </el-form-item>
                        <el-form-item label="审核意见" prop="opinion">
                            <el-input v-model="form.opinion" placeholder="请输入审核意见"></el-input>
                        </el-form-item>
                        <el-form-item label="审核状态:" prop="key">
                            <el-select style="width: 120px;" v-model="form.isReviewPass" placeholder="请选择审核状态">
                                <el-option v-for="item in statusValue" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel('form')">取 消</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="saveCheck('form')">确 定</el-button>
                        <el-button v-else type="primary" @click="saveCheck('form')">确 定</el-button>
                    </div>
                </el-dialog>


                <el-dialog title="查看流程图" :visible.sync="dialogPicVisible">
                    <img  :src="imageCode"  />
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel('form')">取 消</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import { startProcessInstance,saveCheck,testPage } from '@/api/sys/activiti/test/index';
    import {
        page,
        getObj,
    } from '@/api/sys/user';
    import {fetchTree} from '@/api/sys/group/index';
    import {mapGetters} from 'vuex';
    import ajax from '@/plugin/axios'

    export default {
        name: 'uas-activiti-test-list',
        data() {
            return {
                dialogPicVisible: false,
                imageCode: undefined,
                selectParams: {
                    'multiple': true,
                    'clearable': true,
                    'placeholder': '请输入内容'
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
                multipleSelection: [],
                list: null,
                total: null,
                listLoading: false,
                statusValue: [{value: '', label: '请选择'}, {value: '1', label: '通过'}, {
                    value: '0',
                    label: '不通过'
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
                dialogStatus: '',
                roleManager_btn_edit: false,
                roleManager_btn_del: false,
                roleManager_btn_add: false,
                textMap: {
                    update: '审核',
                    create: '创建'
                },
                tableKey: 0,

                roleList: [],
                roleSelection : []
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
                testPage(this.listQuery).then(data => {
                    this.list = data.result.list;
                    this.total = parseInt(data.result.total);
                    this.listLoading = false;
                })
            },
            handleFilter() {
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
            handleCheck(row) {
                this.resetTemp();
                this.form.id = row.id;
                /* getObj(row.id).then(data => {
                    this.form = data.result;
                    this.dialogFormVisible = true;
                    this.dialogStatus = 'update';
                });*/
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';
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
            handleStart(row) {
                this.$confirm('提交申请？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let paramer = {businessKey:row.id,
                        instanceKey:"test01",
                        applyUserId:"admin"
                    };
                    startProcessInstance(paramer).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '启动成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.getList();
                    });
                });
            },
            handleViewPic(row){
                this.imageCode = undefined;
                this.dialogPicVisible = true;
                ajax({
                    method: 'POST',
                    url: '/wf/bus/viewProcessInstanceImage',
                    data: JSON.stringify({busKey:row.id})
                }).then((res) => {
                    if(res && res.code =='200'){
                        this.imageCode = 'data:image/jpg;base64,' + res.result;
                    }else{
                        alert(res.message)
                    }
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


            saveCheck(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.form.busId = this.form.id;
                        saveCheck(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                                title: '成功',
                                message: '审核成功',
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
                this.dialogRole = false;
                this.dialogAction = false;
                this.dialogMenu = false;
                this.dialogPicVisible = false;
                this.$refs[formName].resetFields();
            },
            update(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.form.password = undefined;
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
                return row.status === '1' ? '通过' : row.status === '0' ? '不通过' : '未知'
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
        }
    }
</script>
