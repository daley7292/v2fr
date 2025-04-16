<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.knowledge']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-button @click="showKnowledgeModal" type="primary">
          <icon-plus />
          {{ t('knowledgeTable.columns.add') }}
        </a-button>
      </div>
      <a-table row-key="id" :loading="loading" :pagination="false" :columns="(cloneColumns as TableColumnData[])"
        :data="renderData" :bordered="false" :size="size" @page-change="onPageChange"
        :draggable="{ type: 'handle', width: 40 }">
        <template #updated_at="{ record }">
          {{ formatTimestamp(record.updated_at) }}
        </template>
        <template #show="{ record }">
          <a-switch @change="showKnowledge(record)" :default-checked="record.show" :checked-value="1"
            :unchecked-value="0" />
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="primary" @click="editKnowledge(record)">{{ t('knowledgeTable.columns.operations.edit') }}
            </a-button>
            <a-popconfirm :content="t('knowledgeTable.columns.operations.delete_description')"
              @ok="deleteKnowledge(record)">
              <a-button type="primary" status="danger">{{ t('knowledgeTable.columns.operations.delete') }}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-drawer width="80%" :visible="knowledgeModal" @cancel="knowledgeModal = false" :footer="false"
      :unmount-on-close="true">
      <knowledge-form :id="knowledgeId" @close="closeKnowledgeModal" />
    </a-drawer>
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
import KnowledgeForm from "@/views/admin/user/knowledge/components/knowledge-form.vue";
import { DeleteKnowledge, QueryKnowledge, ShowKnowledge } from "@/api/admin/user/knowledge";
import { formatTimestamp } from "@/api/admin/public";

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
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<PolicyRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

/*
需要编辑的文档id
*/
const knowledgeId = ref()

/*
是否展示文档modal框
*/
const knowledgeModal = ref(false)


/*
展示modal框
*/
const showKnowledgeModal = () => {
  knowledgeId.value = undefined
  knowledgeModal.value = true
}


/*
关闭modal框，并刷新table数据
*/
const closeKnowledgeModal = () => {
  knowledgeModal.value = false
  fetchData()
}

/*
展示modal框，并编辑文档
*/
const editKnowledge = (value: any) => {
  knowledgeId.value = value.id
  knowledgeModal.value = true
}

/**
 * 删除文档，并刷新table
 */
const deleteKnowledge = (value: any) => {
  DeleteKnowledge({ id: value.id }).then(() => {
    fetchData()
  })
}

/**
 * 变更文档是否显示状态
 */
const showKnowledge = (value: any) => {
  ShowKnowledge({ id: value.id })
  fetchData()
}

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
});

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('knowledgeTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('knowledgeTable.columns.show'),
    dataIndex: 'show',
    slotName: 'show',
  },
  {
    title: t('knowledgeTable.columns.title'),
    dataIndex: 'title',
    slotName: 'title',
  },
  {
    title: t('knowledgeTable.columns.category'),
    dataIndex: 'category',
    slotName: 'category',
  },
  {
    title: t('knowledgeTable.columns.updated_at'),
    dataIndex: 'updated_at',
    slotName: 'updated_at',
  },
  {
    title: t('knowledgeTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async (
  params: PolicyParams = { current: 1, pageSize: 100 }
) => {
  setLoading(true);
  try {
    const { data } = await QueryKnowledge(params);
    renderData.value = data;
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
  name: 'knowledgeManager',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
