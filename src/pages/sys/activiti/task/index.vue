<template>
    <d2-container>
        <el-row>
            <el-col :span="24" style='margin-top:5px;'>
                <div class="filter-container">
                    <el-form :inline="true" :model="form" :rules="rules" ref="form" size="mini"
                             style="margin-bottom: -18px;">
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
                        <el-button size="small" class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">
                            <d2-icon name="search"/>搜索
                        </el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;"
                                   @click="resetFilter" type="success" icon="reset">重置
                        </el-button>
                    </el-form>
                </div>
                <el-table size="mini" :data="list" v-loading.body="listLoading" border fit
                          highlight-current-row style="width: 100%" @selection-change="changeFun">
                    <el-table-column prop="taskName" align="center" label="任务名"></el-table-column>
                    <el-table-column prop="modelName" align="center" label="模型名称"></el-table-column>
                    <el-table-column prop="taskDesc" align="center" label="任务描述"></el-table-column>
                    <el-table-column prop="createDate" align="center" label="创建时间" width="140"></el-table-column>
                    <el-table-column align="center" label="操作" width="300">
                        <template scope="scope">
                            <el-button  size="mini" type="success"
                                       @click="handleCheck(scope.row)"> 审核
                            </el-button>
                            <el-button size="mini" type="info"
                                       @click="handleViewPic(scope.row)"><!--查看-->流程图
                            </el-button>
                            <el-button size="mini" type="info"
                                       @click="handleViewCheckHis(scope.row)"><!--查看-->审核历史
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
                        <el-form-item label="审批人" prop="assignee">
                            <el-input v-model="form.assignee" placeholder="请输入审批人"></el-input>
                        </el-form-item>
                        <el-form-item label="奖励分数" prop="rewards">
                            <el-input v-model="form.rewards" placeholder="请输入奖励分数"></el-input>
                        </el-form-item>
                        <el-form-item label="惩罚分数" prop="punishment">
                            <el-input v-model="form.punishment" placeholder="请输入惩罚分数"></el-input>
                        </el-form-item>
                        <el-form-item label="审核状态:" prop="isReviewPass">
                            <el-radio-group v-model="form.isReviewPass" style="margin-left: 30px">
                                <el-radio label="1">通过</el-radio>
                                <el-radio label="0">不通过</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="审核意见" prop="opinion">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入审核意见"
                                    v-model="form.opinion"
                            >
                            </el-input>
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

                <el-dialog title="查看审核历史" :visible.sync="dialogHisVisible">
                    <el-table size="mini" :data="checkList" v-loading.body="listLoading" border fit
                              highlight-current-row style="width: 100%" >
                        <!--<el-table-column width="35" prop="id"  ></el-table-column>-->
                        <el-table-column prop="taskName" align="center" label="任务名"></el-table-column>
                        <el-table-column prop="checkedUserName" align="center" label="审批人"></el-table-column>
                        <el-table-column prop="opinion" align="center" label="审批意见"></el-table-column>
                        <el-table-column prop="status" align="center" label="审批结果" :formatter="checkStatus"></el-table-column>
                        <el-table-column prop="variables" align="center" label="json参数"></el-table-column>
                        <el-table-column prop="creTime" align="center" label="审批时间" width="140"></el-table-column>
                    </el-table>
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
        findHisByBusId,viewProcessInstanceImage,findComming
    } from '@/api/sys/activiti/task/index';
    import { mapState } from 'vuex'
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
                dialogHisVisible: false,
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
                    opinion: undefined,
                    isReviewPass: undefined,
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
                    opinion: [{
                        required: true,
                        message: '请输入审核意见',
                        trigger: 'blur'
                    }],
                    isReviewPass: [{
                        required: true,
                        message: '请选择通过还是未通过',
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
                tableKey1: 1,
                roleList: [],
                checkList: [],
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
            ]),
            ...mapState('d2admin/user', [
                'info'
            ])
        },
        methods: {
            getList() {
                this.listLoading = true;
                findComming(this.listQuery).then(data => {
                    this.list = data.result;
                    this.total = parseInt(data.result.length);
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
            handleCheck(row) {
                this.resetTemp();
                this.form.id = row.busId;
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';
            },
            handleViewPic(row){
                viewProcessInstanceImage({busKey:row.busId}).then((res) => {
                    if(res && res.code =='200'){
                        this.imageCode = undefined;
                        this.dialogPicVisible = true;
                        this.imageCode = 'data:image/jpg;base64,' + res.result;
                    }else{
                        alert(res.message)
                    }
                });
            },

            handleViewCheckHis(row){
                findHisByBusId({busId:row.busId}).then((res) => {
                    if(res && res.code =='200'){
                        this.dialogHisVisible = true;
                        this.checkList = res.result;
                    }else{
                        alert(res.message)
                    }
                });
            },

            saveCheck(formName) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.form.busId = this.form.id;
                        this.form.variables ={ rewards: this.form.rewards, punishment:this.form.punishment };
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
                this.dialogHisVisible = false;
                this.$refs[formName].resetFields();
            },
            resetTemp() {
                this.form = {
                    username: undefined,
                    name: undefined,
                    password: undefined,
                    groupIds: [],
                    description: undefined,
                    assignee: this.info.name
                };
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
