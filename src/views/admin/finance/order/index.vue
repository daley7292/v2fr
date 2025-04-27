<template>
  <div class="container">
    <Breadcrumb :items="['menu.finance', 'menu.finance.order']" />
    <!-- 主要卡片容器 -->
    <a-card>
      <!-- 顶部操作按钮区域 -->
      <div style="margin-bottom: 15px">
        <a-space>
          <!-- 过滤按钮 -->
          <a-button type="outline" @click="() => filterShow = true">
            <icon-filter />
          </a-button>
          <!-- 添加订单按钮 -->
          <a-button type="outline" @click="() => { showAddOrderModal = true; orderForm = defaultFinanceOrder }">
            <template #icon>
              <icon-plus />
            </template>
            {{ t('order.button.add') }}
          </a-button>
        </a-space>
      </div>
      <!-- 订单数据表格 -->
      <a-table row-key="id" :loading="loading" :pagination="pagination" :columns="(cloneColumns as TableColumnData[])"
        :data="renderData" :bordered="false" :size="size" @page-change="onPageChange"   @page-size-change="pageSizeChange">
        <!-- 表格各列的自定义渲染 -->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!-- 金额显示，除以100转换为元 -->
        <template #total_amount="{ record }">
          {{ record.total_amount / 100 }}
        </template>
        <!-- 订单状态渲染及操作 -->
        <template #status="{ record }">
          <!-- 待处理状态下显示下拉菜单，可标记为已付款或已取消 -->
          <a-dropdown :popup-max-height="false" v-if="record.status === 0 ">
            <a-button size="small" type="text">
              <a-typography-text type="secondary">
                <span class="dot-red">•</span>{{ t('order.commission.pending') }}
                <a-typography-text type="primary">
                  {{ t('order.status.marking') }}
                </a-typography-text>
              </a-typography-text>
              <icon-caret-down />
            </a-button>
            <template #content>
              <a-doption v-if="record.status === 0">
                <a-button type="text" @click="passPayOrder(record)" status="success">
                  {{ t('order.status.paid') }}
                </a-button>
              </a-doption>
              <a-doption  v-if="record.status === 0">
                <a-button type="text" @click="cancelOrder(record)" status="danger">
                  {{ t('order.status.cancel') }}
                </a-button>
              </a-doption>
