<template>
    <d2-container >
        <!--<div class="filter-container">
            <el-button-group>
                <el-button type="primary" size="mini" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
            </el-button-group>
        </div>-->

        <el-row>
            <el-col :span="5" style='margin-top:5px;min-height: 450px'>
                <!-- <el-input
                         placeholder="输入关键字进行过滤"
                         v-model="filterText">
                 </el-input>-->
                <el-tree
                        class="filter-tree"
                        :data="treeData"
                        node-key="id"
                        highlight-current
                        :props="defaultProps"
                        ref="menuTree"
                        @node-click="getNodeData"
                        :default-expanded-keys="idArr"
                        @node-expand="nodeExpand"
                        @node-collapse="nodeCollapse"
                >
                </el-tree>
            </el-col>
            <el-col :span="19" style='margin-top:5px;'>
                <el-table :key='tableKey' size="mini" :data="list" v-loading.body="listLoading" border fit
                          highlight-current-row style="width: 100%" @selection-change="changeFun">
                    <el-table-column type="selection" width="35" prop="id1" @selection-change="changeFun"></el-table-column>
                    <el-table-column prop="name" align="center" label="任务名称"></el-table-column>
                    <el-table-column prop="id" align="center" label="任务id"></el-table-column>
                    <el-table-column prop="checkUser" align="center" label="审批用户"></el-table-column>
                    <el-table-column prop="checkRole" align="center" label="审批角色"></el-table-column>
                    <el-table-column align="center" label="操作" width="300">
                        <template scope="scope">
                            <el-button  size="mini" type="warning"
                                       @click="handleCheckUser(scope.row)"> 配置审批用户
                            </el-button>
                            <el-button size="mini" type="warning"
                                       @click="handleCheckRole(scope.row)"> 配置审批角色
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog title="配置审批人员" :visible.sync="dialogFormVisibleUser" width="65%">
                <div style="min-height: 500px">
                    <wc-tree-table-select :selected="selectedTableUser" :treeUrl="groupTreeUrl"
                                          :tableUrl="userSelectTableUrl" :tableColum="userSelectedTableColumn"
                                          :treeProps="treeTableProper" ref="treeTableSelectUser" queryProps="groupId" treeMutiqueryProps="1"></wc-tree-table-select>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="onCancel('form')">取 消</el-button>
                    <el-button type="primary" @click="saveNodeBindUser('form')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="配置审批角色" :visible.sync="dialogFormVisibleRole" width="65%">
                <div style="min-height: 500px">
                    <wc-tree-table-select :selected="selectedTableRole" :treeUrl="groupTreeUrl"
                                          :tableUrl="roleSelectTableUrl" :tableColum="roleSelectedTableColumn"
                                          :treeProps="treeTableProper" ref="treeTableSelectRole" queryProps="groupId" treeMutiqueryProps="1"></wc-tree-table-select>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="onCancel('form')">取 消</el-button>
                    <el-button type="primary" @click="saveNodeBindRole('form')">确 定</el-button>
                </div>
            </el-dialog>
        </el-row>
    </d2-container>
</template>

