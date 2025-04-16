<template>
  <div class="container">
    <Breadcrumb :items="['menu.user.manager', 'menu.list.userTrafficTable']"/>
    <a-card class="general-card" :title="$t('menu.list.userTrafficTable')">
      <div style="margin: 10px 0">
         <a-alert :show-icon="false">{{t('userTrafficTable.operation.desc')}}</a-alert>
      </div>
      <a-table
          row-key="id"
          :loading="loading"
          :pagination="false"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="false"
          :size="size"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #record_at="{ record }">
          {{ formatTimestamp(record.record_at) }}
        </template>
        <template #u="{record}">
          <span v-if="(record.u/1024)<1">{{ record.u }} B</span>
          <span v-if="(record.u/1024)>=1">{{ (record.u / 1024).toFixed(2) }} KB</span>
          <span v-if="(record.u/1024/1024)>=1">{{ (record.u / 1024 / 1024).toFixed(2) }} MB</span>
          <span v-if="(record.u/1024/1024/1024)>=1">{{ (record.u / 1024 / 1024 / 1024).toFixed(2) }} GB</span>
        </template>
        <template #d="{record}">
          <span v-if="(record.d/1024)<1">{{ record.d }} B</span>
          <span v-if="(record.d/1024)>=1">{{ (record.d / 1024).toFixed(2) }} KB</span>
          <span v-if="(record.d/1024/1024)>=1">{{ (record.d / 1024 / 1024).toFixed(2) }} MB</span>
          <span v-if="(record.d/1024/1024/1024)>=1">{{ (record.d / 1024 / 1024 / 1024).toFixed(2) }} GB</span>
        </template>
        <template #server_rate="{ record }">
          <a-tag>{{ record.server_rate }}x</a-tag>
        </template>
        <template #sum="{ record }">
          <span v-if="((record.d+record.u)/1024)<1">{{ (record.d + record.u) }} B</span>
          <span v-if="((record.d+record.u)/1024)>=1">{{ ((record.d + record.u) / 1024).toFixed(2) }} KB</span>
          <span v-if="((record.d+record.u)/1024/1024)>=1">{{
              ((record.d + record.u) / 1024 / 1024).toFixed(2)
            }} MB</span>
          <span v-if="((record.d+record.u)/1024/1024/1024)>=1">{{
              ((record.d + record.u) / 1024 / 1024 / 1024).toFixed(2)
            }} GB</span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import {PolicyParams, PolicyRecord} from '@/api/list';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {UserStatTrafficLog} from "@/api/user/user/traffic";
import {formatTimestamp} from "../../../../api/admin/public";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

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
const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<PolicyRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('userTrafficTable.columns.record_at'),
    dataIndex: 'record_at',
    slotName: 'record_at',
  },
  {
    title: t('userTrafficTable.columns.u'),
    dataIndex: 'u',
    slotName: 'u',
  },
  {
    title: t('userTrafficTable.columns.d'),
    dataIndex: 'd',
    slotName: 'd',
  },
  {
    title: t('userTrafficTable.columns.server_rate'),
    dataIndex: 'server_rate',
    slotName: 'server_rate',
  },
  {
    title: t('userTrafficTable.columns.sum'),
    dataIndex: 'sum',
    slotName: 'sum',
  },
]);

const fetchData = async (
    params: PolicyParams = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await UserStatTrafficLog();
    renderData.value = data;
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
  fetchData({...basePagination, current});
};

fetchData();
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

const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
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
    {deep: true, immediate: true}
);
</script>

<script lang="ts">
export default {
  name: 'UserTraffic',
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