<!--              <a-doption v-if="record.commission_status === 0 && record.commission_balance > 0">
                <a-button type="text" @click="passCommissionPayOrder(record)" status="success">
                  {{ t('order.commission.valid') }}
                </a-button>
              </a-doption>
              <a-doption v-if="record.commission_status === 1 && record.commission_balance > 0">
                <a-button type="text" @click="passCommissionPayOrder(record)" status="success">
                  {{ t('order.commission.pending') }}
                </a-button>
              </a-doption>
              <a-doption  v-if="record.commission_status === 0 && record.commission_balance > 0">
                <a-button type="text" @click="cancelCommissionOrder(record)" status="danger">
                  {{ t('order.commission.invalid') }}
                </a-button>
              </a-doption>-->
            </template>
          </a-dropdown>
          <!-- 各种订单状态的显示 -->
          <a-typography-text type="success">
            <li style="padding-left: 16px;" v-if="record.status == 1">{{ t('order.status.processing') }}</li>
          </a-typography-text>
          <a-typography-text type="secondary">
            <li style="padding-left: 16px;" v-if="record.status == 2">{{ t('order.status.cancelled') }}</li>
          </a-typography-text>
          <a-typography-text type="success">
            <li style="padding-left: 16px;" v-if="record.status == 3">{{ t('order.status.completed') }}</li>
          </a-typography-text>
          <a-typography-text type="success">
            <li style="padding-left: 16px;" v-if="record.status == 4">{{ t('order.status.discounted') }}</li>
          </a-typography-text>
        </template>
        <!-- 佣金状态显示 -->

        <template #commission_status="{ record }">
          <a-dropdown :popup-max-height="false" >
            <a-button size="small" type="text">
              <a-typography-text type="secondary">
                <span v-if="record.commission_balance>0">
                <span :style="record.commission_status==1?'color:#1890ff':record.commission_status==2?'color:green':''" >•</span>
{{ record.commission_status==0?  t('order.commission.pending') :record.commission_status==1?t('order.commission.processing'):record.commission_status==2?'已发放':'-' }}
                </span>
                <span v-else>-</span>
                <a-typography-text v-if="(record.commission_status===0||record.commission_status===1) &&  (record.commission_balance > 0)" type="primary" >
                  {{ t('order.status.marking') }}
                </a-typography-text>
              </a-typography-text>
              <icon-caret-down v-if="(record.commission_status===0||record.commission_status===1) &&  (record.commission_balance > 0)" />
            </a-button>
            <template v-if="record.commission_balance > 0" #content>
              <a-doption v-if="record.commission_status === 0 && record.commission_balance > 0">
                <a-button type="text" disabled >
                  {{ t('order.commission.pending') }}
                </a-button>
              </a-doption>
              <a-doption v-if="record.commission_status === 1 && record.commission_balance > 0">
                <a-button type="text" @click="passCommissionPayOrder(record,1)" status="success">
                  {{ t('order.commission.pending') }}
                </a-button>
              </a-doption>
              <a-doption v-if=" record.commission_status  === 1">
                <a-button type="text" disabled >
                  {{ t('order.commission.valid') }}
                </a-button>
              </a-doption>
              <a-doption v-if="record.commission_status === 0">
                <a-button type="text" @click="passCommissionPayOrder(record,1)" >
                  {{ t('order.commission.valid') }}
                </a-button>
              </a-doption>
              <a-doption  v-if="record.commission_status === 0">
                <a-button type="text" @click="passCommissionPayOrder(record)" >
                  {{ t('order.commission.pending') }}
                </a-button>
              </a-doption>
              <a-doption  v-if="record.commission_status === 1 || record.commission_balance === 0 ">
                <a-button type="text" @click="cancelCommissionOrder(record)" status="danger">
                  {{ t('order.commission.invalid') }}
                </a-button>
              </a-doption>
              <!--              <a-doption v-if="record.commission_status === 0 && record.commission_balance > 0">
                              <a-button type="text" @click="passCommissionPayOrder(record)" status="success">
                                {{ t('order.commission.valid') }}
                              </a-button>
                            </a-doption>
                            <a-doption v-if="record.commission_status === 1 && record.commission_balance > 0">
                              <a-button type="text" @click="passCommissionPayOrder(record)" status="success">
                                {{ t('order.commission.pending') }}
                              </a-button>
                            </a-doption>
                            <a-doption  v-if="record.commission_status === 0 && record.commission_balance > 0">
                              <a-button type="text" @click="cancelCommissionOrder(record)" status="danger">
                                {{ t('order.commission.invalid') }}
                              </a-button>
                            </a-doption>-->
            </template>
          </a-dropdown>
        </template>
        <!-- 佣金余额显示 -->
        <template #commission_balance="{ record }">

          {{
            (record.commission_balance === null || record.commission_balance === 0) ?
              t('order.commission.none') : (record.commission_balance / 100).toFixed(2)
          }}
        </template>
        <!-- 赠送时间 -->
        <template #gift_days="{ record }">
          {{ giftDays(record.gift_days) }}
        </template>
        <!-- 订阅周期显示 -->
        <template #period="{ record }">
          <span v-if="record.period === 'month_price'">{{ t('order.period.month') }}</span>
          <span v-if="record.period === 'quarter_price'">{{ t('order.period.quarter') }}</span>
          <span v-if="record.period === 'half_year_price'">{{ t('order.period.half_year') }}</span>
          <span v-if="record.period === 'year_price'">{{ t('order.period.year') }}</span>
          <span v-if="record.period === 'two_year_price'">{{ t('order.period.two_year') }}</span>
          <span v-if="record.period === 'three_year_price'">{{ t('order.period.three_year') }}</span>
          <span v-if="record.period === 'onetime_price'">{{ t('order.period.onetime') }}</span>
          <span v-if="record.period === 'reset_price'">{{ t('order.period.reset') }}</span>
          <span v-if="record.period === 'try_out'">{{ t('order.period.try_out') }}</span>
        </template>
        <!-- 订单类型显示 -->
        <template #type="{ record }">
          {{ record.type === 1 ? t('order.type.new') :
            record.type === 2 ? t('order.type.renew') :
            record.type === 3 ? t('order.type.upgrade') :
            record.type === 4 ? t('order.type.try_out') :
              record.type === 5 ? t('order.type.redeem_code'):
                t('order.type.promotion')  }}
        </template>
        <!-- 交易号显示，点击查看详情 -->
        <template #trade_no="{ record }">
          <a-button @click="orderDetails(record)" type="text">{{ getTradeNo(record.trade_no) }}</a-button>
        </template>
        <!-- 创建时间显示 -->
        <template #created_at="{ record }">
          {{ formatTimestamp(record.created_at) }}
        </template>
      </a-table>
    </a-card>
    <!-- 添加订单抽屉 -->
    <a-drawer :width="500" :visible="showAddOrderModal" :footer="false" :unmount-on-close="true"
      @cancel="() => { showAddOrderModal = false }">
      <template #title>
        {{ t('order.modal.add') }}
      </template>
      <order-form @close="closeModal" />
    </a-drawer>
    <!-- 订单详情模态框 -->
    <a-modal v-model:visible="showOrderDetail" width="650px" :unmount-on-close="true" :footer="false"
      @cancel="() => { showOrderDetail = false; orderForm = defaultFinanceOrder; }">
      <template #title>
        {{ t('order.modal.detail') }}
      </template>
      <order-detail :data="orderForm" :details="orderDetailsForm" :order="orderInfo" />
    </a-modal>
    <!-- 过滤条件模态框 -->
    <a-modal :width="550" :visible="filterShow" :footer="false" @cancel="() => { filterShow = false }">
      <template #title>
        {{ t('order.modal.filter') }}
      </template>
      <filters :filter="filter" :default-cond="defaultFilter" @callback="queryData" @cancel="filterShow = false" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import filters from '@/components/filter/index.vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { PolicyParams } from '@/api/list';
