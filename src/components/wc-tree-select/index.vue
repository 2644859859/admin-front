<template>
    <el-row >
      <el-col :span="24" style='margin-top:5px;padding-right: 5px'>
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
        </el-input>
        <el-tree
                class="filter-tree"
                :data="treeData"
                node-key="id"
                show-checkbox
                highlight-current
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree"
                :default-checked-keys="selected"
                :default-expanded-keys="idArr"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
    </el-row>
</template>
<script>
    import {fetchTree} from '@/api/components/common/index';
    import { mapGetters } from 'vuex';
    export default {
        name: 'wc-tree-select',
        props: {
            selected: {
                type: Array,
                required: false
            },
            url: {
                type: String,
                required: true
            }
            ,treeProps: {
                type: Object,
                required: false,
                defalut: {
                    children: 'subMenu',
                    label: 'menuName'
                }
            }
        },
        data() {
            return {
                idArr:[], //树展开的id
                filename: __filename,
                filterText: '',
                treeData: [],
                defaultProps: this.treeProps,
                form: {
                    status: 'ENABLE',
                    attr1: undefined
                },
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            selected(newValue,oldValue) {
                this.$refs.tree.setCheckedNodes(newValue)
                this.selected = newValue;
            },
        },
        created() {
            this.getTreeData();
        },
        computed: {
            ...mapGetters([
                'elements'
            ])
        },
        methods: {
            regionChange(data){
                this.selectedRegion = data;
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
            getTreeData() {
                fetchTree(this.url, null).then(data => {
                    this.treeData = data.result;
                    this.treeData.forEach(m=>{
                        this.idArr.push(m.id)
                    })
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                if(data.menuName.indexOf(value) ==-1){
                    if(data.subMenu){
                        data.subMenu.forEach((row, index) => {
                            this.filterNode(value, row)
                        })
                    }
                }
                return data;
            },
            getCheckedKeys() {
              return this.$refs.tree.getCheckedKeys();
            }
        }
    }
</script>

