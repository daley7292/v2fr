<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.manager']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-space>
          <a-button type="outline" @click="() => (filterShow = true)">
            <icon-filter />
            {{ t('menu.button.filter') }}
          </a-button>
          <a-dropdown>
            <a-button type="outline">{{
              t('menu.dropdown.operations')
            }}</a-button>
            <template #content>
              <a-doption @click="dumpCSV">{{
                t('menu.dropdown.dumpCSV')
              }}</a-doption>
              <a-doption @click="showSendEmail = true">{{
                t('menu.dropdown.sendEmail')
              }}</a-doption>
              <a-doption  v-if="condition"  @click="confirmBan"  >
                {{ t('menu.dropdown.batchBan') }}
              </a-doption>
              <a-doption v-else disabled>{{  t('menu.dropdown.batchBan') }}</a-doption>
              <a-doption v-if="condition"   @click="confirmDelete">{{ t('menu.dropdown.batchDelete') }}</a-doption>
              <a-doption v-else disabled>{{   t('menu.dropdown.batchDelete') }}</a-doption>
            </template>
          </a-dropdown>
          <a-button type="outline" @click="showAddUserModal">
            <template #icon>
              <icon-plus />
            </template>
            {{ t('menu.button.addUser') }}
          </a-button>
        </a-space>
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
        @change="handleChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #u="{ record }">
          {{ ((record.u + record.d) / 1024 / 1024 / 1024).toFixed(2) }}
        </template>

        <template #banned="{ record }">
          <a-tag :color="record.banned === 0 ? 'green' : 'red'">
            {{
              record.banned === 0
                ? t('userTable.tag.normal')
                : t('userTable.tag.banned')
            }}
          </a-tag>
        </template>

        <template #transfer_enable="{ record }">
          {{ (record.transfer_enable / 1024 / 1024 / 1024).toFixed(2) }}
        </template>
        <template #balance="{ record }">
          {{ (record.balance / 100).toFixed(2) }}
        </template>
        <template #commission_balance="{ record }">
          {{ (record.commission_balance / 100).toFixed(2) }}
        </template>
        <template #expired_at="{ record }">
          <a-tag
            :color="
              record.expired_at < 1 ||
              calculateDaysDifference(record.expired_at) > 0
                ? 'green'
                : 'red'
            "
          >
            {{
              record.expired_at > 0
                ? formatTimestamp(record.expired_at)
                : t('userTable.tag.permanent')
            }}
          </a-tag>
        </template>

        <template #created_at="{ record }">
          {{ formatTimestamp(record.created_at) }}
        </template>
        <template #plan_name="{ record }">
          {{ record.plan_name?record.plan_name:'-' }}
        </template>
        <template #group_id="{ record }">
          {{ getGroupName(record.group_id) }}
        </template>
        <template #operations="{ record }">
          <a-dropdown :popup-max-height="false">
            <a-button type="text"
              >{{ t('userTable.columns.operations') }}
              <icon-caret-down />
            </a-button>
            <template #content>
              <a-doption @click="editUser(record)">
                <a-button type="text" >
                  <span >
                    <icon-edit />
                    {{ t('userTable.columns.operations.edit') }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption  @click="showUserRenewalNewPurchase(record)">
                <a-button type="text">
                  <span >
                   <icon-loop />
                    {{ t('userTable.modal.RenewalNewPurchase') }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption  @click="showUserOrderModal(record)">
                <a-button type="text">
                  <span >
                    <icon-plus />
                    {{ t('userTable.columns.operations.assign_orders') }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption  @click="copyText(record.subscribe_url)">
                <a-button type="text">
                  <span >
                    <icon-copy />
                    {{
                      t('userTable.columns.operations.copy_subscription_URL')
                    }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption  @click="restUUIDWithURL(record)" >
                <a-button type="text">
                  <span>
                    <icon-refresh />
                    {{
                      t(
                        'userTable.columns.operations.Reset_UUID_and_subscription_URL'
                      )
                    }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption  @click="
                      toPage(`/${adminUrl}/subscription/order`, record.id)
                    ">
                <a-button type="text">
                  <span

                  >
                   <icon-bookmark />
                    {{ t('userTable.columns.operations.his_order') }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption  @click="inviteUser(record)">
                <a-button type="text">
                  <span >
                   <icon-user-group />
                    {{ t('userTable.columns.operations.his_invitation') }}
                  </span>
                </a-button>
              </a-doption>
              <a-doption @click="showUserNetworkModal(record)">
                <a-button type="text" >
                  <span >
                    <icon-idcard />{{
                      t('userTable.columns.operations.his_traffic_records')
                    }}
                  </span>
                </a-button>
              </a-doption>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :width="650"
      :visible="addUserModal"
      :footer="false"
      :unmount-on-close="true"
      @cancel="closeAddUserModal"
    >
      <template #title>
        {{ t('userNetworkTable.form.add') }}
      </template>
      <user-add-form :data="userForm" @close="closeAddUserModal" />
    </a-modal>
    <a-modal
      :width="650"
      :visible="showEditUserModal"
      :footer="false"
      :unmount-on-close="true"
      @cancel="
        () => {
          showEditUserModal = false;
        }
      "
    >
      <template #title>
        {{ t('userTable.form.title') }}
      </template>
      <user-edit-form :data="userForm" @close="closeEditModal" />
    </a-modal>
    <a-modal
      :width="550"
      :visible="filterShow"
      :footer="false"
      @cancel="
        () => {
          filterShow = false;
        }
      "
    >
      <template #title>
        {{ t('userTable.modal.filterConditions') }}
      </template>
      <filters
        :filter="filter"
        :default-cond="defaultCond"
        @callback="queryData"
        @cancel="filterShow = false"
      />
    </a-modal>
    <a-modal
      :width="650"
      :visible="userOrderModal"
      :footer="false"
      :unmount-on-close="true"
      @cancel="closeUserOrderModal"
    >
      <template #title>
        {{ t('userTable.modal.assignOrder') }}
      </template>
      <user-order-form :email="userEmail" @close="closeUserOrderModal" />
    </a-modal>
    <a-modal
      :width="650"
      :visible="userNetworkModal"
      :footer="false"
      :unmount-on-close="true"
      @cancel="closeUserNetworkModal"
    >
      <template #title>
        {{ t('userTable.modal.trafficRecords') }}
      </template>
      <user-network-form :userid="userId" />
    </a-modal>
    <a-modal
      :width="650"
      :visible="userRenewalNewPurchase"
      :footer="false"
      :unmount-on-close="true"
      @cancel="
        () => {
          userRenewalNewPurchase = false;
        }
      "
    >
      <template #title>
        {{ t('userTable.modal.RenewalNewPurchase') }}
      </template>
      <user-renewal-new-purchase :data="userRenewalNewPurchaseData" />
    </a-modal>
    <a-modal
      :visible="showSendEmail"
      :title="t('userTable.email.title')"
      @ok="sendEmail"
      @cancel="() => showSendEmail = false"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('userTable.email.subject')">
          <a-input
            disabled
            v-if="condition"
            :default-value="t('userTable.email.recipient.filtered')"
          />
          <a-input
            disabled
            v-else
            :default-value="t('userTable.email.recipient.all')"
          />
        </a-form-item>

        <a-form-item :label="t('userTable.email.subject')">
          <a-input
            v-model="sendEmailValue.subject"
            :placeholder="t('userTable.email.subject.placeholder')"
          />
        </a-form-item>
        <a-form-item :label="t('userTable.email.content')">
          <a-textarea
            v-model="sendEmailValue.content"
            :placeholder="t('userTable.email.content.placeholder')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import filters from '@/components/filter/index.vue';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { PolicyParams } from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import {  QueryPermissionGroup } from "@/api/admin/server/node";
  import {
    DumpCSV,
    newUser,
    QueryUser,
    QueryUserDetails,
    ResetUUIDWithUrl,
    SendEmail,
    User,
    UserBan,
    UserDel,
    GetRenewalNewPurchase,
  } from '@/api/admin/user/user';
  import {
    calculateDaysDifference,
    formatTimestamp,
  } from '../../../../api/admin/public';
  import { Message,Modal } from '@arco-design/web-vue';
  import { QuerySubscription } from '@/api/admin/finance/subscription';
  import UserEditForm from '@/views/admin/user/user/components/user-edit-form.vue';
  import UserAddForm from '@/views/admin/user/user/components/user-add-form.vue';
  import UserOrderForm from '@/views/admin/user/user/components/user-order-form.vue';
  import UserNetworkForm from '@/views/admin/user/user/components/user-network-form.vue';
  import UserRenewalNewPurchase from '@/views/admin/user/user/components/user-renewal-new-purchase.vue';
  import { useRouter } from 'vue-router';
  import { useRoute } from 'vue-router';
  import { adminUrl } from '@/utils/admin-url';

  const { t } = useI18n();
  const filterShow = ref(false);
  const filter = ref([
    {
      key: 'email',
      des: t('userTable.filter.email'),
      op: [t('userTable.filter.fuzzy')],
      type: 'input',
      value: '',
    },
    {
      key: 'id',
      des: t('userTable.filter.userId'),
      op: ['=', '>', '>=', '<', '<='],
      type: 'input',
      value: '',
    },
    {
      key: 'transfer_enable',
      des: t('userTable.filter.flow'),
      op: ['=', '>', '>=', '<', '<='],
      type: 'input',
      value: '',
    },
    {
      key: 'd',
      des: t('userTable.filter.down'),
      op: ['=', '>', '>=', '<', '<='],
      type: 'input',
      value: '',
    },
    {
      key: 'expired_at',
      des: t('userTable.filter.expirationTime'),
      op: ['=', '>', '>=', '<', '<='],
      type: 'date',
      value: '',
    },
    {
      key: 'uuid',
      des: t('userTable.filter.uuid'),
      op: ['='],
      type: 'input',
      value: '',
    },
    {
      key: 'token',
      des: t('userTable.filter.token'),
      op: ['='],
      type: 'input',
      value: '',
    },
    {
      key: 'banned',
      des: t('userTable.filter.userStatus'),
      op: ['='],
      type: 'select',
      value: [
        {
          des: t('userTable.filter.option.normal'),
          value: 0,
        },
        {
          des: t('userTable.filter.option.banned'),
          value: 1,
        },
      ],
    },
    {
      key: 'invite_user_id',
      des: t('userTable.filter.inviterId'),
      op: ['='],
      type: 'input',
      value: '',
    },
    {
      key: 'invite_by_email',
      des: t('userTable.filter.inviterEmail'),
      op: [t('userTable.filter.fuzzy'),'为空'],
      type: 'input',
      value: '',
    },
    {
      key: 'is_admin',
      des: t('userTable.filter.admin'),
      op: ['='],
      type: 'select',
      value: [
        {
          des: t('userTable.filter.option.no'),
          value: 0,
        },
        {
          des: t('userTable.filter.option.yes'),
          value: 1,
        },
      ],
    },
    {
      key: 'expire_days',
      des: t('userTable.filter.expireDays'),
      op: ['=','>','<','>=','<='],
      type: 'input',
      value: 1,
    },
    {
      key: 'balance',
      des: "余额",
      op: ['=','>','<','>=','<='],
      type: 'input',
      value: 1,
    },
    {
      key: 'commission_balance',
      des: "佣金",
      op: ['=','>','<','>=','<='],
      type: 'input',
      value: 1,
    },
  ]);

  const getGroupName= (groupId: number) => {
    const group = permissionGroup.value.find((item) => item.id === groupId);
    return group ? group.name : '-';
  };

  const userForm = ref<User>(newUser);
  const showEditUserModal = ref(false);
  const closeEditModal = () => {
    showEditUserModal.value = false;
    fetchData();
  };

  const showSendEmail = ref(false);
  const sendEmailValue = reactive({
    subject: '',
    content: '',
    filter: [],
  });

  const sendEmail = () => {
    sendEmailValue.filter = condition.value.filter;
    SendEmail(sendEmailValue).then(() => {
      showSendEmail.value = false;
    });
  };

  //导出
  const dumpCSV = () => {
    DumpCSV(condition.value).then((data) => {
      const blob = new Blob([data], { type: 'text/csv;charset=UTF-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const editUser = (value: User) => {
    QueryUserDetails({ id: value.id }).then((r) => {
      if (r.data?.invite_user?.email) {
        value.invite_user_email = r.data.invite_user.email;
      }
      userForm.value = { ...value };
      showEditUserModal.value = true;
    });
  };

  const copyText = (value: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          Message.success({
            content: t('userTable.message.copySuccess'),
          });
        })
        .catch((err) => {
          Message.error({
            content: t('userTable.message.copyFail') + err.toString(),
          });
        });
    } else {
      Message.success({
        content: t('userTable.message.copyNotSupported'),
      });
    }
  };

  const restUUIDWithURL = (value: User) => {
    ResetUUIDWithUrl({ id: value.id }).then((r) => {
      if (r.data) {
        Message.success({
          content: t('userTable.message.resetSuccess'),
        });
        fetchData();
      }
    });
  };

  //添加用户模态框控制器
  const addUserModal = ref(false);
  //添加用户模态框
  const showAddUserModal = () => {
    addUserModal.value = true;
  };
  //添加用户模态框
  const closeAddUserModal = () => {
    addUserModal.value = false;
    fetchData();
  };

  //用户订单所属用户id
  const userEmail = ref();
  //用户订单模态框控制器
  const userOrderModal = ref(false);
  //展示用户订单模态框
  const showUserOrderModal = (value: User) => {
    userEmail.value = value.email;
    userOrderModal.value = true;
  };
  //关闭用户订单模态框
  const closeUserOrderModal = () => {
    userOrderModal.value = false;
  };

  //用户流量使用记录
  const userId = ref();
  const userNetworkModal = ref(false);

  const showUserNetworkModal = (value: User) => {
    userId.value = value.id;
    userNetworkModal.value = true;
  };
  const closeUserNetworkModal = () => {
    userNetworkModal.value = false;
  };

  const userRenewalNewPurchaseData = ref();

  const userRenewalNewPurchase = ref(false);

  const showUserRenewalNewPurchase = (value: User) => {
    GetRenewalNewPurchase({ user_id: value.id }).then((r) => {
      if (r.data) {
        userRenewalNewPurchaseData.value = r.data;
        userRenewalNewPurchase.value = true;
      } else {
        Message.error({
          content: r.message,
        });
      }
    });
  };
  const sort = reactive({
    direction: 'desc',
    sort:null,
  })
  const handleChange = (data, extra, currentDataSource) => {

    let sortValue = 'DESC';

    if (extra.sorter.direction === 'ascend') {
      sortValue = 'ASC';
    }
    sort.direction = sortValue;
    sort.sort = (extra.sorter.field=='plan_name')?'plan_id':extra.sorter.field;
    fetchData({
      pageSize: pagination.pageSize,
      current: 1,
      sort_type:sort.direction ,
      sort:sort.sort
    });
  };
  const confirmBan = () => {
    if (condition.value) {
      Modal.confirm({
        content: t('menu.dropdown.confirmBan'),
        okText: t('menu.dropdown.confirmOk'),
        cancelText: t('menu.dropdown.confirmCancel'),
        onOk: () => {
          UserBan(condition.value).then(() => fetchData(basePagination))
        }
      })
    } else {
      Message.info(t('menu.dropdown.noCondition'));
    }
  };

  const confirmDelete = () => {
    if (condition.value) {
      Modal.confirm({
        content: t('menu.dropdown.confirmDelete'),
        onOk: () => {
          userDel();
        }
      })
    } else {
      Message.info(t('menu.dropdown.noCondition'));
    }
  };

  const userDel = () => {
    let delIds: number[] = [];
    renderData.value.forEach((item, index) => {
      delIds.push(item.id);
    });
    UserDel({ ids: delIds }).then(() => fetchData(basePagination));
  };

  const router = useRouter();
  const toPage = (url: string, id: any) => {
    router.push({
      path: url,
      query: { id: id },
    });
  };

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<User[]>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const condition = ref();

  const defaultCond = ref([]);

  // 分页基础配置
  const basePagination: Pagination = {
    current: 1,
    pageSize: 100,
  };
  const pagination = reactive({
    ...basePagination,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
    pageSizeOptions: [100, 500,1000],
  });
  const pageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    basePagination.pageSize = pageSize;
    fetchData({ ...basePagination, pageSize });
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('userTable.columns.id'),
      dataIndex: 'id',
      slotName: 'id',
      width: 80,
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('userTable.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 200,
    },
    {
      title: t('userTable.columns.banned'),
      dataIndex: 'banned',
      slotName: 'banned',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 100,
    },
    {
      title: t('userTable.columns.plan_name'),
      dataIndex: 'plan_name',
      slotName: 'plan_name',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 130,
    },
    {
      title: t('userTable.columns.group_id'),
      dataIndex: 'group_id',
      slotName: 'group_id',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 100,
    },
    {
      title: t('userTable.columns.u'),
      dataIndex: 'u',
      slotName: 'u',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 120,
    },
    {
      title: t('userTable.columns.transfer_enable'),
      dataIndex: 'transfer_enable',
      slotName: 'transfer_enable',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 120,
    },
    {
      title: t('userTable.columns.expired_at'),
      dataIndex: 'expired_at',
      slotName: 'expired_at',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 120,
    },
    {
      title: t('userTable.columns.balance'),
      dataIndex: 'balance',
      slotName: 'balance',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 120,
    },
    {
      title: t('userTable.columns.commission_balance'),
      dataIndex: 'commission_balance',
      slotName: 'commission_balance',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 120,
    },
    {
      title: t('userTable.columns.created_at'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      width: 120,
    },
    {
      title: t('userTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
    },
  ]);

  const queryData = (value: any) => {
    if (value){
      condition.value = value;
    }else{
      condition.value = null;
      if (defaultCond.value[0]){
        defaultCond.value[0].value = undefined
      }else{
        defaultCond.value = [];
      }
    }
    basePagination.current = 1;
    fetchData(basePagination);
    filterShow.value = false;
  };
  // 查询并保存权限组信息
  const permissionGroup = ref<PermissionGroup[]>([])
  const queryPermissionGroup = async () => {
    const { data } = await QueryPermissionGroup()
    permissionGroup.value = data
  }

  const inviteUser = (record: User) => {
    condition.value = { filter: [{ key: 'invite_user_id', condition: '=', value: record.id, tempValue: '' }] }
    defaultCond.value=[]
    defaultCond.value.push({ key: 'invite_user_id', condition: '=', value: record.id, tempValue: '' })
    fetchData(basePagination);
  };

  const fetchData = async (params: PolicyParams) => {
    if (!params){
      params = {...basePagination}
    }
    if(sort.sort){
      params.sort = sort.sort
      params.sort_type = sort.direction
    }

    setLoading(true);
    try {
      const { data, total } = await QueryUser(params, condition.value);
      renderData.value = data;
      pagination.current = params.current;
      pagination.total = total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  const route = useRoute()
  onMounted(() => {
    if (route.query.invite_by_email) {
      condition.value = { filter: [{ key: 'invite_by_email', condition: '=', value: route.query.invite_by_email, tempValue: '' }] }
      defaultCond.value.push({ key: 'invite_by_email', condition: '=', value: route.query.invite_by_email, tempValue: '' })
    }

    if (route.query.email) {
      condition.value = { filter: [{ key: 'email', condition: '模糊', value: route.query.email, tempValue: '' }] }
      defaultCond.value.push({ key: 'email', condition: '模糊', value: route.query.email, tempValue: '' })
    }
    QuerySubscription().then((r) => {
      let vals = [];
      r.data.forEach((item, index) => {
        vals.push({
          des: item.name,
          value: item.id,
        });
      });
      filter.value.push({
        key: 'plan_id',
        des: '订阅',
        op: ['='],
        type: 'select-multiple',
        value: vals,
      });
    });
    fetchData(basePagination);
  });

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
  queryPermissionGroup()
</script>

<script lang="ts">
  export default {
    name: 'userManager',
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