import { Pagination } from '@/types/global';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import OrderForm from "@/views/admin/finance/order/components/order-form.vue";
import {
  CancelOrder,
  defaultFinanceOrder,
  OderDetails,
  Order,
  PassPayOrder, PassUpdateOrder,
  QueryOrder
} from "@/api/admin/finance/order";
import { Message } from "@arco-design/web-vue";
import OrderDetail from "@/views/admin/finance/order/components/order-detail.vue";
import { formatTimestamp } from "@/api/admin/public";
import { QueryUserDetails, User } from "@/api/admin/user/user";
import { useRoute } from 'vue-router';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const { t } = useI18n();
// 过滤器显示控制
const filterShow = ref(false);
// 过滤选项配置
const filter = ref([{
  key: "trade_no",
  des: t('order.filter.trade_no'),
  op: [t('order.filter.fuzzy')],
  type: "input",
  value: ""
}, {
  key: "status",
  des: t('order.filter.status'),
  op: ["=", ">", ">=", "<", "<="],
  type: "select",
  value: [
    {
      des: t('order.filter.status.pending'),
      value:'0'
    }, {
      des: t('order.filter.status.paid'),
      value: 1
    }, {
      des: t('order.filter.status.cancelled'),
      value: 2
    }, {
      des: t('order.filter.status.completed'),
      value: 3
    }
  ]
}, {
  key: "commission_status",
  des: t('order.filter.commission_status'),
  op: ["="],
  type: "select",
  value: [
    {
      des: t('order.filter.commission.pending'),
      value: 0
    }, {
      des: t('order.filter.commission.processing'),
      value: 1
    }, {
      des: t('order.filter.commission.paid'),
      value: 2
    }, {
      des: t('order.filter.commission.invalid'),
      value: 3
    }
  ]
}, {
  key: "user_id",
  des: t('order.filter.user_id'),
  op: ["=", ">", ">=", "<", "<="],
  type: "input",
  value: ""
}, {
  key: "invite_user_id",
  des: t('order.filter.invite_user_id'),
  op: ["=", "!="],
  type: "input",
  value: ""
}, {
  key: "callback_no",
  des: t('order.filter.callback_no'),
  op: [t('order.filter.fuzzy')],
  type: "input",
  value: ""
}, {
  key: "commission_balance",
  des: t('order.filter.commission_balance'),
  op: ["=", "!=", ">", ">=", "<", "<="],
  type: "input",
  value: ""
}])
const router = useRoute()

// 默认过滤条件
const defaultFilter = ref<[]>([])

// 当前查询条件
const condition = ref()

