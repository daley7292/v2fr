<template>
  <div class="container">
    <Breadcrumb :items="['menu.server', 'menu.server.permission_group']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-button type="primary" @click="showAddGroup">
          <template #icon>
            <icon-plus />
          </template>
          {{t('permission.form.add.permission.group')}}
        </a-button>
      </div>
      <a-table row-key="id" :loading="loading" :pagination="false" :columns="(cloneColumns as TableColumnData[])"
        :data="permissionData" :bordered="false">
        <template #user_count="{ record }">
          <icon-user />
          {{ record.user_count }}
        </template>
        <template #server_count="{ record }">
          <icon-storage />
          {{ record.server_count }}
        </template>

        <template #operations="{ record }">
          <a-space>
            <a-button type="primary" @click="editPermission(record)">{{t('button.edit')}}</a-button>
            <a-popconfirm :content="t('permission.delete')" @ok="deletePermission(record)" type="warning">
              <a-button type="primary" status="danger">{{t('button.delete')}}</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="showAddGroupModal" width="380px" :title="t('permission.form.add.permission.group')" :unmount-on-close="true" :footer="false">
      <permission-group-form :data="permissionForm" @close="closeModal" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import PermissionGroupForm from "@/views/admin/server/permission/components/permission-group-form.vue";
import {
  defaultPermissionGroup,
  DeletePermission,
  PermissionGroup,
  QueryPermission
} from "@/api/admin/server/permission";
import { Message } from "@arco-design/web-vue";

type Column = TableColumnData & { checked?: true };

const showAddGroupModal = ref(false)
const permissionForm = ref<PermissionGroup>(defaultPermissionGroup)
const showAddGroup = () => {
  permissionForm.value = defaultPermissionGroup
  showAddGroupModal.value = true
}

const editPermission = (value: PermissionGroup) => {
  permissionForm.value = value
  showAddGroupModal.value = true
}

const deletePermission = (value: any) => {
  DeletePermission({ id: value.id }).then(r => {
    if (r.data) {
      fetchData()
      Message.success({
        content: '删除成功'
      })
    }
  })
}

const closeModal = () => {
  showAddGroupModal.value = false
  fetchData()
}

const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const permissionData = ref<PermissionGroup[]>([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('permissionTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('permissionTable.columns.name'),
    dataIndex: 'name',
  },
  {
    title: t('permissionTable.columns.user_count'),
    dataIndex: 'user_count',
    slotName: 'user_count',
  },
  {
    title: t('permissionTable.columns.server_count'),
    dataIndex: 'server_count',
    slotName: 'server_count',
  },
  {
    title: t('permissionTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async () => {
  setLoading(true);
  try {
    const { data } = await QueryPermission();
    permissionData.value = data
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
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
  name: 'ServerPermissionGroup',
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
