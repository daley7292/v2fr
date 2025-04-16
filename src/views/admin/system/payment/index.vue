<template>
  <div class="container">

    <Breadcrumb :items="['menu.system', 'menu.system.payment']" />
    <a-modal v-model:visible="addPaymentMethod" :footer="false" :unmount-on-close="true" width="650px">
      <payment :data="paymentMethod" @closeModal="hideAddModal" />
    </a-modal>
    <a-card>
      <a-button type="primary" @click="showAddModal" style="margin-bottom: 10px">
        <template #icon>
          <icon-plus />
        </template>
        {{ $t('payment.operation.add') }}
      </a-button>
      <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="false" :pagination="false">
        <template #enable="{ record }">
          <a-switch :default-checked="record.enable == 1" checked-text="启用" unchecked-text="禁用"
            @change="changeShowPayMethod(record)" />
        </template>
        <template #operations="{ record }">
          <a-button @click="editPayMethod(record)" type="text" size="small">
            {{ $t('button.edit')}}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Payment from "@/views/admin/system/payment/components/payment.vue";
import { defaultPayMethod, PayMethod, queryPayMethods, showPayMethod } from "@/api/admin/system/payment";

const { t } = useI18n();
const paymentMethod = ref(defaultPayMethod)
const addPaymentMethod = ref(false)
const showAddModal = () => {
  paymentMethod.value = defaultPayMethod
  addPaymentMethod.value = true
}

const hideAddModal = () => {
  addPaymentMethod.value = false
  fetchData()
}

const changeShowPayMethod = async (payMethod: PayMethod) => {
  try {
    await showPayMethod({ id: payMethod.id })
  } finally {
    fetchData()
  }

}

const editPayMethod = (payMethod: PayMethod) => {
  paymentMethod.value = payMethod
  addPaymentMethod.value = true
}

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const { loading, setLoading } = useLoading(true);
const renderData = ref<PayMethod[]>([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('payment.columns.index'),
    dataIndex: 'id',
    slotName: 'index',
  },
  {
    title: t('payment.columns.enable'),
    dataIndex: 'enable',
    slotName: 'enable',
  },
  {
    title: t('payment.columns.name'),
    dataIndex: 'name',
  },
  {
    title: t('payment.columns.payment'),
    dataIndex: 'payment',
  },
  {
    title: t('payment.columns.notify_url'),
    dataIndex: 'notify_url',
    slotName: 'notify_url',
  },
  {
    title: t('payment.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async () => {
  setLoading(true);
  const response = await queryPayMethods();
  renderData.value = response.data
  setLoading(false);
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
  { deep: true, immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'SettingPayment',
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
