<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <Breadcrumb :items="['menu.finance', 'menu.finance.subscription']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <!-- 创建订阅按钮 -->
        <a-button type="outline"
          @click="() => { showAddSubscriptionModal = true; subscriptionForm = defaultServerSubscription }">
          <template #icon>
            <icon-plus />
          </template>
          {{ t('subscription.button.create') }}
        </a-button>
      </div>
      <!-- 订阅计划数据表格 -->
      <a-table row-key="id" :loading="loading" :pagination="pagination" :columns="(cloneColumns as TableColumnData[])"
        :data="renderData" :bordered="false"   :size="size" @page-change="onPageChange"   @page-size-change="pageSizeChange"  @change="handleTableChange" :draggable="{ type: 'handle', width: 40 }">
        <!-- 权限组显示 -->
        <template #group_id="{ record }">
          <div v-for="(item, index) in permissionGroup" :key="index">
            <a-tag :value="item.id" v-if="record.group_id == item.id" color="arcoblue" :default-checked="true">
              {{ item.name }}
            </a-tag>
          </div>
        </template>

        <!-- 用户数量显示 -->
        <template #count="{ record }">
          <icon-user />
          {{ record.count }}
        </template>
        <!-- 流量限制显示 -->
        <template #transfer_enable="{ record }">
          {{ record.transfer_enable }} GB
        </template>
        <!-- 各种价格显示（除以100转换为元） -->
        <template #month_price="{ record }">
          {{ record.month_price?(record.month_price / 100):'-' }}
        </template>
        <template #quarter_price="{ record }">
          {{ record.quarter_price?(record.quarter_price / 100):'-' }}
        </template>
        <template #year_price="{ record }">
          {{ record.year_price?(record.year_price / 100):'-' }}
        </template>
        <template #half_year_price="{ record }">
          {{ record.half_year_price?(record.half_year_price / 100):'-' }}
        </template>
        <template #two_year_price="{ record }">
          {{ record.two_year_price?(record.two_year_price / 100):'-' }}
        </template>
        <template #three_year_price="{ record }">
          {{ record.three_year_price?(record.three_year_price / 100):'-' }}
        </template>
        <template #onetime_price="{ record }">
          {{ record.onetime_price?(record.onetime_price / 100):'-' }}
        </template>
        <template #reset_price="{ record }">
          {{ record.reset_price?(record.reset_price / 100):'-' }}
        </template>
        <!-- 显示状态切换 -->
        <template #show="{ record }">
          <a-switch :checked-value="1" :unchecked-value="0" :default-checked="record.show"
            @change="planUpdate({ id: record.id, show: (record.show === 0 ? 1 : 0) })" />
        </template>
        <!-- 续费状态切换 -->
        <template #renew="{ record }">
          <a-switch :checked-value="1" :unchecked-value="0" :default-checked="record.renew"
            @change="planUpdate({ id: record.id, renew: (record.renew === 0 ? 1 : 0) })" />
        </template>
        <!-- 操作列 -->
        <template #operations="{ record }">
          <a-dropdown :popup-max-height="false">
            <a-button type="text">{{ t('subscriptionTable.columns.operations') }}
              <icon-caret-down />
            </a-button>
            <template #content>
              <a-doption>
                <a-button type="text" @click="editSubscription(record)" status="success">
                  <icon-edit />
                  {{ t('button.edit') }}
                </a-button>
              </a-doption>
              <a-doption>
                <a-button @click="deleteSubscription(record)" type="text" status="danger">
                  <icon-delete />
                  {{ t('button.delete') }}
                </a-button>
              </a-doption>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </a-card>
    <!-- 添加/编辑订阅抽屉 -->
    <a-drawer :width="650" :visible="showAddSubscriptionModal" :footer="false" :unmount-on-close="true"
      @cancel="() => { showAddSubscriptionModal = false }">
      <template #title>
        {{ t('subscription.button.create') }}
      </template>
      <subscription-form :data="subscriptionForm" @close="closeModal" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { PolicyParams } from '@/api/list';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import SubscriptionForm from "@/views/admin/finance/subscription/components/subscription-form.vue";
import {
  defaultServerSubscription,
  DeleteSubscription,
  FinanceSubscription, PlanSort,
  PlanUpdate,
  QuerySubscription
} from "@/api/admin/finance/subscription";
import "@/views/admin/finance/subscription/index.vue";
import { Node, NodeSort, PermissionGroup, QueryPermissionGroup } from "@/api/admin/server/node";
import { Message } from "@arco-design/web-vue";
import { Pagination } from "@/types/global";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

