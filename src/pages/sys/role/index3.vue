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
                        <el-button size="mini" class="filter-item" v-if="selectOpr" style="margin-left: 10px;" @click="selectUser" type="primary" icon="reset">确定</el-button>
                        <el-button size="mini" class="filter-item" v-if="roleManager_btn_add" style="margin-left: 10px;" @click="resetFilter" type="primary" icon="reset">重置</el-button>
                        <el-button size="mini" class="filter-item" v-if="!selectOpr && roleManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
                        <el-button size="mini" class="filter-item" v-if="!selectOpr && roleManager_btn_add" style="margin-left: 10px;" @click="handleBatchDelte" type="primary" icon="edit">删除</el-button>
                    </el-form>
                </div>
                <el-table :key='tableKey' size="mini" :data="list" v-loading.body="listLoading" border fit
                          highlight-current-row style="width: 100%" @selection-change="changeFun">
                    <el-table-column type="selection" width="35" prop="id" @selection-change="changeFun"></el-table-column>
                    <el-table-column prop="roleCode" width="200px" align="center" label="角色编码"></el-table-column>
                    <el-table-column prop="roleName"align="center" label="角色名称"></el-table-column>
                    <el-table-column prop="remark" align="center" label="角色描述"></el-table-column>
                    <el-table-column prop="updateTime" align="center" label="最后更新时间"></el-table-column>
                    <el-table-column prop="lastOperator"align="center" label="最后更新人"></el-table-column>
                    <el-table-column prop="creator" width="170px" align="center" label="创建人"></el-table-column>
                    <el-table-column prop="status" width="80px" align="center" label="状态" :formatter="formatStatus"></el-table-column>

                    <el-table-column align="center" label="操作" width="150">
                        <template scope="scope">
                            <el-button v-if="actionManager_btn_edit" size="mini" type="success" @click="handleUpdate(scope.row)"> 编辑 </el-button>
                            <el-button v-if="actionManager_btn_del" size="mini" type="danger" @click="handleDelete(scope.row)">删除 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout=" prev, pager, next, jumper,sizes,total" :total="total"> </el-pagination>
                </div>

                <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
                    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
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
    </d2-container>
</template>

<script>
    import {fetchTree} from '@/api/sys/group/index';
   /* import {
        page, saveObj, saveObjClass, getObj, delObj, delObjBatch
    } from '@/api/sys/action/index';*/

    import { page, addObj, getObj, delObj, delObjBatch, putObj } from '@/api/sys/role';

    import {mapGetters} from 'vuex';

    export default {
        name: 'action',
        data() {
            return {
                filterText: '',
                list: null,
                formEdit: true,
                formAdd: true,
                formStatus: '',
                dialogFormVisible: false,
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
                    code: undefined,
                    name: undefined,
                    description: undefined,
                    status: 'ENABLE',
                },
                textMap: {
                    update: '编辑角色',
                    create: '创建角色'
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
                listQuery: {
                    pageSize: 20,
                    pageNum: 1,
                    roleName: undefined,
                    roleCode: undefined,
                    remark: undefined,
                    updateTime: undefined,
                    updateTimeR: undefined
                },
                clickMenu: undefined,
                actionManager_btn_edit: true,
                actionManager_btn_del: true
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
                fetchTree(null).then(data => {
                    this.treeData = data.result;
                    this.treeData.forEach(m => {
                        this.idArr.push(m.id)
                    })
                });
            },
            filterNode(value, data) {
                return data;
            },


            getRoleList() {
                page(this.listQuery).then(data1 => {
                    this.list = data1.result.list;
                    this.total = parseInt(data1.result.total);
                    this.listLoading = false;
                });
            },
            getNodeData(data) {
                this.clickMenu = data;
                this.getRoleList();
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
                if (!this.clickMenu || this.clickMenu.hasMenu == true) {
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
                saveObjClass({
                    url: this.formClass.className,
                    menuId: this.clickMenu.id,
                    menuName: this.clickMenu.menuName
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

            }
        }
    }
</script>

