<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.notice']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-space>
          <a-button @click="showCreateNotify" type="outline">
            <template #icon>
              <icon-plus />
            </template>
            {{ t('notifyTable.columns.add') }}
          </a-button>
        </a-space>
      </div>
      <a-table row-key="id" :loading="loading" :pagination="false" :columns="(cloneColumns as TableColumnData[])"
        :data="renderData" :bordered="false" :size="size" @page-change="onPageChange">
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #show="{ record }">
          <a-switch :checked-value="1" :unchecked-value="0" @change="showNotify(record)" :default-checked="record.show" />
        </template>
        <template #created_at="{ record }">
          {{ formatTimestamp(record.created_at) }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="primary" @click="editNotify(record)">{{ t('notifyTable.columns.edit') }}</a-button>
            <a-popconfirm :content="t('notifyTable.columns.operations.delete_description')" @ok="deleteNotify(record)">
              <a-button type="primary" status="danger">{{ t('notifyTable.columns.delete') }}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal :width="650" :visible="notifyModal" :footer="false" :unmount-on-close="true" @cancel="closeNotify">
      <template #title>
        {{ t('notifyTable.title') }}
      </template>
      <NotifyForm :data="notifyForm" @close="closeNotify" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { PolicyParams } from '@/api/list';
import { Pagination } from '@/types/global';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import { DeleteNotify, Notify, QueryNotify, ShowNotify } from "@/api/admin/user/notify";
import NotifyForm from "@/views/admin/user/notice/components/notify-form.vue";
import { formatTimestamp } from "../../../../api/admin/public";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const notifyModal = ref(false)

const notifyForm = ref<Notify>()
const showCreateNotify = () => {
  notifyModal.value = true
}

const closeNotify = () => {
  notifyModal.value = false
  fetchData()
}

const editNotify = (value: Notify) => {
  notifyForm.value = value
  notifyModal.value = true
}


const showNotify = (value: Notify) => {
  ShowNotify({ id: value.id }).then(() => {
    fetchData()
  })
}

const deleteNotify = (value: Notify) => {
  DeleteNotify({ id: value.id }).then(() => {
    fetchData()
  })
}

const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<Notify[]>([]);
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
    title: t('notifyTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('notifyTable.columns.show'),
    dataIndex: 'show',
    slotName: 'show',
  },
  {
    title: t('notifyTable.columns.title'),
    dataIndex: 'title',
    slotName: 'title',
  }, {
    title: t('notifyTable.columns.created_at'),
    dataIndex: 'created_at',
    slotName: 'created_at',
  },
  {
    title: t('notifyTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const fetchData = async (
  params: PolicyParams = { current: 1, pageSize: 100 }
) => {
  setLoading(true);
  try {
    const { data } = await QueryNotify(params);
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
  } as unknown as PolicyParams);
};
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current });
};

fetchData();

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
  { deep: true, immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'noticeManager',
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
