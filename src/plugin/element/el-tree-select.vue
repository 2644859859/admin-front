<template>
    <div class='el-tree-select'>
        <!-- 下拉文本 -->
        <el-select :style="styles" class="el-tree-select-input" v-model="labels" :disabled="disabled" popper-class="select-option" ref="select" v-bind="selectParams" :popper-append-to-body="false" :filterable="false" v-popover:popover @clear="_selectClearFun" @focus="_popoverShowFun">
        </el-select>
        <!-- 弹出框 -->
        <el-popover :disabled="disabled" ref="popover" :placement="placement" popper-class="el-tree-select-popper" :width="width" v-model="visible" trigger="click">
            <!-- 是否显示搜索框 -->
            <el-input v-if="treeParams.filterable" v-model="keywords" size="mini" class="input-with-select mb10" @change="_searchFun">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-scrollbar tag="div" wrap-class="el-select-dropdown__wrap" view-class="el-select-dropdown__list" class="is-empty">
                <!-- 树列表 -->
                <el-tree ref='tree' v-show="data.length>0" v-bind="treeParams" :data="data" :node-key="propsValue" :draggable="false" :current-node-key="(ids &&ids[0])||null"
                         :default-expanded-keys="expandedKeys" :show-checkbox="selectParams.multiple" :filter-node-method="_filterFun" @node-click="_treeNodeClickFun" @check="__treeCheckClickFun"></el-tree>
                <!-- 暂无数据 -->
                <div v-if="data.length===0" class="no-data">暂无数据</div>
            </el-scrollbar>
        </el-popover>
    </div>
</template>
<style>
    .el-tree-select .select-option {
        display: none !important;
    }
    .el-tree-select-popper {
        max-height: 400px;
        overflow: auto;
    }
    .el-tree-select-popper .el-button--small {
        width: 25px !important;
        min-width: 25px !important;
    }
    .el-tree-select-popper[x-placement^="bottom"] {
        margin-top: 5px;
    }
    .mb10 {
        margin-bottom: 10px;
    }
    .no-data {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #cccccc;
        text-align: center;
    }