// 国际化工具
const { t } = useI18n();
// 控制添加订阅模态框显示状态
const showAddSubscriptionModal = ref(false)
// 订阅表单数据
const subscriptionForm = ref<FinanceSubscription & Record<string, any>>(defaultServerSubscription)
// 更新计划状态
const planUpdate = (params: any) => {
  PlanUpdate(params).then(() => {
    fetchData()
  })
}
// 价格相关字段列表
const priceKeys = ["month_price", "quarter_price", "half_year_price", "year_price", "two_year_price", "three_year_price", "onetime_price", "reset_price"]
// 编辑订阅
const editSubscription = (value: FinanceSubscription & Record<string, any>) => {
  let obj: FinanceSubscription = { force_update: true }
  Object.keys(value).forEach(key => {
    if (priceKeys.includes(key)) {
      if (obj[key]){
        // 价格除以100转换为元
        obj[key] = value[key] / 100
      }
    } else {
      obj[key] = value[key]
    }
  })
  subscriptionForm.value = obj

  showAddSubscriptionModal.value = true
}
// 删除订阅
const deleteSubscription = (value: FinanceSubscription) => {
  DeleteSubscription(value.id).then(r => {
    if (r.data) {
      Message.success(t('subscription.delete.success'))
      fetchData()
    }
  })
}
// 权限组数据
const permissionGroup = ref<PermissionGroup[]>([])
// 查询权限组数据
const queryPermissionGroup = async () => {
  const { data } = await QueryPermissionGroup()
  permissionGroup.value = data
}
queryPermissionGroup()
// 关闭模态框并刷新数据
const closeModal = () => {
  showAddSubscriptionModal.value = false
  fetchData(basePagination)
}
// 生成表单模型
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
// 加载状态控制
const { loading, setLoading } = useLoading(true);
// 表格数据
const renderData = ref<FinanceSubscription[]>([]);
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
const handleTableChange = (_data) => {
  renderData.value = _data
  let sort =[]
  _data.forEach((v,index)=>{
     sort.push(v.id)
  })
  PlanSort({plan_ids:sort})
  //
}
const pageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  basePagination.pageSize = pageSize;
  fetchData({ ...basePagination, pageSize });
};

// 定义表格列
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('subscriptionTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('subscriptionTable.columns.show'),
    dataIndex: 'show',
    slotName: 'show',
    width: 100,
  },
  {
    title: t('subscriptionTable.columns.renew'),
    dataIndex: 'renew',
    slotName: 'renew',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.name'),
    dataIndex: 'name',
    slotName: 'name',
    width: 120,
  },
  {
    title: t('subscriptionTable.columns.count'),
    dataIndex: 'count',
    slotName: 'count',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.transfer_enable'),
    dataIndex: 'transfer_enable',
    slotName: 'transfer_enable',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.month_price'),
    dataIndex: 'month_price',
    slotName: 'month_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.quarter_price'),
    dataIndex: 'quarter_price',
    slotName: 'quarter_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.half_year_price'),
    dataIndex: 'half_year_price',
    slotName: 'half_year_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.year_price'),
    dataIndex: 'year_price',
    slotName: 'year_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.two_year_price'),
    dataIndex: 'two_year_price',
    slotName: 'two_year_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.three_year_price'),
    dataIndex: 'three_year_price',
    slotName: 'three_year_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.onetime_price'),
    dataIndex: 'onetime_price',
    slotName: 'onetime_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.reset_price'),
    dataIndex: 'reset_price',
    slotName: 'reset_price',
    width: 80,
  },
  {
    title: t('subscriptionTable.columns.group_id'),
    dataIndex: 'group_id',
    slotName: 'group_id',
    width: 120,
  },
  {
    title: t('subscriptionTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    fixed: 'right',
  },
]);

// 获取订阅数据
const fetchData = async (
  params: PolicyParams
) => {
  if (!params){
    params = {...basePagination}
  }
  setLoading(true);
  try {
    const { data } = await QuerySubscription(params);
    renderData.value = data;
  } catch (err) {
    // 可以使用errorHandler或其他方式报告错误
  } finally {
    setLoading(false);
  }
};

// 初始化加载数据
fetchData(basePagination);

// 监听列变化，更新显示列
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
