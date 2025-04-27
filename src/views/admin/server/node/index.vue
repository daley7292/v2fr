<template>
  <div class="container">
    <Breadcrumb :items="['menu.server', 'menu.server.node']" />
    <a-card>
      <div style="margin-bottom: 15px">
        <a-space>
          <a-dropdown trigger="hover" position="bl">
            <a-button type="outline" size="medium">
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
            <template #content>
              <a-doption>
                <a-button  type="primary" status="success" style="background-color: rgb(72, 152, 81)" size="small" @click="showAddNode('shadowsocks')">Shadowsocks</a-button>
              </a-doption>
              <a-doption>
                <a-button type="primary" status="danger" size="small" style="background-color: rgb(203, 49, 128)" @click="showAddNode('vmess')">Vmess</a-button>
              </a-doption>
              <a-doption>
                <a-button type="primary" status="warning" size="small" style="background-color: rgb(234, 184, 84)" @click="showAddNode('trojan')">Trojan</a-button>
              </a-doption>
              <a-doption>
                <a-button type="primary" style="background-color: rgb(26, 26, 26)"  size="small" @click="showAddNode('hysteria')">Hysteria
                </a-button>
              </a-doption>
            </template>
          </a-dropdown>
          <a-input style="width: 160px" :placeholder="t('nodeTable.search.placeholder')" @input="searchList" />
        </a-space>
      </div>
      <a-table row-key="id" :loading="loading" :pagination="pagination" :columns="(cloneColumns as TableColumnData[])"
        :data="renderData" :bordered="false" :size="size" @page-change="onPageChange"  @page-size-change="pageSizeChange" @change="handleTableChange" :draggable="{ type: 'handle', width: 40 }">
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
<!--    'shadowsocks','vmess','trojan','hysteria'-->
        <template #id="{ record }">
          <a-button type="primary" status="success"  style="background-color: rgb(72, 152, 81)" size="mini" v-if="record.type===types[0]">{{ record.id }}</a-button>
          <a-button type="primary" status="danger" style="background-color: rgb(203, 49, 128) " size="mini" v-if="record.type===types[1]">{{ record.id }}</a-button>
          <a-button type="primary" status="warning" style="background-color: rgb(234, 184, 84)" size="mini"  v-if="record.type===types[2]">{{ record.id }}</a-button>
          <a-button type="primary"  size="mini" style="background-color: rgb(26, 26, 26)" v-if="record.type===types[3]">{{ record.id }}</a-button>

        </template>
        <template #show="{ record }">
          <a-switch size="small" :default-checked="record.show==1"  :checked-value="1" :unchecked-value="0" @change="changeShow(record)" />
        </template>
        <template #address="{ record }">
          <span  :style="(record.available_status==0?'color: red':record.available_status==1?'color:#faad14':'color: green')">●</span>  {{ record.host }}<span>:</span>{{ record.port }}
        </template>
        <template #online="{ record }">
          <icon-user />
          {{ record.online == null ? 0 : record.online }}
        </template>
        <template #rate="{ record }">
          <a-tag bordered>{{ record.rate }} X</a-tag>
        </template>
        <template #group_id="{ record }">
          <a-space wrap>
            <a-tag v-for="(tag, index) of record.group_id" :key="index" bordered>{{ groupPermission[tag] ? groupPermission[tag] : t('nodeTable.unknown') }}</a-tag>
          </a-space>
        </template>
        <template #operations="{ record }">
          <a-dropdown :popup-max-height="false">
            <a-button type="text">{{ t('nodeTable.operations.button') }}
              <icon-caret-down />
            </a-button>
            <template #content>
              <a-doption>
                <a-button type="text" @click="editNode(record)" status="success">
                  <icon-edit />
                  {{ t('nodeTable.operations.edit') }}
                </a-button>
              </a-doption>
              <a-doption>
                <a-button @click="copyNode(record)" type="text" status="warning">
                  <icon-copy />
                  {{ t('nodeTable.operations.copy') }}
                </a-button>
              </a-doption>
              <a-doption>
                <a-button @click="deleteNode(record)" type="text" status="danger">
                  <icon-delete />
                  {{ t('nodeTable.operations.delete') }}
                </a-button>
              </a-doption>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </a-card>
    <a-drawer :unmount-on-close="true" :footer="false" :width="500" :visible="showAddNodeModal" @ok="() => { showAddNodeModal = false }" :ok-text="t('nodeTable.drawer.ok')" :cancel-text="t('nodeTable.drawer.cancel')" @cancel="() => { showAddNodeModal = false }" >
      <template #title>
        {{ t('nodeTable.drawer.title') }}
      </template>
      <node-form  :parentServer="renderData" :channel-type="channel.channelType" :data="formData" @close="closeModal" />
    </a-drawer>

  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import NodeForm from "@/views/admin/server/node/components/node-form.vue";