// 查询数据并关闭过滤器
const queryData = (value: string) => {
  condition.value = value
  onPageChange(1)
  filterShow.value = false
}
const giftDays = (value: number) => {
  if (value === undefined || value === 0 || value == null ) {
    return "---";
  }

  const totalMinutes = value * 24 * 60;
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = (totalMinutes % 60).toFixed(0);

  let result = "";
  if (days > 0) {
    result += `${days}天`;
  }
  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes}分钟`;
  }

  return result;
};
// 添加订单模态框控制
const showAddOrderModal = ref(false)
// 订单表单数据
const orderForm = ref<Order>(defaultFinanceOrder)
// 订单详情表单数据
const orderInfo = ref<Order>()
const orderDetailsForm = ref<User>()
// 关闭添加订单模态框并刷新数据
const closeModal = () => {
  showAddOrderModal.value = false
  fetchData()
}
// 订单详情模态框控制
const showOrderDetail = ref(false)
// 查看订单详情
const orderDetails = (value: Order) => {
  orderInfo.value = value
  OderDetails({ id: value.id }).then(r => {
    orderForm.value = r.data
    QueryUserDetails({ id: r.data.user_id }).then(userdata => {
      orderDetailsForm.value = userdata.data
      showOrderDetail.value = true
    })
  })
}

// 取消订单
const cancelOrder = (value: Order) => {
  CancelOrder({ trade_no: value.trade_no }).then(r => {
    if (r.data) {
      Message.success({
        content: t('order.button.cancel_success')
      })
      fetchData()
    }
  })
}

// 确认订单支付
const passPayOrder = (value: Order) => {
  PassPayOrder({ trade_no: value.trade_no }).then(r => {
    if (r.data) {
      Message.success({
        content: t('order.button.confirm_payment')
      })
      fetchData()
    }
  })
}
// 佣金无效
const cancelCommissionOrder = (value: Order) => {
  PassUpdateOrder({ trade_no: value.trade_no,commission_status:3 }).then(r => {
    if (r.data) {
      Message.success({
        content: t('order.commission.invalid')
      })
      fetchData()
    }
  })
}

// 确认佣金有效
const passCommissionPayOrder = (value: Order,status:number) => {
  PassUpdateOrder({ trade_no: value.trade_no ,commission_status:status}).then(r => {
    if (r.data) {
      Message.success({
        content: t('order.commission.valid')
      })
      fetchData()
    }
  })
}
// 获取简化的交易号显示
const getTradeNo = (value: string) => {
  if (value.length > 6) {
    return `${value.substring(0, 3)}...${value.substring(value.length - 3, value.length)}`
  }
  return value
}
// 加载状态控制
const { loading, setLoading } = useLoading(true);
// 表格数据
const renderData = ref<Order[]>([]);
// 表格列配置
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
// 表格列配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('orderTable.columns.trade_no'),
    dataIndex: 'trade_no',
    slotName: 'trade_no',
  },
  {
    title: t('orderTable.columns.type'),
    dataIndex: 'type',
    slotName: 'type',
  },
  {
    title: t('orderTable.columns.plan_name'),
    dataIndex: 'plan_name',
    slotName: 'plan_name',
  },
  {
    title: t('orderTable.columns.period'),
    dataIndex: 'period',
    slotName: 'period',
  },
  {
    title: t('orderTable.columns.gift_days'),
    dataIndex: 'gift_days',
    slotName: 'gift_days',
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
  {
    title: t('orderTable.columns.commission_balance'),
    dataIndex: 'commission_balance',
    slotName: 'commission_balance',
  },
  {
    title: t('orderTable.columns.commission_status'),
    dataIndex: 'commission_status',
    slotName: 'commission_status',
  },
  {
    title: t('orderTable.columns.created_at'),
    dataIndex: 'created_at',
    slotName: 'created_at',
  },
]);
// 获取订单数据
const fetchData =async (params: PolicyParams) => {
  if (!params){
    params = {...pagination}
  }
  setLoading(true);
  try {
    const { data,total } = await QueryOrder(params, condition.value);
    renderData.value = data;
    pagination.total = total
    pagination.current = params.current
  } catch (err) {
    // 错误处理
  } finally {
    setLoading(false);
  }
};

// 页码变化处理
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current });
};

// 获取路由信息
const route = useRoute()
// 组件挂载时初始化
onMounted(() => {
  // 如果URL中有用户ID参数，设置为默认过滤条件
  if (route.query.id) {
    condition.value = { filter: [{ key: 'user_id', condition: '=', value: route.query.id, tempValue: '' }] }
    defaultFilter.value.push({ key: 'user_id', condition: '=', value: route.query.id, tempValue: '' })
  }
  if (route.query.status) {
    condition.value = { filter: [{ key: 'status', condition: '=', value: route.query.status, tempValue: '' }] }
    defaultFilter.value.push({ key: 'status', condition: '=', value: route.query.status, tempValue: '' })
  }
  if (route.query.commission_status) {
    condition.value = { filter: [{ key: 'commission_status', condition: '=', value: route.query.commission_status, tempValue: '' }] }
    defaultFilter.value.push({ key: 'commission_status', condition: '=', value: route.query.commission_status, tempValue: '' })
  }
  if (route.query.trade_no) {
    condition.value = { filter: [{ key: 'trade_no', condition: '=', value: route.query.trade_no, tempValue: '' }] }
    defaultFilter.value.push({ key: 'trade_no', condition: '=', value: route.query.trade_no, tempValue: '' })
  }
  fetchData(basePagination);
}),

  // 监听列变化
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

/* 表头最后一列样式 */
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

/* 操作图标样式 */
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

/* 激活状态样式 */
.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

/* 设置按钮样式 */
.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

/* 红点样式，用于标记待处理状态 */
.dot-red {
  color: red;
  font-weight: bold;
  font-size: 16px;
  padding-right: 15px
}
</style>
