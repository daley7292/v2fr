<template>
  <div class="container">
    <a-card>
      <a-table :columns="columns" :data="list">
        <template #rate="{ record }">
          <a-tooltip :content="t('userSubscriptionStatus.tooltip.rate')">
            <a-tag class="status-tag">{{ record.rate }}x</a-tag>
          </a-tooltip>
        </template>
        <template #is_online="{ record }">
          <a-tooltip :content="t('userSubscriptionStatus.tooltip.online')">
            <span class="status-show" :style="'color:'+(record.is_online==1?'green':'red')">.</span>
          </a-tooltip>
        </template>
        <template #tags="{ record }">
          <a-space>
            <a-tag class="status-tag" v-for="(item,index) in record.tags">{{ item }}</a-tag>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ServerFetch, UserServerFetch} from "@/api/user/subscription/status";
import {onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const list = ref<ServerFetch[]>()
const columns = [
  {
    title: t('userSubscriptionStatus.name'),
    slotName: 'name',
    dataIndex: 'name',
  },
  {
    title: t('userSubscriptionStatus.is_online'),
    slotName: 'is_online',
    dataIndex: 'is_online',
    tooltip:true
  },
  {
    title: t('userSubscriptionStatus.rate'),
    slotName: 'rate',
    dataIndex: 'rate',
    tooltip:true
  },
  {
    title: t('userSubscriptionStatus.tag'),
    dataIndex: 'tags',
    slotName: 'tags',
  },
];
const userServerFetch = () => {
  UserServerFetch().then(r => {
    list.value = r.data
  })
}
onMounted(() => userServerFetch())
</script>
<script lang="ts">
export default {
  name: 'SubscriptionStatus',
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.status-tag {
  padding: 0 15px;
  text-align: center;
}

.status-show {
  font-size: 50px;
  line-height: 0px
}
</style>