import { CopyNode, newNode, DeleteNode, Node, UpdateNode, QueryNodes, NodeSort } from "@/api/admin/server/node";
import { Message } from "@arco-design/web-vue";
import { Page } from "@/api/admin/public";
import {QueryPermission} from "@/api/admin/server/permission";
import {PolicyParams} from "@/api/list";
import RouterForm from "@/views/admin/server/router/components/router-form.vue";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
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
const types = ['shadowsocks','vmess','trojan','hysteria']
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<Node[]>([]);
const renderDataTemp = ref<Node[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
let groupPermission = reactive({})
const queryGroupPer = ()=>{
  QueryPermission().then(r=>{
    if (r.data){
      r.data.forEach(v=>{
        groupPermission[v.id+''] = v.name
      })
    }
  })
}
const handleTableChange = (_data) => {
  renderData.value = _data
  let sort = {}
  _data.forEach((v:Node,index)=>{
    if (sort[v.type]){
      sort[v.type][v.id]=index
    }else{
      sort[v.type]= {}
      sort[v.type][v.id]=index
    }
  })
  NodeSort(sort)
}
const searchList = (value:string) => {
  if (value){
    let tempValue =[]
    let data = renderDataTemp.value
    data.forEach(v=>{
      let f=true
      Object.keys(v).forEach(k=>{
        if (f&&(v[k]+'').includes(value)){
          f=false
          tempValue.push(v)
        }
      })
    })
    renderData.value=tempValue
  }else{
    renderData.value=renderDataTemp.value
  }

}

const size = ref<SizeProps>('medium');
const showAddNodeModal = ref(false)
const channel = reactive({ channelType: '' })
const showAddNode = (channelType: string) => {
  channel.channelType = channelType
  let node = newNode;
  node.type = channelType
  formData.value = node
  showAddNodeModal.value = true
}

// 关闭modal框
const closeModal = () => {
  showAddNodeModal.value = false
  fetchData()
}

const editNode = (value: Node) => {
  formData.value = value
  channel.channelType = value.type
  showAddNodeModal.value = true
}

const changeShow =(value: Node)=>{
  UpdateNode({type:value.type,id:value.id,show:value.show==1?0:1}).then(r=>{
    fetchData()
  })
}

//节点编辑
const formData = ref<Node>(newNode)

const copyNode = (value: Node) => {
  CopyNode({ id: value.id ,type:value.type}).then(r => {
    if (r.data) {
      Message.success({
        content: t('nodeTable.message.copy.success')
      })
      fetchData()
    }
  })
}

const deleteNode = (value: Node) => {
  DeleteNode({ id: value.id ,type:value.type}).then(r => {
    if (r.data) {
      Message.success({
        content: t('nodeTable.message.delete.success')
      })
      fetchData()
    }
  })
}


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

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('nodeTable.columns.id'),
    dataIndex: 'id',
    slotName: 'id',
  },
  {
    title: t('nodeTable.columns.show'),
    slotName: 'show',
  },
  {
    title: t('nodeTable.columns.name'),
    dataIndex: 'name',
    slotName: 'name',
  },
  {
    title: t('nodeTable.columns.address'),
    slotName: 'address',
  },
  {
    title: t('nodeTable.columns.online'),
    slotName: 'online',
  },
  {
    title: t('nodeTable.columns.rate'),
    slotName: 'rate',
  },
  {
    title: t('nodeTable.columns.group_id'),
    slotName: 'group_id',
  },
  {
    title: t('nodeTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const fetchData = async (params: PolicyParams) => {
  if (!params){
    params = {...basePagination}
  }
  setLoading(true);
  try {
    const { data } = await QueryNodes(params);
    renderData.value = data;
    renderDataTemp.value = data;
    // renderData.value = data.list;
    // pagination.current = params.current;
    pagination.total = data.length;
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
  fetchData({ ...basePagination, current });
};

fetchData(basePagination);
const reset = () => {
  formModel.value = generateFormModel();
};

const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  e: Event
) => {
  size.value = val as SizeProps;
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

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        },
      });
    });
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
  { deep: true, immediate: true }
);
onMounted(()=>{
  queryGroupPer()
})
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

.size-block-group {
  width: 36px;
  height: 20px;
  border: solid #d5d5d5 1px;
  line-height: 18px;
  border-radius: 3px;
  text-align: center
}

.size-block {
  width: 80px;
  height: 20px;
  border: solid #d5d5d5 1px;
  line-height: 18px;
  border-radius: 3px;
  text-align: center
}
</style>