</style>
<script>
    import { on, off } from '@/libs/util';
    export default {
        name: 'el-tree-select',
        props: {
            styles: Object, // el-select样式
            value: [String, Array], // v-model
            disabled: {
                type: Boolean,
                default () {
                    return false
                }
            },
            placement: {        // 弹出框位置
                type: String,
                default () {
                    return 'bottom'
                }
            },
            selectParams: {
                disabled: Boolean,
                placeholder: String, // 搜索框默认文字
                multiple: { // 是否多选
                    type: Boolean,
                    default () {
                        return false;
                    }
                }
            },
            treeParams: {
                'data': { // 树菜单数据
                    type: Array,
                    default () {
                        return [];
                    }
                },
                'expandedKeys': {
                    type: Array,
                    default () {
                        return [];
                    }
                },
                'props': { // 树菜单 默认数据设置
                    type: Object,
                    default () {
                        return {
                            children: 'children',
                            label: 'name',
                            value: 'flowId',
                            disabled: 'disabled'
                        };
                    }
                }
            }
        },
        data() {
            const { props, data, expandedKeys } = this.treeParams;
            const { multiple } = this.selectParams;
            return {
                propsValue: props.value || 'flowId',
                propsLabel: props.label || 'name',
                propsChildren: props.children || 'name',
                expandedKeys: expandedKeys,
                data: [...data],
                keywords: '',
                labels: multiple ? [] : '', // 存储名称，用于下拉框显示内容
                ids: [], // 存储id
                selectNodes: [], // 选中数据
                visible: false, // popover v-model
                width: 150
            };
        },
        watch: {
            'ids': function(val) {
                //alert(val)
                this._setSelectNodeFun();
            },
            'value': function(val) {
                /*alert(val)
                alert(this.ids)
                alert(this.ids !== val)
                alert(this.selectParams.multiple)*/
                if (this.ids !== val) {
                    if (this.selectParams.multiple) {
                        this.ids = val;
                    } else {
                        this.ids = val === '' ? [] : [val];
                    }
                }
            }
        },
        created() {
            if (this.selectParams.multiple) {
                if(!this.value) this.value =[];
                this.ids = this.value;
            } else {
                this.ids = [this.value];
            }
        },
        mounted() {
            this._updateH();
            on(document, 'mouseup', this._popoverHideFun);
        },
        methods: {
            // 输入文本框输入内容抛出
            _searchFun() {
                this.$emit('searchFun', this.keywords);
            },
            // 根据id筛选当前树名称，以及选中树列表
            _setSelectNodeFun() {
                const el = this.$refs.tree;
                const { multiple } = this.selectParams;
                // 长度为0，清空选择
                if (!this.ids ||this.ids.length === 0 || this.data.length === 0) {
                    this.labels = multiple ? [] : '';
                    el.setCurrentKey(null);
                    el.setCheckedKeys([])
                    return;
                }
                el.setCurrentKey(this.ids[0]);
                if (multiple) {
                    el.setCheckedKeys(this.ids);
                    this.labels = el.getCheckedNodes().map(item => item[this.propsLabel]) || [];
                } else {
                    if (el.getCurrentNode()) {
                        this.labels = el.getCurrentNode()[this.propsLabel];
                    } else {
                        this.labels = '';
                    }
                }
            },
            // 树过滤
            _filterFun(value, data, node) {
                if (!value) return true;
                return data[this.propsLabel].indexOf(value) !== -1;
            },
            // 树点击
            _treeNodeClickFun(data, node, vm) {
                //alert(JSON.stringify(data)+"--"+this.propsChildren)
                var children = data[this.propsChildren];
                if(!children || children.length ==0){
                    this.ids = [data[this.propsValue]];
                    this._emitFun();
                    this.$emit('node-click', data, node, vm);
                    this.visible = false;
                }
            },
            // 树勾选
            __treeCheckClickFun(data, node, vm) {
                this.ids = [];
                node.checkedNodes.forEach(item => {
                    this.ids.push(item[this.propsValue]);
                });
                this._emitFun();
            },
            // 下拉框清空数据
            _selectClearFun() {
                const { multiple } = this.selectParams;
                const el = this.$refs.tree;
                this.ids = [];
                if (multiple) {
                    this.labels = [];
                    el.setCheckedKeys([]);
                } else {
                    this.labels = '';
                    el.setCurrentKey(null);
                }
                this.$emit('input', this.labels);
                this.$emit('select-clear');
            },
            // 判断类型，抛出当前选中id
            _emitFun() {
                const { multiple } = this.selectParams;
                if (multiple) {
                    this.$emit('input', this.ids);
                } else {
                    this.$emit('input', this.ids[0]);
                }
            },
            // 更新宽度
            _updateH() {
                this.$nextTick(() => {
                    this.width = this.$refs.select.$el.getBoundingClientRect().width;
                });
            },
            // 显示弹出框的时候容错，查看是否和el宽度一致
            _popoverShowFun() {
                if (this.width === 0) {
                    this._updateH();
                }
            },
            // 判断是否隐藏弹出框
            _popoverHideFun(e) {
                let isInter = e.path.some(list => {
                    return list.className && list.className.indexOf('el-tree-select') !== -1;
                });
                if (!isInter) {
                    this.visible = false;
                }
            },
            // 树列表更新数据
            treeDataUpdateFun(data) {
                this.data = data;
                // 数据更新完成之后，判断是否回显内容
                setTimeout(() => {
                    this._setSelectNodeFun();
                }, 1000);
            },
            // 本地过滤方法
            filterFun(val) {
                this.$refs.tree.filter(val)
            }
        },
        components: {},
        beforeDestroy() {
            off(document, 'mouseup', this._popoverHideFun);
        }
    };
</script>