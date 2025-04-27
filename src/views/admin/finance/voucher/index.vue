<template>
  <div class="container">
    <Breadcrumb :items="['menu.finance', 'menu.finance.voucher']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-button type="outline" @click="addVoucher()">
          <template #icon>
            <icon-plus />
          </template>
          {{ t('voucher.add') }}
        </a-button>
      </div>
      <a-table row-key="id" :loading="loading" :pagination="pagination" :columns="(cloneColumns as TableColumnData[])"
               :data="renderData" :bordered="false" :size="size" @page-change="onPageChange"   @page-size-change="pageSizeChange">
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #show="{ record }">
          <a-switch :checked-value="1" :unchecked-value="0" :default-checked="record.show" @change="couponShow(record.id)" />
        </template>
        <template #type="{ record }">
          <span v-if="record.type === 1">{{ t('voucher.type.amount') }}</span>
          <span v-else>{{ t('voucher.type.percentage') }}</span>
        </template>
        <template #ended_at="{ record }">
          {{ formatTimestamp(record.started_at) }} - {{ formatTimestamp(record.ended_at) }}
        </template>
        <template #limit_use="{ record }">
          {{ record.limit_use ? record.limit_use : t('voucher.limit.unlimited') }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="primary" @click="editVoucher(record)">{{t('button.edit')}}</a-button>
            <a-popconfirm :content="t('voucher.delete.confirm')" @ok="deleteVoucher(record.id)" type="warning">
              <a-button type="primary" status="danger">{{t('button.delete')}}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal :width="580" :visible="showAddVoucherModal" @cancel="() => { showAddVoucherModal = false }" :footer="false"
             :unmount-on-close="true">
      <template #title>
        {{ t('voucher.modal.title') }}
      </template>
      <voucher-form :data="voucherForm" @close="closeModal" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { PolicyParams } from '@/api/list';
import { Pagination } from '@/types/global';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import VoucherForm from "@/views/admin/finance/voucher/components/voucher-form.vue";
import {CouponShow, DeleteVoucher, newVoucher, QueryVoucher, Voucher} from "@/api/admin/finance/voucher";
import { Message } from "@arco-design/web-vue";
import { formatTimestamp } from "../../../../api/admin/public";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const { t } = useI18n();
const voucherForm = ref()
const closeModal = () => {
  showAddVoucherModal.value = false
  fetchData()
}

const addVoucher = () => {
  showAddVoucherModal.value = true;
  voucherForm.value = newVoucher
}

const editVoucher = (value: Voucher) => {
  voucherForm.value = value
  showAddVoucherModal.value = true
}

const deleteVoucher = (id: any) => {
  DeleteVoucher({ id: id }).then(r => {
    if (r.data) {
      Message.success({
        content: t('subscription.delete.success')
      })
      fetchData()
    }
  })
}

const couponShow = (value:any)=>{
  CouponShow({id:value}).then(()=>{
    fetchData()
  })
}

const showAddVoucherModal = ref(false)
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
const renderData = ref<Voucher[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

// 表格大小
const size = ref<SizeProps>('medium');

// 分页基础配置
const basePagination: Pagination = {
  current: 1,
  pageSize: 100,
};
const pagination = reactive({
  ...basePagination,
  showTotal:true,
  showJumper:true,
  showPageSize:true,
pageSizeOptions:[100,500,1000]
});

const pageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  basePagination.pageSize = pageSize;
  fetchData({ ...basePagination, pageSize });
};
// columns
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('voucherTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('voucherTable.columns.show'),
    dataIndex: 'show',
    slotName: 'show',
  },
  {
    title: t('voucherTable.columns.name'),
    dataIndex: 'name',
    slotName: 'name',
  },
  {
    title: t('voucherTable.columns.type'),
    dataIndex: 'type',
    slotName: 'type',
  },
  {
    title: t('voucherTable.columns.code'),
    dataIndex: 'code',
    slotName: 'code',
  },
  {
    title: t('voucherTable.columns.limit_use'),
    dataIndex: 'limit_use',
    slotName: 'limit_use',
  },
  {
    title: t('voucherTable.columns.ended_at'),
    dataIndex: 'ended_at',
    slotName: 'ended_at',
  },
  {
    title: t('voucherTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async (
  params: PolicyParams
) => {
  if (!params){
    params = {...basePagination}
  }
  setLoading(true);
  try {
    const { data, total } = await QueryVoucher(params);
    renderData.value = data
    pagination.current = params.current
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



fetchData();
const reset = () => {
  formModel.value = generateFormModel();
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

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        },
      });
    });
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
