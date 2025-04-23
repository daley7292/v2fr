<template>
  <div class="container">
    <Breadcrumb :items="['menu.finance', 'menu.finance.convert']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-button type="outline" @click="addConvert()">
          <template #icon>
            <icon-plus />
          </template>
          {{ t('add.finance.convert') }}
        </a-button>
      </div>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
        @page-size-change="pageSizeChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #is_invitation="{ record }">
          {{
            record.is_invitation == 1
              ? t('add.finance.is_invitation')
              : t('add.finance.not_invitation')
          }}
        </template>
        <template #end_at="{ record }">
          {{ formatTimestamp(record.end_at) }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="primary" @click="editConvert(record)"
              >{{ t('button.edit') }}
            </a-button>
            <a-button type="primary" @click="recordConvert(record)"
              >{{ t('button.record') }}
            </a-button>
            <a-button type="primary" status="danger" @click="deleteConvert(record.id
            )"
            >{{ t('button.delete') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :width="580"
      :visible="showAddConvertModal"
      @cancel="
        () => {
          showAddConvertModal = false;
        }
      "
      :footer="false"
      :unmount-on-close="true"
    >
      <template #title>
        {{ t('add.finance.convert') }}
      </template>
      <convert-form :data="convertForm" @close="closeModal" />
    </a-modal>
    <a-modal
      width="970px"
      :visible="showAddConvertRecordModal"
      @cancel="
        () => {
          showAddConvertRecordModal = false;
        }
      "
      :footer="false"
      :unmount-on-close="true"
    >
      <template #title>
        {{ t('add.finance.convert.record') }}
      </template>
      <convert-record :code="convertCode" @close="closeRecordModal" />
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
  import ConvertForm from '@/views/admin/finance/convert/components/convert-form.vue';
  import ConvertRecord from '@/views/admin/finance/convert/components/convert-record.vue';
  import {
    QueryConvert,
    Convert,
    defaultConvert,
    DeleteConvert,
  } from '@/api/admin/finance/convert';
  import { formatTimestamp } from '../../../../api/admin/public';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { t } = useI18n();
  const convertForm = ref<Convert>();
  const closeModal = () => {
    showAddConvertModal.value = false;
    fetchData();
  };

  const deleteConvert = (id:any) => {
    DeleteConvert({ 'id': id }).then((res) => {
      fetchData();
    });
  };

  const addConvert = () => {
    showAddConvertModal.value = true;
    convertForm.value = defaultConvert;
  };

  const editConvert = (value: Convert) => {
    convertForm.value = value;
    showAddConvertModal.value = true;
  };

  const showAddConvertModal = ref(false);

  const convertCode = ref('');
  const showAddConvertRecordModal = ref(false);

  const recordConvert = (value: Convert) => {
    convertCode.value = value.redeem_code;
    showAddConvertRecordModal.value = true;
  };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<Convert[]>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };

  const pagination = reactive({
    ...basePagination,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
    pageSizeOptions: [30, 50, 100, 150],
  });
  const pageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    basePagination.pageSize = pageSize;
    fetchData({ ...basePagination, pageSize });
  };
  // columns
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('convertTable.columns.id'),
      dataIndex: 'id',
      slotName: 'id',
    },
    {
      title: t('convertTable.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: t('convertTable.columns.redeem_code'),
      dataIndex: 'redeem_code',
      slotName: 'redeem_code',
    },
    // {
    //   title: t('convertTable.columns.duration_value'),
    //   dataIndex: 'duration_value',
    //   slotName: 'duration_value',
    // },
    {
      title: t('convertTable.columns.is_invitation'),
      dataIndex: 'is_invitation',
      slotName: 'is_invitation',
    },
    {
      title: t('convertTable.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
    },
    {
      title: t('convertTable.columns.ordinal_number'),
      dataIndex: 'ordinal_number',
      slotName: 'ordinal_number',
    },
    {
      title: t('convertTable.columns.end_at'),
      dataIndex: 'end_at',
      slotName: 'end_at',
    },
    {
      title: t('convertTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const fetchData = async (
    params: PolicyParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data, total } = await QueryConvert(params);
      renderData.value = data;
      pagination.current = params.current;
      pagination.total = renderData.value.length;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData(basePagination);

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
    name: 'ServerNode',
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
