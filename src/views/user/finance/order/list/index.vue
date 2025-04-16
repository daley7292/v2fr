<template>
  <div class="container">
    <Breadcrumb :items="['menu.finance', 'menu.finance.order']"/>
    <a-card>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #total_amount="{ record }">
          {{ record.total_amount / 100 }}
        </template>
        <template #status="{ record }">
          <a-typography-text type="success">
            <li style="padding-left: 16px;color: red" v-if="record.status == 0">{{ t('userOrderList.status.unpaid') }}</li>
          </a-typography-text>
          <a-typography-text type="success">
            <li style="padding-left: 16px;" v-if="record.status == 1">{{ t('userOrderList.status.processing') }}</li>
          </a-typography-text>
          <a-typography-text type="secondary">
            <li style="padding-left: 16px;" v-if="record.status == 2">{{ t('userOrderList.status.cancelled') }}</li>
          </a-typography-text>
          <a-typography-text type="success">
            <li style="padding-left: 16px;" v-if="record.status == 3">{{ t('userOrderList.status.completed') }}</li>
          </a-typography-text>
          <a-typography-text type="success">
            <li style="padding-left: 16px;" v-if="record.status == 4">{{ t('userOrderList.status.discounted') }}</li>
          </a-typography-text>
        </template>
        <template #commission_status="{record}">
          {{
            (record.commission_status === null || record.commission_balance === 0) ? '-' : (
              record.commission_status === 0 ? t('userOrderList.commission.status.pending') :
                record.commission_status === 1 ? t('userOrderList.commission.status.processing') :
                  record.commission_status == 2 ? t('userOrderList.commission.status.valid') :
                    t('userOrderList.commission.status.invalid')
            )
          }}
        </template>
        <template #commission_balance="{record}">
          {{
            (record.commission_balance === null || record.commission_balance === 0) ? '-' : record.commission_balance / 100
          }}
        </template>
        <template #period="{record}">
          <span v-if="record.period ==='month_price'">{{ t('userOrderList.period.month') }}</span>
          <span v-if="record.period ==='quarter_price'">{{ t('userOrderList.period.quarter') }}</span>
          <span v-if="record.period ==='half_year_price'">{{ t('userOrderList.period.halfYear') }}</span>
          <span v-if="record.period ==='year_price'">{{ t('userOrderList.period.year') }}</span>
          <span v-if="record.period ==='two_year_price'">{{ t('userOrderList.period.twoYear') }}</span>
          <span v-if="record.period ==='three_year_price'">{{ t('userOrderList.period.threeYear') }}</span>
          <span v-if="record.period ==='onetime_price'">{{ t('userOrderList.period.oneTime') }}</span>
          <span v-if="record.period ==='reset_price'">{{ t('userOrderList.period.resetTraffic') }}</span>
        </template>
        <template #type="{record}">
          {{ record.type === 1 ? t('userOrderList.type.new') : record.type === 2 ? t('userOrderList.type.renew') : t('userOrderList.type.change') }}
        </template>
        <template #trade_no="{record}">
          <a-button @click="orderDetails(record)" type="text">{{ record.trade_no }}</a-button>
        </template>
        <template #created_at="{record}">
          {{ formatTimestamp(record.created_at) }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" @click="orderDetails(record)" :disabled="record.status!==0">
              {{ t('userOrderList.button.viewDetails') }}
            </a-button>
            <a-popconfirm v-if="record.status===0" :content="t('userOrderList.cancel.confirm')"
                          @ok="cancelOrder(record)" :ok-text="t('userOrderList.cancel.confirm.ok')">
              <a-button type="text">
                {{ t('userOrderList.button.cancel') }}
              </a-button>
            </a-popconfirm>
            <a-button v-else disabled type="text">
              {{ t('userOrderList.button.cancel') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import {PolicyParams} from '@/api/list';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {QueryOrder,} from "@/api/user/finance/order";
import {formatTimestamp} from "@/api/admin/public";
import {User} from "@/api/admin/user/user";
import {defaultFinanceOrder, Order} from "@/api/admin/finance/order";
import {useRouter} from "vue-router";
import {CancelUserOrderDetails} from "@/api/user/subscription/shop";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const showAddOrderModal = ref(false)
const orderForm = ref<Order>(defaultFinanceOrder)
const orderDetailsForm = ref<User>()
const closeModal = () => {
  showAddOrderModal.value = false
  fetchData()
}

const route = useRouter()

const orderDetails = (value: Order) => {
  route.push("/order/details?id=" + value.trade_no)
}

const getTradeNo = (value:string)=>{
  if (value.length>6){
    return `${value.substring(0,3)}...${value.substring(value.length-3,value.length)}`
  }
  return value
}

const cancelOrder = (values: any) => {
  CancelUserOrderDetails({trade_no: values.trade_no}).then(()=>{
    fetchData()
  })
}

const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<Order[]>([]);
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
    title: t('orderTable.columns.trade_no'),
    dataIndex: 'trade_no',
    slotName: 'trade_no',
  },
  {
    title: t('orderTable.columns.created_at'),
    dataIndex: 'created_at',
    slotName: 'created_at',
  },
  // {
  //   title: t('orderTable.columns.type'),
  //   dataIndex: 'type',
  //   slotName: 'type',
  // },
  {
    title: t('orderTable.columns.period'),
    dataIndex: 'period',
    slotName: 'period',
  },
  {
    title: t('orderTable.columns.total_amount'),
    dataIndex: 'total_amount',
    slotName: 'total_amount',
  },
  {
    title: t('orderTable.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
  },
  // {
  //   title: t('orderTable.columns.commission_balance'),
  //   dataIndex: 'commission_balance',
  //   slotName: 'commission_balance',
  // },
  // {
  //   title: t('orderTable.columns.commission_status'),
  //   dataIndex: 'commission_status',
  //   slotName: 'commission_status',
  // },
  {
    title: t('orderTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async (
    params: PolicyParams = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await QueryOrder(params);
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
