<template>
  <div class="container">

    <Breadcrumb :items="['menu.system', 'menu.system.payment']"/>
    <a-modal v-model:visible="addPaymentMethod" :footer="false" :unmount-on-close="true" width="650px">
      <payment :data="paymentMethod" @closeModal="hideAddModal"/>
    </a-modal>
    <a-card>
      <a-button type="primary" @click="showAddModal" style="margin-bottom: 10px">
        <template #icon>
          <icon-plus/>
        </template>
        {{ $t('payment.operation.add') }}
      </a-button>
      <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
               :bordered="false" :pagination="false" @change="handleTableChange"
               :draggable="{ type: 'handle', width: 40 }">
        <template #enable="{ record }">
          <a-switch :default-checked="record.enable == 1" checked-text="启用" unchecked-text="禁用"
                    @change="changeShowPayMethod(record)"/>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button @click="editPayMethod(record)" type="primary" size="small">
              {{ $t('button.edit') }}
            </a-button>
            <a-popconfirm :content="t('permission.delete')" @ok="deletePayMethod(record)" type="warning">
              <a-button type="primary" status="danger">{{ t('button.delete') }}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Payment from "@/views/admin/system/payment/components/payment.vue";
import {
  defaultPayMethod,
  DropPaymentMethod,
  PaymentSort,
  PayMethod,
  queryPayMethods,
  showPayMethod
} from "@/api/admin/system/payment";
import {Node, NodeSort} from "@/api/admin/server/node";
import {SaveRuleSort} from "@/api/admin/server/rule";
import {Message} from "@arco-design/web-vue";

const {t} = useI18n();
const paymentMethod = ref()
const addPaymentMethod = ref(false)
const showAddModal = () => {
  let obj = {...defaultPayMethod}
  paymentMethod.value = obj
  addPaymentMethod.value = true
}

const hideAddModal = () => {
  addPaymentMethod.value = false
  fetchData()
}

const changeShowPayMethod = async (payMethod: PayMethod) => {
  try {
    await showPayMethod({id: payMethod.id})
  } finally {
    fetchData()
  }

}

const handleTableChange = (_data) => {
  renderData.value = _data
  let sort = []
  _data.forEach((v, index) => {
    sort.push(v.id)
  })
  PaymentSort({ids: sort})
}
const editPayMethod = (payMethod: PayMethod) => {
  let obj = {...payMethod}
  obj['handling_fee_fixed'] = obj['handling_fee_fixed'] / 100
  paymentMethod.value = obj
  addPaymentMethod.value = true
}

const deletePayMethod = async (payMethod: PayMethod) => {
  DropPaymentMethod({id: payMethod.id}).then(r => {
    if (r.data) {
      fetchData()
      Message.success({
        content: t('message.delete.success')
      })
    }
  })
}

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const {loading, setLoading} = useLoading(true);
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
    {deep: true, immediate: true}
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
