<template>
  <div>
    <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(columns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
      <template #record_at="{record}">
        {{ formatTimestamp(record.record_at) }}
      </template>
      <template #u="{record}">
        <span v-if="(record.u/1024)<1">{{ record.u }} B</span>
        <span v-if="(record.u/1024)>=1">{{ (record.u/1024).toFixed(2) }} KB</span>
        <span v-if="(record.u/1024/1024)>=1">{{ (record.u/1024/1024).toFixed(2) }} MB</span>
        <span v-if="(record.u/1024/1024/1024)>=1">{{ (record.u/1024/1024/1024).toFixed(2) }} GB</span>
      </template>
      <template #d="{record}">
        <span v-if="(record.d/1024)<1">{{ record.d }} B</span>
        <span v-if="(record.d/1024)>=1">{{ (record.d/1024).toFixed(2) }} KB</span>
        <span v-if="(record.d/1024/1024)>=1">{{ (record.d/1024/1024).toFixed(2) }} MB</span>
        <span v-if="(record.d/1024/1024/1024)>=1">{{ (record.d/1024/1024/1024).toFixed(2) }} GB</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import {PolicyParams} from '@/api/list';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {formatTimestamp} from "@/api/admin/public";
import {NetworkRecord, QueryUserNetworkRecord} from "@/api/admin/user/user";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
const props = defineProps(['userid'])

const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<NetworkRecord[]>([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

const basePagination: Pagination = {
  current: 1,
  pageSize: 100,
};
const pagination = reactive({
  ...basePagination,
});
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('userNetworkTable.columns.record_at'),
    dataIndex: 'record_at',
    slotName: 'record_at',
  },
  {
    title: t('userNetworkTable.columns.u'),
    dataIndex: 'u',
    slotName: 'u',
  },
  {
    title: t('userNetworkTable.columns.d'),
    dataIndex: 'd',
    slotName: 'd',//状态
  },
  {
    title: t('userNetworkTable.columns.server_rate'),
    dataIndex: 'server_rate',
    slotName: 'server_rate',
  },
]);
const fetchData = async (
    params: PolicyParams = {current: 1, pageSize: 10}
) => {
  setLoading(true);
  try {
    params.user_id = props.userid
    const {data, total} = await QueryUserNetworkRecord(params);
    renderData.value = data;
    pagination.current = params.current
    pagination.total = total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData({
    ...basePagination,
  } as unknown as PolicyParams);
};
const onPageChange = (current: number) => {
  fetchData({...basePagination, current});
};

fetchData();
const reset = () => {
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
