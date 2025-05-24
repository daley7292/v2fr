<template>
  <div class="container">
    <Breadcrumb :items="['menu.server', 'menu.server.rule']"/>
    <a-card>
      <div style="margin-bottom: 15px">
        <a-button @click="Create()" type="outline">
          <template #icon>
            <icon-plus/>
          </template>
          {{t('server.rule.create')}}
        </a-button>
      </div>
      <a-table
          row-key="id"
          :loading="loading"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="false"
          :pagination="false"
          @change="handleTableChange"
          :draggable="{ type: 'handle', width: 40 }"
      >
        <template #server_arr="{ record }">
          <a-tag v-for="(item,index) in getNodeGroupName(record)" :key="index" bordered>{{item}}</a-tag>
        </template>
        <template #operations="{ record }">
           <a-space>
             <a-button type="primary" @click="editRouter(record)">{{t('server.rule.edit')}}</a-button>
             <a-popconfirm :content="t('permission.delete')" @ok="deleteRouter(record)" type="warning">
               <a-button type="primary" status="danger">{{t('server.rule.del')}}</a-button>
             </a-popconfirm>
           </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="showRuleModal" :unmount-on-close="true" :footer="false">
      <RuleForm :data="ruleForm" @close="closeModal"/>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import { defaultServerRule, DeleteRule, QueryRule, SaveRuleSort, ServerRule } from "@/api/admin/server/rule";
import RuleForm from "@/views/admin/server/rule/components/rule-form.vue";
import {Message} from "@arco-design/web-vue";
import { PermissionGroup, QueryPermissionGroup } from "@/api/admin/server/node";
import { PlanSort } from "@/api/admin/finance/subscription";

const showRuleModal = ref<boolean>(false)

const ruleForm = ref<ServerRule>(defaultServerRule)
const closeModal = () => {
  ruleForm.value = defaultServerRule
  showRuleModal.value = false
  fetchData()
}

const editRouter = (value:ServerRule) => {
  const obj = defaultServerRule
  Object.keys(value).forEach((k:string)=>{
    obj[k] = value[k]
  })
  let arr = []
  if (obj["server_arr"]){
     obj.server_arr.split(",").forEach((v:string,index)=>{
       arr.push(v)
    })
  }
  obj.temp_server_arr = arr
  ruleForm.value = obj
  showRuleModal.value = true
}


const deleteRouter = (value:any)=>{
  DeleteRule({id:value.id}).then(r=>{
    if (r.data){
      ruleForm.value = defaultServerRule
      Message.success({
        content:t('message.delete.success')
      })
      fetchData()
    }
  })

}
const Create = () => {
  showRuleModal.value = true;
  let obj =defaultServerRule
  Object.keys(obj).forEach((k:string)=>{
    obj[k] = undefined
  })
  ruleForm.value = obj
}

type Column = TableColumnData & { checked?: true };

const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<ServerRule[]>([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('ruleTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('ruleTable.columns.name'),
    dataIndex: 'name',
  },
  {
    title: t('ruleTable.columns.domain'),
    dataIndex: 'domain',
    slotName: 'domain',
  },{
    title: t('ruleTable.columns.ua'),
    dataIndex: 'ua',
    slotName: 'ua',
  },
  {
    title: t('ruleTable.columns.server_arr'),
    dataIndex: 'server_arr',
    slotName: 'server_arr',
  },
  {
    title: t('ruleTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);


const fetchData = async () => {
  setLoading(true);
  try {
    const {data} = await QueryRule();
    renderData.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const handleTableChange = (_data) => {
  renderData.value = _data
  let sort =[]
  _data.forEach((v,index)=>{
    sort.push(v.id)
  })
  SaveRuleSort({ids:sort})
  //
}
const search = () => {
  fetchData();
};

//权限组
const permissionGroup = ref<PermissionGroup[]>([])
const queryPermissionGroup = async () => {
  const {data} = await QueryPermissionGroup()
  permissionGroup.value = data
}

queryPermissionGroup();

const getNodeGroupName =(value:any) => {
  const arr =  []
  permissionGroup.value.forEach((v:PermissionGroup) => {
    value.server_arr.split(",").forEach((groupNodeId:string) => {
      if (groupNodeId === v.id+""){
        arr.push(v.name)
      }
    })
  })
  return arr
}
fetchData();
watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    {deep: true, immediate: true}
);
</script>

<script lang="ts">
export default {
  name: 'ServerRule',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
