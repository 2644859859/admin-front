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
                        <!--<el-form-item label="枚举编码" prop="dictKey">
                            <el-input v-model="form.dictKey" :disabled="formEdit" placeholder="请输入枚举编码"></el-input>
                        </el-form-item>
                        <el-form-item label="枚举值" prop="dictValue">
                            <el-input v-model="form.dictValue" :disabled="formEdit"  placeholder="请输入枚举值"></el-input>
                        </el-form-item>-->
                        <el-form-item label="父级节点" prop="parentName">
                            <el-input v-model="form.parentName" :disabled="formEdit" placeholder="请输入父级节点" readonly
                                      class="inputColor_Blue"></el-input>
                            <el-input v-model="form.parentCode" v-if="1==2"></el-input>
                        </el-form-item>
                        <el-form-item label="字典名称" prop="dictName">
                            <el-input v-model="form.dictName" :disabled="formEdit" placeholder="请输入字典名称"></el-input>
                        </el-form-item>
                        <el-form-item label="字典编码" prop="dictCode">
                            <el-input v-model="form.dictCode" :disabled="formEdit" placeholder="请输入字典编码"></el-input>
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
                            <el-input v-model="form.remark" :disabled="number" placeholder="请输入备注"></el-input>
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
    </d2-container>
</template>
<style>
    .area-select {
        width: 350px !important;
    }
</style>
<script>
    import {fetchTree, saveObj, getObj, delObj} from '@/api/sys/dic/index';
    import {mapGetters} from 'vuex';

    export default {
        name: 'dic',
        data() {
            return {
                idArr: [],
                filename: __filename,
                filterText: '',
                formEdit: false,
                formAdd: true,
                formStatus: '',
                showElement: false,
                typeOptions: ['menu', 'dirt'],
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'dictName'
                },
                labelPosition: 'right',
                statusType: [{value: '', label: '请选择'}, {value: '10', label: '启用'}, {value: '20', label: '禁用'}],
                form: {
                    code: undefined,
                    title: undefined,
                    orderNum: undefined,
                    description: undefined,
                    path: undefined,
                    enabled: undefined,
                    status: '10',
                    attr1: undefined
                },
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
                if (!this.formEdit) {
                    this.formStatus = 'update';
                }
                getObj(data.id).then(data => {
                    this.form = data.result;
                    this.pid = data.result.id;
                    this.pName = data.result.dictName;
                    this.form.parentCode = data.result.pid;
                    this.form.parentName = data.result.pid == -1 ? '根节点' : data.result.parentDictName;
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
                        message: '请选择父菜单!!',
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
            onCancel() {
                //this.formEdit = true;
                this.formStatus = '';
            },
            resetForm() {
                this.form = {
                    code: undefined,
                    title: undefined,
                    pid: this.pid,
                    parentName: this.pName,
                    parentCode: this.pid,
                    orderNum: undefined,
                    description: undefined,
                    path: undefined,
                    status: '10',
                    enabled: undefined
                };
            }
        }
    }
</script>