<script>
    import {
        fetchTree,deploy, getObj, addObj, delObj, updateObj
    } from '@/api/sys/activiti/business/index';
    import {
        getTaskList,nodeBindRole,nodeBindUser,getNodeBindUser,getNodeBindRole
    } from '@/api/sys/activiti/task/index';

    import { mapGetters } from 'vuex';
    export default {
        name: 'modelIndex',
        components: {
            'wc-tree-table-select': () => import('@/components/wc-tree-table-select/index'),
        },
        data() {
            return {
                rootMenu:0,
                idArr:[],
                tableKey: 0,
                listLoading: false,
                selectIconVisible:false,
                dialogFormVisibleUser: false,
                dialogFormVisibleRole: false,
                treeData: [],
                statusType: [{value:'',label:'请选择'},{value:'ENABLE',label:'启用'},{value:'DISABLE',label:'禁用'}],
                defaultProps: {
                    children: 'subBus',
                    label: 'busName'
                },
                labelPosition: 'right',
                groupTreeUrl:'/group/getTree',
                userSelectTableUrl: '/user/queryListWithPage',
                roleSelectTableUrl: '/role/queryRoleListWithPage',
                userSelectedTableColumn: [{prop: "loginName", label: "登录名"}, { prop: "userCode", label: "用户工号"
                }, {prop: "userName", label: "用户性名"}, {prop: "mobileNo", label: "手机"}, {prop: "groupName", label: "所属组织"}],
                roleSelectedTableColumn: [{prop: "roleCode", label: "角色编码"}, { prop: "roleName", label: "角色名称"
                }, {prop: "groupName", label: "所属组织"}, {prop: "remark", label: "角色描述"}],
                treeTableProper: {
                    children: 'subMenu',
                    label: 'menuName'
                },
                selectedTableRole: [],
                selectedTableUser: [],
                nodeId: undefined,
                clickTreeData: undefined,

                form: {
                    parentBusName: undefined,
                    busName: undefined,
                    busCode: undefined,
                    number: undefined,
                    status: 'ENABLE',
                    remark: undefined,
                    pid: undefined
                },
                list: undefined,
                pid: -1,
                menuManager_btn_add: false,
                menuManager_btn_edit: false,
                menuManager_btn_del: false,
                clickTreeNode:undefined
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
            addIdArr(id,opr){
                var has = false;
                for(var i = 0; i < this.idArr.length; i++){
                    if(id === this.idArr[i]){
                        has = true;
                        if(opr ==-1){
                            this.idArr.splice(i,1);
                        }
                        break;
                    }
                }
                if(!has && opr ==1){
                    this.idArr.push(id)
                }
            },
            nodeExpand(data){
                this.addIdArr(data.id, 1);
            },
            nodeCollapse(data){
                this.addIdArr(data.id, -1);
            },
            getList() {
                fetchTree().then(data => {
                    this.treeData = data.result;
                    console.info( this.treeData)
                    this.treeData.forEach(m=>{
                        this.idArr.push(m.id)
                    })
                });
            },
            getNodeData(data) {
                if(!data || (data.subBus && data.subBus.length >0)){
                    this.list = [];
                }else{
                    getTaskList({modelId:data.modelId}).then(data => {
                        this.list = data.result;
                        this.pid = data.result.id;
                        this.parentBusName = data.result.busName;
                        this.form.pid = data.result.pid;
                    });
                }
                this.clickTreeNode = data;
            },
            handleCheckUser(row) {
                getNodeBindUser({bindId:row.id}).then(data => {
                    if (data && data.result) {
                        this.selectedTableUser = data.result.alreadyBindIdSet;
                    }
                    this.$nextTick(() => {
                        this.$refs.treeTableSelectUser.clearSelection()
                    })

                    this.dialogFormVisibleUser = true;
                    this.nodeId = row.id;
                });

            },
            handleCheckRole(row) {
                getNodeBindRole({bindId:row.id}).then(data => {
                    if (data && data.result) {
                        this.selectedTableRole = data.result.alreadyBindIdSet;
                    }
                    this.$nextTick(() => {
                        this.$refs.treeTableSelectRole.clearSelection()
                    })

                    this.dialogFormVisibleRole = true;
                    this.nodeId = row.id;
                });

            },
            onCancel() {
                this.dialogFormVisibleUser = false;
                this.dialogFormVisibleRole = false;
            },
            resetForm() {
                this.form = {
                    parentBusName: this.parentBusName,
                    busName: undefined,
                    busCode: undefined,
                    number: undefined,
                    status: 'ENABLE',
                    remark: undefined,
                    pid: this.pid
                };
            },
            saveNodeBindUser() {
                nodeBindUser({
                    bindId: this.nodeId,
                    bindList: this.$refs.treeTableSelectUser.getCheckedActionKeys()
                }).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogFormVisibleUser = false;

                    this.getNodeData(this.clickTreeNode);
                });
            },
            saveNodeBindRole() {
                nodeBindRole({
                    bindId: this.nodeId,
                    bindList: this.$refs.treeTableSelectRole.getCheckedActionKeys()
                }).then(data => {
                    this.$notify({
                        title: '绑定成功',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    });
                    this.dialogFormVisibleRole = false;

                    this.getNodeData(this.clickTreeNode);
                });
            },
        }
    }
</script>

