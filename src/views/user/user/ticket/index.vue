<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.work_order']"/>
    <a-card>
      <div style="margin-bottom: 15px">
        <a-row>
          <a-col :span="12">{{t('userTicketTable.actions.history')}}</a-col>
          <a-col :span="12" style="text-align: right">
            <a-button type="primary" @click="()=>{showAddTicket=true}">{{t('userTicketTable.actions.new')}}</a-button>
          </a-col>
        </a-row>
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
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #level="{ record }">
          <span v-if="record.level ===2">{{t('userTicketTable.actions.high')}}</span>
          <span v-if="record.level ===1">{{t('userTicketTable.actions.middle')}}</span>
          <span v-if="record.level ===0">{{t('userTicketTable.actions.low')}}</span>
        </template>
        <template #status="{ record }">
          <span v-if="record.status ===1">{{t('userTicketTable.actions.closeds')}}</span>
          <span v-if="record.status ===0 && record.reply_status ===0">{{t('userTicketTable.actions.Replied')}}</span>
          <span v-if="record.status ===0 && record.reply_status ===1">{{t('userTicketTable.actions.Waiting')}}</span>
        </template>
        <template #updated_at="{ record }">
          {{ formatTimestamp(record.updated_at) }}
        </template>
        <template #created_at="{ record }">
          {{ formatTimestamp(record.created_at) }}
        </template>
        <template #operations="{record}">
          <a-button @click="openWindow(record.id)">{{t('userTicketTable.actions.see_details')}}</a-button>
          <a-button @click="closeTicket(record.id)" :disabled="record.status === 1">{{t('userTicketTable.actions.close')}}</a-button>
        </template>
      </a-table>
    </a-card>

    <a-modal :visible="showAddTicket" :title="t('userTicketTable.actions.new')" @cancel="()=>{showAddTicket=false}" :footer="false"
             :unmount-on-close="true">
      <a-form :model="ticketForm" layout="vertical" @submit="saveTicket">
        <a-form-item field="subject" :label="t('userTicketTable.actions.subject')" :rules="[{required:true,message:t('userTicketTable.actions.subjectDesc')}]">
          <a-input v-model="ticketForm.subject" :placeholder="t('userTicketTable.actions.subjectDesc')"/>
        </a-form-item>
        <a-form-item field="level" :label="t('userTicketTable.actions.level')">
          <a-select v-model="ticketForm.level" :rules="[{required:true}]">
            <a-option :value="0">{{t('userTicketTable.actions.low')}}</a-option>
            <a-option :value="1">{{t('userTicketTable.actions.middle')}}</a-option>
            <a-option :value="2">{{t('userTicketTable.actions.high')}}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="message" :label="t('userTicketTable.actions.message')" :rules="[{required:true,message:t('userTicketTable.actions.messageDesc')}]">
          <a-textarea v-model="ticketForm.message" :placeholder="t('userTicketTable.actions.messageDesc')"/>
        </a-form-item>
        <a-form-item>
          <div style="width: 100%;text-align: right">
            <a-space>
              <a-button @click="()=>{showAddTicket=false}">{{t('userTicketTable.actions.cancel')}}</a-button>
              <a-button type="primary" html-type="submit">{{t('userTicketTable.actions.submit')}}</a-button>
            </a-space>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import {PolicyParams, PolicyRecord} from '@/api/list';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {formatTimestamp} from "../../../../api/admin/public";
import {QueryUserTicket, SaveUserTicket, UserCloseTicket} from "@/api/user/finance/ticket";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const status = ref<number>(0)

const openWindow = (id: any) => {
  const iHeight = 720
  const iWidth = 520
  //获得窗口的垂直位置
  const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
  //获得窗口的水平位置
  const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
  window.open("/ticket/chat?id=" + id, '工单', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
}

const closeTicket = (id: any) => {
  UserCloseTicket({id: id}).then(() => {
    fetchData()
  })
}

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
const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<PolicyRecord[]>([]);
const formModel = ref(generateFormModel());
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
    title: t('userTicketTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  }, {
    title: t('userTicketTable.columns.subject'),
    dataIndex: 'subject',
    slotName: 'subject',
  }, {
    title: t('userTicketTable.columns.level'),
    dataIndex: 'level',
    slotName: 'level',
  }, {
    title: t('userTicketTable.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
  }, {
    title: t('userTicketTable.columns.created_at'),
    dataIndex: 'created_at',
    slotName: 'created_at',
  }, {
    title: t('userTicketTable.columns.updated_at'),
    dataIndex: 'updated_at',
    slotName: 'updated_at',
  },
  {
    title: t('userTicketTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async (
    params: PolicyParams = {current: 1, pageSize: 10}
) => {
  setLoading(true);
  try {
    params.status = status.value
    const {data} = await QueryUserTicket(params);
    renderData.value = data;
    pagination.current = params.current;
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
  fetchData({...basePagination, current});
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

const showAddTicket = ref(false)

const ticketForm = reactive({
  subject: '',
  level: 0,
  message: ''
})

const saveTicket = ({values, errors}) => {
  if (!errors) {
    SaveUserTicket(values).then(r => {
      if (r.data) {
        fetchData();
        showAddTicket.value = false
      }
    })
  }
}

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
  name: 'UserTicket',
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
