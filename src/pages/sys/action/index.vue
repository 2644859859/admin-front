<template>
    <d2-container :filename="filename">
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
                    <el-button-group>
                        <el-button type="primary" size="mini" v-if="menuManager_btn_add" icon="plus"
                                   @click="handlerAdd">添加
                        </el-button>
                        <!--<el-button type="primary" size="mini" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>-->
                        <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="delete"
                                   @click="handleBatchDelte">删除
                        </el-button>
                        <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="plus"
                                   @click="handleAddClass">类名
                        </el-button>
                    </el-button-group>
                </div>
                <el-table :key='tableKey' size="mini" :data="list" v-loading.body="listLoading" border fit
                          highlight-current-row style="width: 100%" @selection-change="changeFun"  >
                    <el-table-column type="selection" width="35" prop="id"
                                     @selection-change="changeFun"></el-table-column>
                    <el-table-column prop="actionCode" align="center" width="200" label="权限码"></el-table-column>
                    <el-table-column prop="actionName" align="center" label="权限名称"></el-table-column>

                    <el-table-column prop="url" align="center" width="250" label="action地址"></el-table-column>

                    <el-table-column prop="menuName" align="center" label="所属菜单"></el-table-column>
                    <el-table-column prop="menuId" align="center" v-if="1==2" label="所属菜单id"></el-table-column>
                    <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
                    <!--<el-table-column prop="lastOperator" align="center" width="100"  label="最后更新人"></el-table-column>-->
                    <!--<el-table-column prop="creator" align="center" label="创建人"></el-table-column>-->
                    <el-table-column prop="status" align="center" label="状态"
                                     :formatter="formatStatus"></el-table-column>
                    <!--<el-table-column prop="remark" align="center" label="备注"></el-table-column>-->

                    <el-table-column align="center" label="操作" width="150">
                        <template scope="scope">
                            <el-button v-if="actionManager_btn_edit" size="mini" type="success"
                                       @click="handleUpdate(scope.row)"> 编辑
                            </el-button>
                            <el-button v-if="actionManager_btn_del" size="mini" type="danger"
                                       @click="handleDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
                    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                        <el-form-item label="所属菜单" prop="menuName">
                            <el-input v-model="form.menuName" placeholder="请输入所属菜单" readonly></el-input>
                            <el-input v-model="form.menuId" v-if="1==2" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="权限码" prop="actionCode">
                            <el-input v-model="form.actionCode" placeholder="请输入权限码"></el-input>
                        </el-form-item>
                        <el-form-item label="权限名称" prop="actionName">
                            <el-input v-model="form.actionName" placeholder="请输入权限名称"></el-input>
                        </el-form-item>
                        <el-form-item label="action地址" prop="url">
                            <el-input v-model="form.url" placeholder="请输入用户性名"></el-input>
                        </el-form-item>
                        <el-form-item label="状态:" prop="status">
                            <el-select style="width: 120px;" v-model="form.status" placeholder="请选择状态">
                                <el-option v-for="item in statusValue" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel('form')">取 消</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="save('form')">确 定</el-button>
                        <el-button v-else type="primary" @click="save('form')">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog :title="'根据类自动生成添加权限列表：'+clickMenu.menuName" :visible.sync="dialogClassVisible">
                    <el-form :model="formClass" :inline="true" ref="formClass" label-width="100px" size="medium">
                        <el-form-item label="Controller类" prop="menuName">
                            <el-input v-model="formClass.className" style="width:480px"
                                      placeholder="请输入Controller类名 例如com.wc.admin.control.RoleController"></el-input>
                        </el-form-item>
                        <el-button size="small" class="filter-item" type="primary" v-waves icon="search" @click="handleFind" ><d2-icon name="search"/> 搜索</el-button>
                    </el-form>
                    <el-table :key='tableKey' size="mini" :data="actionListToSelect" v-loading.body="listLoading" border fit
                              highlight-current-row style="width: 100%" @selection-change="changeFunActionSelect" :row-class-name="rowClass">
                        <el-table-column type="selection" width="35" prop="id"
                                         @selection-change="changeFun"></el-table-column>
                        <el-table-column prop="actionCode" align="center" width="200" label="权限码"></el-table-column>
                        <el-table-column prop="actionName" align="center" label="权限名称"></el-table-column>

                        <el-table-column prop="url" align="center" width="250" label="action地址"></el-table-column>
                    </el-table>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelClass('form')">取 消</el-button>
                        <el-button type="primary" @click="saveClass('formClass')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import {
        fetchTree
    } from '@/api/sys/menu/index';

    import {
        page, saveObj, saveObjClass, getObj, delObj, delObjBatch,findClassAction
    } from '@/api/sys/action/index';


    import {mapGetters} from 'vuex';

    export default {
        name: 'action',
        data() {
            return {
                filename: __filename,
                filterText: '',
                list: null,
                formEdit: true,
                formAdd: true,
                formStatus: '',
                dialogFormVisible: false,
                dialogClassVisible: false,
                treeData: [],
                multipleSelection: [],
                dialogStatus: '',
                listLoading: false,
                statusValue: [{value: 'ENABLE', label: '启用'}, {value: 'DISABLE', label: '禁用'}],
                defaultProps: {
                    children: 'subMenu',
                    label: 'menuName'
                },
                tableKey: 0,
                labelPosition: 'right',
                idArr: [],
                form: {
                    actionCode: undefined,
                    actionName: undefined,
                    createdTime: undefined,
                    lastOperator: undefined,
                    menuId: undefined,
                    menuName: "",
                    status: 'ENABLE',
                    url: undefined
                },
                textMap: {
                    update: '编辑权限',
                    create: '创建权限'
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
                    }]
                },
                clickMenu: {menuName:''},
                formClass: {className: ''},
                actionManager_btn_edit: true,
                actionManager_btn_del: true,

                selectActions: [],
                actionListToSelect: []

            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        created() {
            this.getList();
            this.menuManager_btn_add = true   /*this.elements['menuManager:btn_add']*/;
            this.menuManager_btn_del = true   /*this.elements['menuManager:btn_del']*/;
            this.menuManager_btn_edit = true  /*this.elements['menuManager:btn_edit']*/;
        },
        computed: {
            ...mapGetters([
                'elements'
            ])
        },
        methods: {
            getList() {
                fetchTree(this.listQuery).then(data => {
                    this.treeData = data.result;
                    this.treeData.forEach(m => {
                        this.idArr.push(m.id)
                    })
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                /*if(data.menuName.indexOf(value) ==-1){
                    if(data.subMenu){
                        data.subMenu.forEach((row, index) => {
                            this.filterNode(value, row)
                        })
                    }
                }*/
                return data;
            },
            getActionList() {
                page({menuIdList: [this.clickMenu ? this.clickMenu.id : -1], pageSize: 100}).then(data1 => {
                    this.list = data1.result.list;
                    this.total = parseInt(data1.result.total);
                    this.listLoading = false;
                });
            },
            getNodeData(data) {
                this.clickMenu = data;
                this.getActionList();
            },
            handleUpdate(row) {
                getObj(row.id).then(data => {
                    this.form = data.result;
                    this.form.menuName = row.menuName;
                    this.dialogFormVisible = true;
                    this.dialogStatus = 'update';
                });
            },
            handlerAdd() {
                if (!this.clickMenu || this.clickMenu.menuName == '' || this.clickMenu.hasMenu == true) {
                    this.$notify({
                        title: '提示',
                        message: this.clickMenu ? '只能选择(最底层)菜单!' : '请选择所属菜单!!',
                        type: 'info',
                        duration: 4000
                    });
                    return;
                }
                this.resetForm();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
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
                        this.getActionList();
                        this.multipleSelection = [];
                    });
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(row.id).then(() => {
                        this.getActionList();
                        //this.resetForm();
                        this.onCancel();
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                    });
                });
            },
            handleAddClass() {
                let errMsg = '';
                if (!this.clickMenu || this.clickMenu.menuName == '') {
                    errMsg = '请先选中左边的菜单';
                }else if(this.clickMenu.hasMenu){
                    errMsg = '选中的菜单不能有子菜单';
                }
                if(errMsg != ''){
                    this.$notify({
                        title: '提示',
                        message: errMsg,
                        type: 'info',
                        duration: 2000
                    });
                    return false;
                }
                this.dialogClassVisible = true;

            },
            save(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.form.menuIdList = [this.form.menuId];
                        saveObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getActionList()
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
            saveClass(formName) {

                saveObjClass({
                    url: this.formClass.className,
                    menuId: this.clickMenu.id,
                    menuName: this.clickMenu.menuName,
                    actionList: this.selectActions
                }).then(() => {
                    this.dialogClassVisible = false;
                    this.getActionList()
                    this.$notify({
                        title: '成功',
                        message: '根据类名自动加成功',
                        type: 'success',
                        duration: 2000
                    });
                })
            },
            changeFun(val) {
                this.multipleSelection = val;
            },
            onCancel() {
                this.formEdit = true;
                this.formStatus = '';
            },
            formatStatus(row, column) {
                return row.status === 'ENABLE' ? '启用' : row.status === 'DISABLE' ? '禁用' : '未知'
            },
            cancel(formName) {
                this.dialogFormVisible = false;
            },
            cancelClass(formName) {
                this.dialogClassVisible = false;
            },

            resetForm() {
                this.form = {
                    menuId: this.clickMenu ? this.clickMenu.id : undefined,
                    actionCode: undefined,
                    actionName: undefined,
                    url: undefined,
                    status: undefined,
                    status: 'ENABLE',
                    menuName: this.clickMenu ? this.clickMenu.menuName : undefined,
                }

            },

            changeFunActionSelect(val){
                this.selectActions= val;
            },
            handleFind(){
                if (this.formClass.className == '') {
                    this.$notify({
                        title: '提示',
                        message: '类名为空',
                        type: 'info',
                        duration: 2000
                    });
                    return false;
                }
                if (!this.clickMenu) {
                    this.$notify({
                        title: '提示',
                        message: '请先选中菜单',
                        type: 'info',
                        duration: 2000
                    });
                    return false;
                }
                findClassAction({url:this.formClass.className}).then((data) => {
                    let urls = this.list.map(item => item.url) || [];
                    let dataRows = [];
                    data.result.map(function(item,key,ary) {
                    //data.result.foreach(function(v,k) {
                        if(urls.indexOf(item.url) == -1){
                            dataRows.push(item);
                        }
                    });
                    this.actionListToSelect = dataRows;
                })
            },
            rowClass ( { row, rowIndex } ) {
                /*let urls = this.list.map(item => item.url) || [];
                if(urls.indexOf(row.url) > -1){
                    return 'bacColor317eb0';
                }*/
            }
        },

    }
</script>
<style>
    .bacColor317eb0{
        background: #ebeef5 !important;
    }
</style>

