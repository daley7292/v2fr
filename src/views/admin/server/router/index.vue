<template>
  <div class="container">
    <Breadcrumb :items="['menu.server', 'menu.server.router']"/>
    <a-card>
      <div style="margin-bottom: 15px">
        <a-button @click="()=>{showRouterModal = true;routerForm = defaultServerRouter}" type="outline">
          <template #icon>
            <icon-plus/>
          </template>
          {{t('button.add.router')}}
        </a-button>
      </div>
      <a-table
          row-key="id"
          :loading="loading"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="false"
          :pagination="false"
      >
        <template #match="{ record }">
          匹配 {{ record.match.length }} 条规则
        </template>
        <template #action="{ record }">
          <span v-if="record.action == 'dns'">{{t('action.dns')}}</span>
          <span v-if="record.action == 'block'">{{t('action.block')}}</span>
        </template>
        <template #operations="{ record }">
           <a-space>
             <a-button type="primary" @click="editRouter(record)">{{t('button.edit')}}</a-button>
             <a-popconfirm :content="t('permission.delete')" @ok="deleteRouter(record)" type="warning">
               <a-button type="primary" status="danger">{{t('button.delete')}}</a-button>
             </a-popconfirm>
           </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="showRouterModal" :unmount-on-close="true" :footer="false">
      <router-form  :data="routerForm" @close="closeModal"/>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {defaultServerRouter, DeleteRouter, QueryRouter, ServerRouter} from "@/api/admin/server/router";
import RouterForm from "@/views/admin/server/router/components/router-form.vue";
import {Message} from "@arco-design/web-vue";

const showRouterModal = ref<boolean>(false)

const routerForm = ref<ServerRouter>(defaultServerRouter)
const closeModal = () => {
  routerForm.value = defaultServerRouter
  showRouterModal.value = false
  fetchData()
}

const editRouter = (value:ServerRouter) => {
  let serverRouter:ServerRouter = defaultServerRouter;
  Object.keys(value).forEach((k:string)=>{
    serverRouter[k] = value[k]
  })
  routerForm.value = serverRouter
  showRouterModal.value = true
}


const deleteRouter = (value:any)=>{
  DeleteRouter({id:value.id}).then(r=>{
    if (r.data){
      routerForm.value = defaultServerRouter
      Message.success({
        content:t('message.delete.success')
      })
    }
  })
  fetchData()
}

type Column = TableColumnData & { checked?: true };

const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<ServerRouter[]>([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('routerTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('routerTable.columns.remarks'),
    dataIndex: 'remarks',
  },
  {
    title: t('routerTable.columns.match'),
    dataIndex: 'match',
    slotName: 'match',
  },
  {
    title: t('routerTable.columns.action'),
    dataIndex: 'action',
    slotName: 'action',
  },
  {
    title: t('routerTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);


const fetchData = async () => {
  setLoading(true);
  try {
    const {data} = await QueryRouter();
    renderData.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData();
};

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
  name: 'ServerRouter',
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
