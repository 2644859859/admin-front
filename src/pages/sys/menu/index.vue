<template>
    <d2-container :filename="filename">
  <div class="filter-container">
     <el-button-group>
    <el-button type="primary" size="mini" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
    <el-button type="primary" size="mini" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
    <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
    <el-button type="primary" size="mini" v-if="menuManager_btn_del" icon="plus" @click="handleAddSys">新增系统</el-button>
  </el-button-group>
  </div>

<el-row>
  <el-col :span="5" style='margin-top:5px;min-height: 450px'>
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
  </el-col>
  <el-col :span="19" style='margin-top:5px;'>
     <el-card class="box-card" v-if="form.pid != rootMenu">
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
        <el-form-item label="父级节点" prop="parentMenuName">
            <el-input v-model="form.parentMenuName" :disabled="formEdit" placeholder="请输入父级节点" readonly class="inputColor_Blue"></el-input>
            <el-input v-model="form.pid" v-if="1==2"></el-input>
        </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" :disabled="formEdit"  placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单编码" prop="menuCode">
          <el-input v-model="form.menuCode" :disabled="formEdit" placeholder="请输入菜单编码"></el-input>
      </el-form-item>
      <el-form-item label="菜单url" prop="url">
          <el-input prefix-icon="iconfont icon-sikaodedouding" v-model="form.url" :disabled="formEdit" placeholder="请输入菜单url"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
         <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标" readonly>
             <el-button slot="prepend" type="info"  @click="selectIcon()">
                 <d2-icon-svg  :name="form.icon" />
             </el-button>
         </el-input>
       </el-form-item>
      <el-form-item label="排序" prop="number">
          <el-input v-model="form.number" :disabled="formEdit" placeholder="请输入排序"></el-input>
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
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" @click="create">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
     </el-card>
      <el-card class="box-card" v-if="form.pid == rootMenu">
          <el-form :model="form"  ref="form" label-width="100px">
              <el-form-item label="应用名称" prop="menuName">
                  <el-input v-model="form.menuName" placeholder="请输入应用名称"></el-input>
              </el-form-item>
              <el-form-item label="应用编码" prop="menuCode">
                  <el-input v-model="form.menuCode" placeholder="请输入应用编码"></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                  <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标" readonly>
                      <el-button slot="prepend" type="info"  @click="selectIcon()">
                          <d2-icon-svg  :name="form.icon" />
                      </el-button>
                  </el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                  <el-select style="width: 120px;" v-model="form.status" :disabled="formEdit" placeholder="请选择状态">
                      <el-option v-for="item in statusType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="number">
                  <el-input v-model="form.number" :disabled="formEdit" placeholder="请输入排序"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
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
        <el-dialog title="选择图标" :visible.sync="selectIconVisible" fullscreen="true" >
            <wc-icon-select @setIcon="setIcon"></wc-icon-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectIconCancel('form')">取 消</el-button>
                <el-button type="primary" @click="selectIconuConfirm('form')">确 定</el-button>
            </div>
        </el-dialog>

    </d2-container>
</template>

<script>
import {
  fetchTree, getObj, addObj, delObj, updateObj
} from '@/api/sys/menu/index';
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
        children: 'subMenu',
        label: 'menuName'
      },
      labelPosition: 'right',
      form: {
        code: undefined,
        title: undefined,
        parentId: undefined,
        href: undefined,
        icon: 'icon-shezhi',
        orderNum: undefined,
        description: undefined,
        path: undefined,
        enabled: undefined,
        status: 'ENABLE',
        attr1: undefined
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
      setIcon(res){
        this.form.icon = res;
        this.selectIconVisible = false;
      },
    selectIconmCancel(){
        this.selectIconVisible = false;
    },
    selectIcon(){
        this.selectIconVisible = true;
    },
    selectIconuConfirm(){
        this.selectIconVisible = false;
    },
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
        this.treeData.forEach(m=>{
          this.idArr.push(m.id)
        })
      });
    },
    filterNode(value, data) {
      return data;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj(data.id).then(data => {
        this.form = data.result;
        this.pid = data.result.id;
        this.parentMenuName = data.result.menuName;
        this.form.pid = data.result.pid;
        this.form.parentMenuName = this.pid =='1'?'根节点':data.result.parentMenuName;
      });
      //this.$refs.menuElement.menuId = data.id;
      //this.$refs.menuElement.getList();
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
        /*this.form.id=this.pid;
        this.form.pid = undefined;
        this.form.parentMenuName = undefined;*/
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
      addObj(this.form).then(() => {
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
        parentMenuName: this.parentMenuName,
        href: undefined,
        icon: 'icon-shezhi',
        orderNum: undefined,
        description: undefined,
        path: undefined,
        status: 'ENABLE',
        enabled: undefined
      };
    }
  }
}
</script>

