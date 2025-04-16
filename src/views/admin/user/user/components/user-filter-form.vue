<script setup lang="ts">
import {reactive} from "vue";

const props = defineProps(['data'])
const emits = defineEmits(['close'])
const form = reactive({
  name: '',
  posts: [{value: ''}]
})
const handleAdd = () => {
  form.posts.push({
    value: ''
  })
};
const handleDelete = (index) => {
  form.posts.splice(index, 1)
}

</script>

<template>
  <a-form  layout="vertical" :label-col-props="{}" :model="form" :style="{width:'600px'}">
    <div  v-for="(post,index) of form.posts">
      <a-row>
        <a-col :span="5">
          <a-form-item label="字段名"  :field="`filter[${index}][key]`">
            <a-select  default-value="email">
              <a-option value="email">邮箱</a-option>
              <a-option value="id">用户ID</a-option>
              <a-option value="plan_id">订阅</a-option>
              <a-option value="transfer_enable">流量</a-option>
              <a-option value="d">下行</a-option>
              <a-option value="expired_at">到期时间</a-option>
              <a-option value="uuid">UUID</a-option>
              <a-option value="token">TOKEN</a-option>
              <a-option value="banned">账号状态</a-option>
              <a-option value="invite_by_email">邀请人邮箱</a-option>
              <a-option value="invite_user_id">邀请人ID</a-option>
              <a-option value="remarks">备注</a-option>
              <a-option value="is_admin">管理员</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-form-item label="条件"  :field="`filter[${index}][condition]`">
            <a-select default-value="like">
              <a-option value="like">模糊</a-option>
              <a-option>等于</a-option>
              <a-option>小于</a-option>
              <a-option>大于</a-option>
              <a-option>小于等于</a-option>
              <a-option>大于等于</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8" :offset="1">
          <a-form-item label="欲检索内容"  :field="`filter[${index}][value]`">
            <a-select>
              <a-option>邮箱</a-option>
              <a-option>用户ID</a-option>
              <a-option>订阅</a-option>
              <a-option>流量</a-option>
              <a-option>下行</a-option>
              <a-option>到期时间</a-option>
              <a-option>UUID</a-option>
              <a-option>TOKEN</a-option>
              <a-option>邀请人邮箱</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="2" :offset="1">
          <a-form-item>
            <a-button style="width: 100%"  type="primary" status="danger" @click="handleDelete(index)" :style="{marginLeft:'10px'}">{{t('button.delete')}}</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </a-form>
  <div style="padding: 10px">
    <a-button style="width: 100%" type="primary" @click="handleAdd">添加条件</a-button>
  </div>
</template>

<style scoped lang="less">

</style>
