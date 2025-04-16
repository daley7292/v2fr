<template>
  <div class="container">
    <a-card>
      <div>
        <div style="font-size: 1.3rem;">{{ t('userFinance.invite.title') }}</div>
        <div style="margin: 20px 0">
          <span style="font-size: 3.5rem;font-weight: 300">
            {{ invite && invite.stat ? invite.stat[4] / 100 : 0 }}
          </span>
          <span style="font-size: 2rem;font-weight: 200;opacity: 0.7">{{
              commConfig ? commConfig.currency : 'Other'
            }}</span>
        </div>
      </div>
      <div>
        <div style="font-size: 1.3rem;">{{ t('userFinance.invite.commission.current') }}</div>
        <div style="margin: 20px 0">
          <a-space>
            <a-button type="primary" @click="()=>showTransfer=true">{{GetCurrencySymbol()}} {{ t('userFinance.invite.transfer') }} </a-button>
            <a-button type="outline" @click="()=>showPayouts=true">{{GetCurrencySymbol()}} {{ t('userFinance.invite.withdraw') }}</a-button>
          </a-space>
        </div>
      </div>
      <div style="font-size: 1.3rem;line-height: 2rem;margin: 50px 0;">
        <a-row>
          <a-col :span="12">
            <div>{{ t('userFinance.invite.stats.registeredUsers') }}</div>
            <div>{{ t('userFinance.invite.stats.commissionRate') }}</div>
            <div>{{ t('userFinance.invite.stats.pendingCommission') }}</div>
            <div>{{ t('userFinance.invite.stats.totalCommission') }}</div>
          </a-col>
          <a-col style="text-align: right" :span="12">
            <div>{{ invite && invite.stat ? invite.stat[0] : 0 }}{{ t('userFinance.invite.users') }}</div>
            <div>{{ invite && invite.stat ? invite.stat[3] : 0 }}%</div>
            <div>{{GetCurrencySymbol()}} {{ invite && invite.stat ? (invite.stat[1]/100).toFixed(2) : 0 }}</div>
            <div>{{GetCurrencySymbol()}}  {{ invite && invite.stat ? (invite.stat[2]/100).toFixed(2) : 0 }}</div>
          </a-col>
        </a-row>
      </div>
      <div style="font-size: 1.3rem;line-height: 2rem;margin: 10px 0;">
        <a-row style="font-size: 1.6rem;margin: 10px 0;">
          <a-col :span="12">
            <div style="margin-left: 20px">{{ t('userFinance.invite.codeManagement') }}</div>
          </a-col>
          <a-col style="text-align: right" :span="12">
            <a-button type="primary" @click="saveInvite">{{ t('userFinance.invite.generateCode') }}</a-button>
          </a-col>
        </a-row>
        <a-table
          row-key="id"
          :loading="loading"
          :pagination="false"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
        >
          <template #code="{record}">
            {{ record.code }}
            <a-button type="text" @click="copyText('/register?code='+record.code)">{{ t('userFinance.invite.copyLink') }}</a-button>
          </template>
          <template #created_at="{record}">
            {{ formatTimestamp(record.created_at) }}
          </template>
        </a-table>
      </div>
      <div style="font-size: 1.3rem;line-height: 2rem;margin: 10px 0;">
        <div style="margin: 20px 0;font-size: 1.6rem;margin-left: 20px">{{ t('userFinance.invite.commissionRecords') }}</div>
        <a-table
          row-key="id"
          :loading="loadingOrder"
          :pagination="false"
          :columns="(cloneOrderColumns as TableColumnData[])"
          :data="renderOrderData"
          :bordered="false"
          :size="sizeOrder">
          <template #created_at="{record}">
            {{ formatTimestamp(record.created_at) }}
          </template>

          <template #get_amount="{record}">
            {{ (record.get_amount/100).toFixed(2)  }} {{GetCurrency()}}
          </template>
        </a-table>
      </div>
    </a-card>
    <a-modal :title="t('userFinance.transfer.title')" v-model:visible="showTransfer" @ok="transferHandler" @cancel="()=>showTransfer=false"
             :unmount-on-close-="true">
      <div>
        <a-alert>{{ t('userFinance.transfer.alert', { appName: GetAppName() }) }}</a-alert>
      </div>
      <a-form ref="transferForm" layout="vertical">
        <a-form-item :label="t('userFinance.transfer.currentBalance')">
          <a-input v-model="transfer.balance" disabled/>
        </a-form-item>
        <a-form-item :label="t('userFinance.transfer.amount')">
          <a-input v-model="transfer.transfer_amount"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :title="t('userFinance.withdraw.title')" v-model:visible="showPayouts" @ok="payoutsHandler" @cancel="()=>showPayouts=false" :unmount-on-close-="true">
      <a-form ref="payoutsForm" layout="vertical">
        <a-form-item :label="t('userFinance.withdraw.method')">
          <a-select v-model="payouts.withdraw_method" :placeholder="t('userFinance.withdraw.method.placeholder')">
            <div v-if="commConfig?.withdraw_methods">
              <a-option  :value="item" v-for="(item,index) in commConfig.withdraw_methods" :key="index">{{item}}</a-option>
            </div>
          </a-select>
        </a-form-item>
        <a-form-item :label="t('userFinance.withdraw.account')">
          <a-input v-model="payouts.withdraw_account" :placeholder="t('userFinance.withdraw.account.placeholder')"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  QueryCommConfig,
  QueryInvite,
  QueryUserInfo,
  SaveInvite,
  UserTicketWithdraw,
  UserInviteDetails,
  UserTransfer
} from "@/api/user/finance/invite";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {TableColumnData} from "@arco-design/web-vue/es/table/interface";
import useLoading from "@/hooks/loading";
import {useI18n} from "vue-i18n";
import {Order} from "@/api/admin/finance/order";
import cloneDeep from "lodash/cloneDeep";
import {formatTimestamp} from "../../../../api/admin/public";
import {Message} from "@arco-design/web-vue";
import { GetAppName, GetCurrency, GetCurrencySymbol } from "@/utils/comm-config";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const {t} = useI18n();
const {loading, setLoading} = useLoading(true);
const renderData = ref<Order[]>([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>('medium');

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('orderTable.columns.trade_no'),
    dataIndex: 'code',
    slotName: 'code',
  },
  {
    title: t('orderTable.columns.created_at'),
    dataIndex: 'created_at',
    slotName: 'created_at',
    width:210,
  },
]);
const copyText = (value: string) => {
  const textToCopy = window.location.host + value;

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        Message.success({
          content: t('common.copy.success'),
        });
      })
      .catch((err) => {
        Message.error({
          content: t('common.copy.fail') + ': ' + err.toString(),
        });
      });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed'; // Prevent scrolling to the bottom
    textarea.style.opacity = '0'; // Hide the textarea
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        Message.success({
          content: t('common.copy.success'),
        });
      } else {
        throw new Error('Fallback copy failed');
      }
    } catch (err) {
      Message.error({
        content: t('common.copy.fail') + ': ' + err.toString(),
      });
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

//资金划转
const showTransfer = ref(false)
const transfer = reactive({
  balance: 0,
  transfer_amount: 0,
})
//提交自己划转
const transferHandler = () => {
  UserTransfer({transfer_amount: transfer.transfer_amount*100}).then(r => {
    if (r.data) {
      Message.success({
        content: t('userFinance.transfer.success')
      })
      showTransfer.value = false
    }
  })
}

//提现
const showPayouts = ref(false)

const  payouts = reactive({
  withdraw_method:'',
  withdraw_account:'',
})

//佣金提现
const payoutsHandler = ()=>{
  UserTicketWithdraw(payouts).then(r=>{
    Message.success({
      content: t('userFinance.withdraw.success')
    })
    showPayouts.value = false
  })
}

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
    {deep: true, immediate: true}
);


