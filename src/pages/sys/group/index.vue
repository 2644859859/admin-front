<template>
    <d2-container :filename="filename">
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
                        @node-click="getNodeData"
                        default-expand-all
                >
                </el-tree>
            </el-col>
            <el-col :span="19" style='margin-top:5px;'>
                <el-card class="box-card">
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" ref="form">
                        <el-col :span="12" style='margin-top:5px;'>
                            <el-form-item label="父级节点" prop="parentName">
                                <el-input v-model="form.parentGroupName" :disabled="formEdit" placeholder="请输入父级节点"
                                          readonly class="inputColor_Blue"></el-input>
                                <el-input v-model="form.parentGroupCode" v-if="1==2"></el-input>
                            </el-form-item>
                            <el-form-item label="组织编码" prop="groupCode">
                                <el-input v-model="form.groupCode" :disabled="formEdit"
                                          placeholder="请输入组织编码"></el-input>
                            </el-form-item>
                            <el-form-item label="组织名称" prop="groupName">
                                <el-input v-model="form.groupName" :disabled="formEdit"
                                          placeholder="请输入组织名称"></el-input>
                            </el-form-item>
                            <el-form-item label="组织类型" prop="type">
                                <el-select style="width: 120px;" v-model="form.type" :disabled="formEdit"
                                           placeholder="请选择状态">
                                    <el-option v-for="item in groupType" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系人" prop="contact">
                                <el-input v-model="form.contact" :disabled="formEdit" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                            <el-form-item v-if="formStatus == 'update'">
                                <el-button type="primary" @click="update">更新</el-button>
                                <el-button @click="onCancel">取消</el-button>
                            </el-form-item>
                            <el-form-item v-if="formStatus == 'create'">
                                <el-button type="primary" @click="create">保存</el-button>
                                <el-button @click="onCancel">取消</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style='margin-top:5px;'>
                            <!--<el-form-item label="省/市/区/街" prop="remark">
                                <v-region @values="regionChange" :town="true" :selected="selected" ></v-region>
                            </el-form-item>-->
                            <!--<el-form-item label="省/市/区" prop="remark">
                                &lt;!&ndash;<area-select v-model="val2" level={2} :data="pcaa"></area-select>&ndash;&gt;
                                <area-cascader v-model="selected" :data="pcaa" :level='1'></area-cascader>
                            </el-form-item>-->
                            <!--<el-form-item label="城市编码" prop="cityId">
                                <el-input v-model="form.cityId" :disabled="formEdit" placeholder="请输入城市编码"></el-input>
                            </el-form-item>
                            <el-form-item label="区名称" prop="areaName">
                                <el-input v-model="form.areaName" :disabled="formEdit" placeholder="请输入区编码"></el-input>
                            </el-form-item>
                            <el-form-item label="区编码" prop="areaId">
                                <el-input v-model="form.areaId" :disabled="formEdit" placeholder="请输入区编码"></el-input>
                            </el-form-item>-->
                            <!--<el-form-item label="街道名称" prop="streetName">
                                <el-input v-model="form.streetName" :disabled="formEdit" placeholder="请输入街道编码"></el-input>
                            </el-form-item>
                            <el-form-item label="街道编码" prop="streetId">
                                <el-input v-model="form.streetId" :disabled="formEdit" placeholder="请输入街道编码"></el-input>
                            </el-form-item>-->
                            <el-form-item label="联系人手机号" prop="contactPhone">
                                <el-input v-model="form.contactPhone" :disabled="formEdit"
                                          placeholder="请输入联系人手机号"></el-input>
                            </el-form-item>
                            <el-form-item label="详细地址" prop="detailAddress">
                                <el-input v-model="form.detailAddress" :disabled="formEdit"
                                          placeholder="请输入详细地址"></el-input>
                            </el-form-item>
                            <el-form-item label="描述" prop="remark">
                                <el-input v-model="form.remark" :disabled="formEdit" placeholder="请输入描述"></el-input>
                            </el-form-item>
                        </el-col>
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
    import {fetchTree, saveObj, getObj, delObj} from '@/api/sys/group/index';
    /*import {pca, pcaa} from 'area-data';*/
    import {mapGetters} from 'vuex';

    export default {
        name: 'group',
        data() {
            return {
                filename: __filename,
                filterText: '',
                list: null,
                total: null,
                formEdit: true,
                formAdd: true,
                formStatus: '',
                showElement: false,
                listQuery: {
                    name: undefined
                },
                treeData: [],
                defaultProps: {
                    children: 'subMenu',
                    label: 'menuName'
                },
                labelPosition: 'right',
                groupType: [{value: '', label: '请选择'}, {value: 'benbu', label: '本部'}, {value: 'waidi', label: '外地'}],
                form: {
                    code: undefined,
                    title: undefined,
                    parentId: undefined,
                    href: undefined,
                    icon: undefined,
                    orderNum: undefined,
                    description: undefined,
                    path: undefined,
                    enabled: undefined,
                    type: undefined,
                    attr1: undefined
                },
                pid: -1,
                pName: "",
                parentCode: undefined,
                parentName: undefined,
                area: [],
               //pcaa: pcaa,
                selectedRegion: undefined,
                selected: undefined,
                placeholder: ['选择省', '选择市', '选择区'],
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
            getList() {
                fetchTree(this.listQuery).then(data => {
                    this.treeData = data.result;
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
                    this.pName = data.result.groupName;
                    this.parentCode = data.result.parentGroupCode;
                    this.parentName = data.result.parentGroupName;
                    this.selected = {
                        province: data.result.provinceId,
                        city: data.result.cityId,
                        area: data.result.areaId,
                        town: data.result.streetId
                    };
                });
                this.showElement = true;
                //this.$refs.menuElement.menuId = data.id;
                //this.$refs.menuElement.getList();
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
                this.setRegion();
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
                this.setRegion();
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
                this.formEdit = true;
                this.formStatus = '';
            },
            setRegion() {
                if (this.selectedRegion) {
                    this.form.provinceName = this.selectedRegion.province.value;
                    this.form.provinceId = this.selectedRegion.province.key;
                    this.form.cityName = this.selectedRegion.city.value;
                    this.form.cityId = this.selectedRegion.city.key;
                    this.form.areaName = this.selectedRegion.area.value;
                    this.form.areaId = this.selectedRegion.area.key;
                    this.form.streetName = this.selectedRegion.town.value;
                    this.form.streetId = this.selectedRegion.town.key;
                    this.form.addressList = [this.form.provinceId, this.form.cityId, this.form.areaId, this.form.streetId];
                }
            },
            resetForm() {
                this.form = {
                    code: undefined,
                    title: undefined,
                    pid: this.pid,
                    parentGroupName: this.pName,
                    parentGroupCode: this.parentCode,
                    href: undefined,
                    icon: undefined,
                    orderNum: undefined,
                    description: undefined,
                    path: undefined,
                    enabled: undefined
                };
                this.selectedRegion = undefined;
                this.selected = {province: 0, city: null, area: null, town: null};
            }
        }
    }
</script>

