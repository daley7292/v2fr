<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.work_order']" />
    <a-card>
      <div style="margin-bottom: 15px;display: flex;">
        <a-switch style="width: 120px;text-align: center" type="round" v-model="status" @change="search()" :checked-value="0" :unchecked-value="1"
          :checked-text="t('ticketTable.actions.turned_on')" :unchecked-text="t('ticketTable.actions.closed')" />
        <div style="width: 100%"></div>
        <a-input style="width: 180px" v-model="email" :placeholder="t('ticketTable.actions.email.input')" @input="queryTicket" />
      </div>
      <a-table row-key="id" :loading="loading" :pagination="pagination" :columns="(cloneColumns as TableColumnData[])"
        :data="renderData" :bordered="false" :size="size" @page-change="onPageChange">
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #level="{ record }">
          <span v-if="record.level === 2">{{ t('ticketTable.actions.high') }}</span>
          <span v-if="record.level === 1">{{ t('ticketTable.actions.middle') }}</span>
          <span v-if="record.level === 0">{{ t('ticketTable.actions.low') }}</span>
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 1">{{ t('ticketTable.actions.closed') }}</span>
          <span v-if="record.status === 0 && record.reply_status === 0">{{ t('ticketTable.actions.replied') }}</span>
          <span
            v-if="record.status === 0 && record.reply_status === 1">{{ t('ticketTable.actions.waiting_for_processing') }}</span>
        </template>
        <template #updated_at="{ record }">
          {{ formatTimestamp(record.updated_at) }}
        </template>
        <template #created_at="{ record }">
          {{ formatTimestamp(record.created_at) }}
        </template>
        <template #operations="{ record }">
          <a-space>
          <a-button @click="openWindow(record.id)">{{ t('ticketTable.actions.see_details') }}</a-button>
          <a-button type="primary" @click="closeTicket(record.id)"
            :disabled="record.status === 1">{{ t('ticketTable.actions.close') }}</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { PolicyParams, PolicyRecord } from '@/api/list';
import { Pagination } from '@/types/global';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import { CloseTicket, QueryTicket } from "@/api/admin/user/ticket";
import { formatTimestamp } from "../../../../api/admin/public";
import { adminUrl } from "@/utils/admin-url";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const status = ref<number>(0)

const openWindow = (id: any) => {
  const iHeight = 720
  const iWidth = 520
  //获得窗口的垂直位置
  const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
  //获得窗口的水平位置
  const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
  window.open(`${adminUrl}/#/ticket/chat?id=${  id}`, '工单', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
}

const closeTicket = (id: any) => {
  CloseTicket({ id: id }).then(() => {
    fetchData()
  })
}

const generateFormModel = () => {
  return {
    number: '',
    name: '',
    contentType: '',
    filterType: '',
    createdTime: [],
    status: '',
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<PolicyRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

const email =ref<string>();

const basePagination: Pagination = {
  current: 1,
  pageSize: 100,
};
const pagination = reactive({
  ...basePagination,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [100, 500, 1000],

});



const columns = computed<TableColumnData[]>(() => [
  {
    title: t('ticketTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  }, {
    title: t('ticketTable.columns.subject'),
    dataIndex: 'subject',
    slotName: 'subject',
  }, {
    title: t('ticketTable.columns.level'),
    dataIndex: 'level',
    slotName: 'level',
  }, {
    title: t('ticketTable.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
  }, {
    title: t('ticketTable.columns.created_at'),
    dataIndex: 'created_at',
    slotName: 'created_at',
  }, {
    title: t('ticketTable.columns.updated_at'),
    dataIndex: 'updated_at',
    slotName: 'updated_at',
  },
  {
    title: t('ticketTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const queryTicket = (value: string) => {
  fetchData({pageSize:basePagination.pageSize,current:1})
}

const fetchData = async (
  params: PolicyParams
) => {
  if (!params){
    params = {...basePagination}
  }
  setLoading(true);
  try {
    params.email = email.value
    params.status = status.value
    const { data, total } = await QueryTicket(params);
    renderData.value = data;
    pagination.current = params.current;
    basePagination.current = params.current;
    pagination.total = total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value,
  } as unknown as PolicyParams);
};
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current });
};

fetchData(basePagination);
const reset = () => {
  formModel.value = generateFormModel();
};
const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter(
      (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};


watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  { deep: true, immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'ticketManager',
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
