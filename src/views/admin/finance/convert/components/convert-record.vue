<script setup lang="ts">
import { Convert, defaultConvert, GetRedeemOrders, QueryConvert } from "@/api/admin/finance/convert";
import { computed, reactive, ref, watch } from "vue";
  import { Message } from "@arco-design/web-vue";
  import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import { PolicyParams } from "@/api/list";
import cloneDeep from "lodash/cloneDeep";
import { formatTimestamp } from "@/api/admin/public";
import { useI18n } from 'vue-i18n';
import { adminUrl } from "@/utils/admin-url";
import { useRouter } from "vue-router";

const { t } = useI18n();
type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

  const props = defineProps(['code']);
  const convertRecord = ref<Convert>();


  const { loading, setLoading } = useLoading(true);
  const renderData = ref<[]>([]);
  const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  // columns
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('convert.email'),
      dataIndex: 'email',
      slotName: 'email',
    },
    {
      title: t('convert.trade_no'),
      dataIndex: 'trade_no',
      slotName: 'trade_no',
    },
    {
      title: t('convert.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('convert.created_at'),
      dataIndex: 'created_at',
      slotName: 'created_at',
    },{
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
      GetRedeemOrders({ redeem_code: props.code }).then((res) => {
        if (res.data) {
          convertRecord.value = res.data.convert;
          renderData.value = res.data.orders;

          // pagination.current = params.current;
          if (res.data?.orders){
            // pagination.total = res.data.orders.length;
          }
        } else {
          Message.error({
            content: res.message,
          });
        }
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };
const router = useRouter();
const toPage = (url: string, params: any) => {
  router.push({
    path: url,
    query: params,
  });
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
const status = ['待支付','已取消','已支付','已完成','其他']
</script>

<template>
  <div>
    <a-table
      row-key="order_id"
      :loading="loading"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :bordered="true"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
      <template #status="{ record }">
        {{  status[record.status] }}
      </template>
      <template #operations="{ record }">
        <a-space>
          <a-button type="primary"    @click="toPage(`/subscription/order`, {trade_no:record.trade_no})"
          >{{ t('convert.open.order') }}
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less"></style>
