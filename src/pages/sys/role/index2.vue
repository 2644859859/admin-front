<template>
    <d2-container>

        <div class="filter-container">
            <el-button-group>
                <el-button type="primary" size="mini" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加
                </el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑
                </el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">
                    删除
                </el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="edit" @click="handleMenu">配置菜单
                </el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="edit" @click="handleAction">
                    配置权限
                </el-button>
            </el-button-group>
        </div>


        <el-row>
            <el-col :span="5" style='margin-top:5px;padding-right: 5px'>
                <!--<el-card class="box-card" style="min-height: 550px">-->
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
                        @node-click="getNodeData"
                        :default-expanded-keys="idArr"
                        @node-expand="nodeExpand"
                        @node-collapse="nodeCollapse"
                >
                </el-tree>
                <!--  </el-card>-->
            </el-col>
            <el-col :span="19" style='margin-top:5px;'>
                <el-card class="box-card">
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" ref="form">
                        <el-form-item label="父级节点" prop="parentName">
                            <el-input v-model="form.parentName" :disabled="formEdit" placeholder="请输入父级节点" readonly
                                      class="inputColor_Blue"></el-input>
                            <el-input v-model="form.parentCode" v-if="1==2"></el-input>
                        </el-form-item>
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="form.roleName" :disabled="formEdit" placeholder="请输入字典名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input v-model="form.roleCode" :disabled="formEdit" placeholder="请输入字典编码"></el-input>
                        </el-form-item>
                        <el-form-item label="排序值" prop="dictName">
                            <el-input v-model="form.number" :disabled="formEdit" placeholder="请输入排序值"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select style="width: 120px;" v-model="form.status" :disabled="formEdit"
                                       placeholder="请选择状态">
                                <el-option v-for="item in statusType" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" :disabled="formEdit" placeholder="请输入备注"></el-input>
                        </el-form-item>
                        <el-form-item v-if="formStatus == 'update'">
                            <el-button type="primary" @click="update">更新</el-button>
                            <el-button @click="onCancel">取消</el-button>
                        </el-form-item>
                        <el-form-item v-if="formStatus == 'create'">
                            <el-button type="primary" @click="create">保存</el-button>
                            <el-button @click="onCancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="选择权限" :visible.sync="dialogAction" width="65%">
            <div style="min-height: 500px">
                <wc-tree-table-select :selected="selectedTableTree" :treeUrl="actionTreeUrl+selectRoleId"
                                      :tableUrl="actionTreeSelectTableUrl" :tableColum="selectedTableColumn"
                                      :treeProps="treeTableProper" ref="treeTableSelect"></wc-tree-table-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onCancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindAction('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择菜单" :visible.sync="dialogMenu" width="35%">
            <div style="height: 500px">
                <wc-tree-select :selected="selectedMenuTree" :url="menuTreeUrl" :treeProps="treeTableProper"
                                ref="treeMenuSelect"></wc-tree-select>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onCancel('form')">取 消</el-button>
                <el-button type="primary" @click="saveBindMenu('form')">确 定</el-button>
            </div>
        </el-dialog>

    </d2-container>
</template>
<script>
    import {
        fetchTree,
        saveObj,
        getObjById,
        delObj,
        getBindAction,
        getBindMenu,
        bindAction,
        bindMenu,
    } from '@/api/sys/role/index';
    import {mapGetters} from 'vuex';

    export default {
        name: 'dic',
        components: {
            'wc-tree-select': () => import('@/components/wc-tree-select/index'),
            'wc-tree-table-select': () => import('@/components/wc-tree-table-select/index')
        },
        data() {
            return {
                idArr: [], //树展开的id
                filename: __filename,
                filterText: '',
                formEdit: false,
                formAdd: true,
                formStatus: '',
                showElement: false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'roleName'
                },
                labelPosition: 'right',
                statusType: [{value: '', label: '请选择'}, {value: 'ENABLE', label: '启用'}, {
                    value: 'DISABLE',
                    label: '禁用'
                }],
                form: {
                    code: undefined,
                    title: undefined,
                    icon: undefined,
                    number: undefined,
                    description: undefined,
                    enabled: undefined,
                    status: 'ENABLE',
                    attr1: undefined
                },
                selectRoleId: '',
                treeTableProper: {children: 'subMenu', label: 'menuName'},
                selectedTableTree: [],
                selectedMenuTree: [],
                selectedTableColumn: [{prop: "menuName", label: "所属菜单"}, {
                    prop: "actionCode",
                    label: "权限码"
                }, {prop: "actionName", label: "权限名称"}, {prop: "url", label: "action地址"}],

                //actionTreeUrl: '/menu/getTree',
                menuTreeUrl: '/menu/getTree',
                actionTreeUrl: '/role/getMenuTreeByRoleId/',
                actionTreeSelectTableUrl: '/action/queryListByMenuId',
                dialogAction: false,
                dialogMenu: false,

                pid: -1,
                pName: undefined,
                parentCode: undefined,
                parentName: undefined,
                menuManager_btn_add: false,
                menuManager_btn_edit: false,
                menuManager_btn_del: false
            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        created() {
            this.getList();
            this.menuManager_btn_add = true /*this.elements['menuManager:btn_add']*/;
            this.menuManager_btn_del = true /*this.elements['menuManager:btn_del']*/;
            this.menuManager_btn_edit = true  /*this.elements['menuManager:btn_edit']*/;
        },
        computed: {
            ...mapGetters([
                'elements'
            ])
        },
        methods: {
            regionChange(data) {
                //alert(JSON.stringify(data))
                this.selectedRegion = data;
            },
            addIdArr(id, opr) {
                var has = false;
                for (var i = 0; i < this.idArr.length; i++) {
                    if (id === this.idArr[i]) {
                        has = true;
                        if (opr == -1) {
                            this.idArr.splice(i, 1);
                        }
                        break;
                    }
                }
                if (!has && opr == 1) {
                    this.idArr.push(id)
                }
            },
            nodeExpand(data) {
                this.addIdArr(data.id, 1);
            },
            nodeCollapse(data) {
                this.addIdArr(data.id, -1);
            },
            getList() {
                fetchTree(this.listQuery).then(data => {
                    this.treeData = data.result;
                    this.treeData.forEach(m => {
                        this.idArr.push(m.id)
                    })
                    //this.addIdArr(this.form.parentCode);
                    if (this.formStatus == 'update') {
                        this.pid = -1;
                        this.pName = undefined;
                        this.parentCode = undefined;
                        this.parentName = undefined;
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                if (data.menuName.indexOf(value) == -1) {
                    if (data.subMenu) {
                        data.subMenu.forEach((row, index) => {
                            this.filterNode(value, row)
                        })
                    }
                }
                return data;
            },
            getNodeData(data) {
                this.selectRoleId = data.id;
                if (!this.formEdit) {
                    this.formStatus = 'update';
                }
                getObjById(data.id).then(data => {
                    this.form = data.result;
                    this.pid = data.result.id;
                    this.pName = data.result.roleName;
                    this.form.parentCode = data.result.pid;
                    this.form.parentName = data.result.pid == 0 ? '根节点' : data.result.parentRoleName;
                });
                this.showElement = true;
            },
            handlerEdit() {
                if (this.form.id) {
                    this.formEdit = false;
                    this.formStatus = 'update';
                }
            },
            handlerAdd() {
                if (this.pid == -1) {
                    this.$notify({
                        title: '提示',
                        message: '请选择父角色!!',
                        type: 'info',
                        duration: 4000
                    });
                    return;
                }
                this.resetForm();
                this.formEdit = false;
                this.formStatus = 'create';
            },
            handleDelete() {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(this.pid).then(() => {
                        this.pid = -1;
                        this.getList();
                        this.resetForm();
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
            handleAction(row) {
                this.selectedTableTree = [];
                getBindAction(this.selectRoleId).then(data => {
                    if (data && data.result) {
                        this.selectedTableTree = data.result.checkedAuthList;
                    }
                    this.dialogAction = true;
                    this.$nextTick(() => {
                        this.$refs.treeTableSelect.clearSelection()
                    })
                });
            },
            handleMenu() {
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
            update() {
                saveObj(this.form).then(() => {
                    this.getList();
                    this.$notify({
                        title: '成功',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    });

                });
            },
            create() {
                saveObj(this.form).then(() => {
                    this.getList();
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    });
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
            },
            onCancel() {
                //this.formEdit = true;
                this.formStatus = '';
                this.dialogAction = false;
                this.dialogMenu = false;

            },
            resetForm() {

                this.form = {
                    code: undefined,
                    title: undefined,
                    pid: this.pid,
                    parentName: this.pName,
                    parentCode: this.pid,
                    number: undefined,
                    description: undefined,
                    status: '10',
                    enabled: undefined
                };
            }
        }
    }
</script>

