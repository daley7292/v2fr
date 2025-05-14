<template>
  <div class="container">
    <Breadcrumb :items="['menu.target', 'menu.target.queue']" />
    <a-card style="overflow: hidden">
      <template #cover>
        <a-card class="card-title-bg">
          <div class="card-title">{{ t('queue.overview') }}</div>
        </a-card>
      </template>
      <a-row class="card-content">
        <a-col :span="6" class="card-line">
          <div>{{ t('queue.current_workload') }}</div>
          <div>{{queueStats?.jobsPerMinute }}</div>
        </a-col>
        <a-col :span="6" class="card-line">
          <div>{{ t('queue.recent_processing') }}</div>
          <div>{{  queueStats?.recentJobs }}</div>
        </a-col>
        <a-col :span="6" class="card-line">
          <div>{{ t('queue.error_count') }}</div>
          <div>{{ queueStats?.failedJobs }}</div>
        </a-col>
        <a-col :span="6" style="padding-left: 15px;">
          <div>{{ t('queue.status') }}</div>
          <div>{{ (queueStats?.status) ? t('queue.status_running') : t('queue.status_stopped') }}</div>
          <div class="status">
            <icon-check-circle style="color: rgb(57, 148, 57);" v-if="queueStats?.status" />
            <icon-close-circle style="color: red" v-else />
          </div>
        </a-col>
      </a-row>
    </a-card>

    <br />
    <a-card>
      <h4>{{ t('queue.current_job_details') }}</h4>
      <a-row style="font-weight: bold;">
        <a-col :span="6">{{ t('queue.queue_name') }}</a-col>
        <a-col :span="6">{{ t('queue.job_volume') }}</a-col>
        <a-col :span="6">{{ t('queue.task_volume') }}</a-col>
        <a-col :span="6">{{ t('queue.occupation_time') }}</a-col>
      </a-row>
      <div v-for="(item, index) in queueWorkload" :key="index">
        <a-row v-if="titles[item.name]">
          <a-col :span="6">{{ titles[item.name] }}</a-col>
          <a-col :span="6">{{ item.processes }}</a-col>
          <a-col :span="6">{{ item.length }}</a-col>
          <a-col style="text-align: right;" :span="6">{{ item.wait }}s</a-col>
        </a-row>
        <a-divider />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { GetQueueStats, GetQueueWorkload, QueueStats, QueueWorkload } from "@/api/admin/queue/queue";
import {onDeactivated, onMounted, onUnmounted, ref} from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const titles = {
  default: "",
  order_handle: t('queue.order_queue'),
  send_email: t('queue.email_queue'),
  send_email_mass: t('queue.mass_email_queue'),
  send_telegram: t('queue.telegram_queue'),
  traffic_fetch: t('queue.traffic_queue')
};

const queueStats = ref<QueueStats>();

const queueWorkload = ref<QueueWorkload[]>([]);

const query = ref<boolean>(true);

const queryQueue = () => {
  if (!query.value) {
    return ;
  }
  GetQueueStats().then(r => {
    queueStats.value = r.data;
  });
  GetQueueWorkload().then(r => {
    queueWorkload.value = r.data;
  });
  setTimeout(() => queryQueue(), 2500)
};

onUnmounted(()=>{
  query.value = false;
})

onMounted(() => {
  queryQueue();
});

</script>

<script lang="ts">
export default {
  name: "ServerNode"
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.card-title {
  position: absolute;
  top: 15px;
  left: 20px;
  font-size: 22px;
  font-weight: 400
}

.card-content {
  line-height: 60px;
  font-size: 18px;
}

.status {
  font-size: 100px;
  position: absolute;
  right: -27px;
  bottom: -27px;
}

.card-title-bg {
  height: 60px;
  background-color: #f8f9fc7a;
}

.card-line {
  padding-left: 15px;
  border-right: #7e7e7e44 1px solid;
}
</style>