const userInfo = ref()
const queryUserInfo = () => {
  QueryUserInfo().then(r => {
    userInfo.value = r.data
  })
}

const saveInvite = () => {
  SaveInvite().then(r => {
    queryInvite()
  })
}

const commConfig = ref()
const queryCommConfig = () => {
  QueryCommConfig().then(r => {
    commConfig.value = r.data
  })
}

const invite = ref()
const queryInvite = () => {
  setLoading(true);
  QueryInvite().then(r => {
    invite.value = r.data
    renderData.value = r.data.codes;
    transfer.balance = invite.value.stat[4] / 100
  }).finally(() => {
    setLoading(false);
  })
}

const renderOrderData = ref<Order[]>([]);
const cloneOrderColumns = ref<Column[]>([]);
const showOrderColumns = ref<Column[]>([]);

const sizeOrder = ref<SizeProps>('medium');

const columnsOrder = computed<TableColumnData[]>(() => [

  {
    title: t('orderTable.columns.commission_payout_time'),
    dataIndex: 'created_at',
    slotName: 'created_at',
  },  {
    title: t('orderTable.columns.commission_payout_amount'),
    dataIndex: 'get_amount',
    slotName: 'get_amount',
    width:210,
  },
]);

const  userInviteDetails =()=>{
  setLoading(true);
  UserInviteDetails().then(res => {
    renderOrderData.value = res.data
  }).finally(() => {
    setLoading(false);
  })
}

watch(
  () => columnsOrder.value,
  (val) => {
    cloneOrderColumns.value = cloneDeep(val);
    cloneOrderColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showOrderColumns.value = cloneDeep(cloneOrderColumns.value);
  },
  {deep: true, immediate: true}
);


onMounted(() => {
  queryInvite()
  queryUserInfo()
  queryCommConfig()
  userInviteDetails()
})

</script>
<script lang="ts">
export default {
  name: 'UserFinanceInvite',
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style>
