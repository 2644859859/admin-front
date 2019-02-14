<template>
    <d2-container :filename="filename">
        <div class="filter-container">
            <el-button-group>
                <el-button type="primary" size="mini" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
                <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
            </el-button-group>
        </div>

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
                        :filter-node-method="filterNode"
                        ref="menuTree"
                        @node-click="getNodeData"
                        :default-expanded-keys="idArr"
                        @node-expand="nodeExpand"
                        @node-collapse="nodeCollapse"
                >
                </el-tree>
            </el-col>
            <el-col :span="19" style='margin-top:5px;'>
                <el-card class="box-card">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
                        <el-form-item label="父级节点" prop="parentBusName">
                            <el-input v-model="form.parentBusName" :disabled="formEdit" placeholder="请输入父级节点" readonly class="inputColor_Blue"></el-input>
                            <el-input v-model="form.pid" v-if="1==2"></el-input>
                        </el-form-item>
                        <el-form-item label="业务名称" prop="busName">
                            <el-input v-model="form.busName" :disabled="formEdit"  placeholder="请输入菜单名称"></el-input>
                        </el-form-item>
                        <el-form-item label="业务编码" prop="busCode">
                            <el-input v-model="form.busCode" :disabled="formEdit" placeholder="请输入菜单编码"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="number">
                            <el-input v-model="form.number" :disabled="formEdit" placeholder="请输入排序"></el-input>
                        </el-form-item>
                        <el-form-item label="操作" prop="operate" v-if="form.modelId">
                           <!-- <el-button-group>-->
                                <el-button type="primary" size="mini" v-if="menuManager_btn_add" icon="plus" @click="handlerWFModel">配置流程图</el-button>
                                <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="delete" @click="handleDeploy">发布流程</el-button>
                                <el-button type="primary" size="mini" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">查看版本</el-button>
                            <!--</el-button-group>-->
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select style="width: 120px;" v-model="form.status" :disabled="formEdit" placeholder="请选择状态">
                                <el-option v-for="item in statusType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="描述"   prop="remark">
                            <el-input v-model="form.remark" :disabled="formEdit" placeholder="请输入描述"></el-input>
                        </el-form-item>
                        <el-form-item v-if="formStatus == 'update'">
                            <el-button type="primary" @click="update">更新</el-button>
                            <!--<el-button @click="onCancel">取消</el-button>-->
                        </el-form-item>
                        <el-form-item v-if="formStatus == 'create'">
                            <el-button type="primary" @click="create">保存</el-button>
                            <!--<el-button @click="onCancel">取消</el-button>-->
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    /*import {
        fetchTree, getObj, addObj, delObj, updateObj
    } from '@/api/sys/menu/index';*/
    import {
        fetchTree,deploy, getObj, addObj, delObj, updateObj
    } from '@/api/sys/activiti/business/index';

    import { mapGetters } from 'vuex';
    export default {
        name: 'menu',
        data() {
            return {
                rootMenu:0,
                idArr:[],
                selectIconVisible:false,
                filename: __filename,
                filterText: '',
                formEdit: false,
                formAdd: true,
                formStatus: '',
                treeData: [],
                statusType: [{value:'',label:'请选择'},{value:'ENABLE',label:'启用'},{value:'DISABLE',label:'禁用'}],
                defaultProps: {
                    children: 'subBus',
                    label: 'busName'
                },
                labelPosition: 'right',
                form: {
                    parentBusName: undefined,
                    busName: undefined,
                    busCode: undefined,
                    number: undefined,
                    status: 'ENABLE',
                    remark: undefined,
                    pid: undefined
                },
                pid: -1,
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
                if (!this.formEdit) {
                    this.formStatus = 'update';
                }
                if(data.pid == 0){
                    this.resetForm();
                    this.pid = data.id;
                    this.parentBusName = data.busName;
                    this.form.parentBusName = data.busName;
                    this.form.pid =  data.id;
                    return;
                }
                getObj(data.id).then(data => {
                    this.form = data.result;
                    this.pid = data.result.id;
                    this.parentBusName = data.result.busName;
                    this.form.pid = data.result.pid;
                    this.form.parentBusName = this.pid =='1'?'根节点':data.result.parentBusName;
                });
            },
            handlerEdit() {
                if (this.form.id) {
                    this.formEdit = false;
                    this.formStatus = 'update';
                }
            },
            handleAddSys() {
                this.formStatus = 'create';
                this.resetForm();
                this.form.pid = this.rootMenu;
            },
            handlerAdd() {
                if(this.pid == -1){
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
                addObj(this.form).then(() => {
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
                addObj(this.form).then((data) => {
                    this.getList();
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.form.id = data.result.id;
                    this.form.modelId = data.result.modelId;
                    this.formStatus = 'update';
                });
            },
            onCancel() {
                //this.formEdit = true;
                this.formStatus = '';
            },
            resetForm() {
                this.form = {
                    parentBusName:  this.parentBusName,
                    busName: undefined,
                    busCode: undefined,
                    number: undefined,
                    status: 'ENABLE',
                    remark: undefined,
                    pid: this.pid
                };
            },

            handlerWFModel(){
                var newwindows = window.open ("http://localhost:18083/wf/modelEdit?key="+this.form.id+"&modelId="+this.form.modelId+"&date="+new Date(),
                    "newwindow", "height=600px, width=1400px, toolbar=no, menubar=no, scrollbars=no, resizable=no, status=no")
                newwindows.moveTo(0, 0); //将新页面打开位置定位在屏幕左上角
                newwindows.resizeTo(screen.width, screen.height); //设置新页面的大小~实际上也可以在上面的属性中设置~不过~不能最大化~原因未知~坐等牛人解答~
                if (newwindows != null) {
                    newwindows.focus();//新页面获得焦点
                }
            },
            handleDeploy(){
                deploy(this.form.modelId).then((data) => {
                    this.$notify({
                        title: '成功',
                        message: '部署成功',
                        type: 'success',
                        duration: 2000
                    });
                });
            },
        }
    }
</script>

