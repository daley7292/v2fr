<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { PermissionGroup, QueryPermissionGroup } from "@/api/admin/server/node";
import { SaveSubscription } from "@/api/admin/finance/subscription";
import { Message } from "@arco-design/web-vue";
import { useI18n } from 'vue-i18n';
import { adminUrl } from "@/utils/admin-url"


const { t } = useI18n();

// 查询并保存权限组信息
const permissionGroup = ref<PermissionGroup[]>([])
const queryPermissionGroup = async () => {
  const { data } = await QueryPermissionGroup()
  permissionGroup.value = data
}

// 价格字段列表，这些字段需要乘以100转换为分
const priceKeys = ["month_price", "quarter_price", "half_year_price", "year_price", "two_year_price", "three_year_price", "onetime_price", "reset_price"]

// 接收父组件传递的数据
const props = defineProps(['data'])
// 定义事件发射器
const emits = defineEmits(['close'])
// 关闭表单方法
const close = () => emits('close')
// 创建响应式表单数据
const subscriptionForm = reactive(props.data)

// 提交订阅表单
const submitSubscription = () => {
  let obj: any = {}
  // 处理表单数据，将价格字段转换为分
  Object.keys(subscriptionForm).forEach(key => {
    if (priceKeys.includes(key)) {
      obj[key] = subscriptionForm[key] * 100
    } else {
      obj[key] = subscriptionForm[key]
    }
  })

  // 保存订阅信息
  SaveSubscription(obj).then(r => {
    if (r.data) {
      Message.success("提交成功")
      close()
    }
  })
}

// 初始化时查询权限组
queryPermissionGroup()
</script>

<template>
  <div>
    <!-- 订阅表单 -->
    <a-form layout="vertical" ref="subscription" :model="subscriptionForm" @submit="submitSubscription">
      <!-- 名称字段 -->
      <a-form-item field="name" :label="t('subscription.form.name')">
        <a-input v-model="subscriptionForm.name" :placeholder="t('subscription.placeholder.name')" />
      </a-form-item>
      <!-- 描述字段 -->
      <a-form-item field="name" :label="t('subscription.form.description')">
        <a-textarea v-model="subscriptionForm.content" :placeholder="t('subscription.placeholder.description')" />
      </a-form-item>
      <!-- 价格设置区域 -->
      <a-row>
        <a-col :span="3">
          <a-form-item :label="t('subscription.form.monthly')">
            <a-input v-model="subscriptionForm.month_price" />
          </a-form-item>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-form-item :label="t('subscription.form.quarterly')">
            <a-input v-model="subscriptionForm.quarter_price" />
          </a-form-item>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-form-item :label="t('subscription.form.half_year')">
            <a-input v-model="subscriptionForm.half_year_price" />
          </a-form-item>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-form-item :label="t('subscription.form.yearly')">
            <a-input v-model="subscriptionForm.year_price" />
          </a-form-item>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-form-item :label="t('subscription.form.two_year')">
            <a-input v-model="subscriptionForm.two_year_price" />
          </a-form-item>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-form-item :label="t('subscription.form.three_year')">
            <a-input v-model="subscriptionForm.three_year_price" />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 一次性价格和重置套餐价格 -->
      <a-row>
        <a-col :span="11">
          <a-form-item :label="t('subscription.form.onetime')">
            <a-input v-model="subscriptionForm.onetime_price">
              <template #append>
                ￥
              </template>
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="12" :offset="1">
          <a-form-item :label="t('subscription.form.reset_package')">
            <a-input v-model="subscriptionForm.reset_price">
              <template #append>
                ￥
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 流量配置 -->
      <a-form-item :label="t('subscription.form.traffic')">
        <a-input v-model="subscriptionForm.transfer_enable">
          <template #append>
            GB
          </template>
        </a-input>
      </a-form-item>
      <!-- 权限组配置 -->
      <a-form-item>
        <template #label>
          <span>{{ t('subscription.form.permission_group') }}</span>
          <router-link :to="'/'+adminUrl+'/server/permission_group'">
            <a-button type="text">{{ t('subscription.form.add_permission_group') }}</a-button>
          </router-link>
        </template>
        <a-select :style="{ width: '100%' }" v-model="subscriptionForm.group_id"
          :placeholder="t('subscription.placeholder.select_permission')">
          <div v-for="(item, index) in permissionGroup" :key="index">
            <a-option :value="item.id">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <!-- 流量重置方式 -->
      <a-form-item field="post" :label="t('subscription.form.reset_method')">
        <a-select v-model="subscriptionForm.reset_traffic_method"
          :placeholder="t('subscription.placeholder.select_reset_method')">
          <a-option value="">{{ t('subscription.reset_method.system') }}</a-option>
          <a-option :value="0">{{ t('subscription.reset_method.monthly_first') }}</a-option>
          <a-option :value="3">{{ t('subscription.reset_method.yearly_first') }}</a-option>
          <a-option :value="1">{{ t('subscription.reset_method.monthly') }}</a-option>
          <a-option :value="5">{{ t('subscription.reset_method.quarterly') }}</a-option>
          <a-option :value="6">{{ t('subscription.reset_method.half_year') }}</a-option>
          <a-option :value="4">{{ t('subscription.reset_method.yearly') }}</a-option>
          <a-option :value="2">{{ t('subscription.reset_method.no_reset') }}</a-option>
        </a-select>
      </a-form-item>
      <!-- 最大容量限制 -->
      <a-form-item field="name" :label="t('subscription.form.max_capacity')">
        <a-input v-model="subscriptionForm.capacity_limit" :placeholder="t('subscription.placeholder.no_limit')" />
      </a-form-item>
      <!-- 速度限制 -->
      <a-form-item field="name" :label="t('subscription.form.speed_limit')">
        <a-input v-model="subscriptionForm.speed_limit" :placeholder="t('subscription.placeholder.no_speed_limit')" >
          <template #append>
            Mbps
          </template>
        </a-input>
      </a-form-item>
      <!-- IP限制 -->
      <a-form-item field="name" :label="t('subscription.form.ip_limit')">
        <a-input v-model="subscriptionForm.ip_limit" type="number"
          :placeholder="t('subscription.placeholder.ip_limit')" />
      </a-form-item>
      <!-- 设备数量限制 -->
      <a-form-item field="name" :label="t('subscription.form.device_count')">
        <a-input v-model="subscriptionForm.block_plant_cont" type="number"
          :placeholder="t('subscription.placeholder.max_devices')" />
      </a-form-item>
      <!-- 强制更新设置 -->
      <a-form-item field="name" :label="t('subscription.form.force_update')">
        <a-checkbox v-model="subscriptionForm.force_update" />
      </a-form-item>
      <!-- 表单按钮 -->
      <a-form-item>
        <a-button @click="close">{{ t('button.cancel') }}</a-button>
        <a-button type="primary" html-type="submit">{{ t('subscription.button.submit') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less"></style>
